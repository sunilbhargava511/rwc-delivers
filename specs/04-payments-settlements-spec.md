# Payments & Settlements — App Spec

**Version:** 1.0
**Date:** March 17, 2026
**Status:** Build-Ready Draft

---

## 1. Overview

The Payments & Settlements system handles all money movement in RWC Delivers: charging customers, collecting delivery fees, processing tips, paying restaurants, and tracking the city's subscription revenue. It is built entirely on Stripe Connect, which handles PCI compliance, fund routing, and payouts so we never touch sensitive financial data directly.

This is not a standalone app with its own UI — it is a backend system with reporting surfaces embedded in the Restaurant Dashboard (restaurant earnings) and the Dispatch Admin UI (city program economics).

**Primary users:** Restaurant owners (view earnings/payouts), City Program Coordinator (view program economics)
**System users:** Stripe webhooks, order lifecycle events

---

## 2. Goals

- Charge customers reliably at checkout with minimal friction (saved cards, Apple Pay, Google Pay)
- Route money correctly: restaurant gets food revenue, city program gets subscription + delivery fees, driver tips go to drivers
- Pay restaurants weekly with clear, transparent settlement reports
- Give the city a real-time view of program economics (revenue, costs, sustainability trajectory)
- Maintain PCI compliance by never storing card data — Stripe handles everything

---

## 3. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Payment processing | Stripe (Payment Intents API) | Industry standard, PCI compliant |
| Multi-party payouts | Stripe Connect (Express accounts) | Each restaurant is a connected account; automated payouts |
| Customer payment methods | Stripe Elements + Payment Request API | Card entry, Apple Pay, Google Pay |
| Subscriptions | Stripe Billing | Restaurant $399/mo subscription |
| Backend | Next.js API Routes | Webhook handlers, settlement calculations |
| Database | Supabase (shared) | Payment records, settlement history |
| Reporting | Custom dashboard pages | Embedded in Restaurant Dashboard + Admin UI |

---

## 4. Money Flow

### 4.1 Per-Order Flow

When a customer places a $30 order with a $4.50 delivery fee and $5 tip:

```
Customer pays: $39.50
  ├── Food subtotal:    $30.00 → Restaurant
  ├── Delivery fee:      $4.50 → City Program (driver wages fund)
  ├── Tip:               $5.00 → Driver
  └── Stripe fees:      ~$1.45 → Stripe (2.9% + $0.30)

Stripe processing fees are deducted from the city program's portion.
Restaurant receives 100% of food revenue — no commission.
```

### 4.2 Monthly Subscription Flow

Each restaurant pays $399/month:

```
Restaurant subscription: $399.00/mo
  ├── Platform operation:  $399.00 → City Program
  └── Stripe fees:         ~$11.87 → Stripe

30 restaurants × $399 = $11,970/mo in subscription revenue
```

### 4.3 Who Pays Stripe Fees?

| Transaction Type | Who Absorbs Stripe Fees |
|-----------------|------------------------|
| Customer order payment | City program (from delivery fee portion) |
| Restaurant subscription | City program |
| Restaurant payout | No additional fee (included in Connect) |

This keeps it simple: restaurants see exactly $399/month and 100% of food revenue. The city absorbs processing costs as a program expense.

---

## 5. Stripe Connect Architecture

### 5.1 Account Structure

```
RWC Delivers Platform Account (City of Redwood City)
  ├── Connected Account: La Viga (Express)
  ├── Connected Account: Mazra (Express)
  ├── Connected Account: Nomadic Kitchen (Express)
  ├── ... (30 restaurants)
  └── Platform balance (subscriptions + delivery fees - Stripe fees)
```

**Express accounts** are the right choice for restaurants: Stripe hosts the onboarding flow (collects bank info, tax ID, identity verification), and restaurants get a Stripe-hosted dashboard to view their payouts. We don't need to build payout management UI.

### 5.2 Restaurant Onboarding (Stripe Connect)

1. Program Coordinator triggers "Set up payments" in Restaurant Dashboard
2. We create a Stripe Connect account link → redirect restaurant owner to Stripe's hosted onboarding
3. Owner enters: bank account, tax ID (EIN or SSN), identity verification
4. Stripe verifies and activates the account
5. Our webhook receives `account.updated` → marks restaurant as payment-ready
6. First subscription charge: we create a Stripe Subscription on the connected account

---

## 6. Payment Flows (Detailed)

### 6.1 Customer Checkout

```
1. Customer clicks "Place Order" on Marketplace
2. Frontend calls POST /api/orders
3. Backend:
   a. Validates order (items, prices, delivery zone)
   b. Creates Stripe PaymentIntent (charge immediately, not authorize-then-capture):
      - amount: total (subtotal + delivery fee + tip)
      - application_fee_amount: delivery fee + tip (goes to platform)
      - transfer_data.destination: restaurant's Stripe Connect account
      - capture_method: 'automatic' (default — charge immediately)
      - (Restaurant automatically receives: total - application_fee)
   c. Returns client_secret to frontend
4. Frontend confirms PaymentIntent with Stripe.js (card/Apple Pay/Google Pay)
5. Stripe webhook: payment_intent.succeeded
6. Backend: update order status, trigger restaurant notification
```

**Key detail:** We use Stripe's "destination charge" model with immediate capture. The customer is charged at checkout. If the order is cancelled before the restaurant starts preparing, we issue a full refund via Stripe Refund API. This is simpler than authorize-then-capture (no expired authorizations, no manual capture step) and matches how DoorDash and other delivery platforms work.

### 6.2 Tip Handling

Tips are collected as part of the application fee, then distributed to drivers:

- Tips accumulate in the platform account
- At end of each shift, Program Coordinator runs tip distribution
- Tips are transferred to drivers via the city's payroll system (not Stripe — drivers are W-2 employees paid through city payroll)
- The platform tracks tip amounts per delivery for payroll integration

### 6.3 Restaurant Subscription

```
1. Restaurant completes Stripe Connect onboarding
2. We create a Stripe Subscription:
   - customer: restaurant's Stripe customer object
   - price: $399/month (pre-created Stripe Price)
   - payment method: bank account (ACH) or card
3. Stripe auto-charges monthly
4. Webhook: invoice.paid → record subscription payment
5. Webhook: invoice.payment_failed → alert Program Coordinator
```

### 6.4 Restaurant Payouts

Stripe Connect handles payouts automatically:

- Default: weekly payouts (every Monday for previous week's earnings)
- Restaurant earnings accumulate in their connected account balance
- Stripe transfers to their bank account on the payout schedule
- Restaurant can view payout history in their Stripe Express dashboard (linked from our Restaurant Dashboard)

---

## 7. Data Models

### `payments`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| order_id | uuid (FK) | → orders.id |
| stripe_payment_intent_id | text | |
| customer_id | uuid (FK) | → customers.id |
| restaurant_id | uuid (FK) | → restaurants.id |
| amount_total | integer | Cents (what customer paid) |
| amount_subtotal | integer | Cents (food) |
| amount_delivery_fee | integer | Cents |
| amount_tip | integer | Cents |
| amount_stripe_fee | integer | Cents (estimated) |
| application_fee_amount | integer | Cents (delivery fee + tip) |
| status | enum | `pending`, `succeeded`, `failed`, `refunded` |
| created_at | timestamptz | |

### `subscriptions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| restaurant_id | uuid (FK) | → restaurants.id |
| stripe_subscription_id | text | |
| stripe_customer_id | text | |
| plan_amount | integer | Cents (39900 = $399) |
| status | enum | `active`, `past_due`, `cancelled` |
| current_period_start | timestamptz | |
| current_period_end | timestamptz | |
| created_at | timestamptz | |

### `subscription_invoices`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| subscription_id | uuid (FK) | → subscriptions.id |
| stripe_invoice_id | text | |
| amount | integer | Cents |
| status | enum | `paid`, `failed`, `pending` |
| period_start | date | |
| period_end | date | |
| paid_at | timestamptz | |

### `restaurant_settlements`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| restaurant_id | uuid (FK) | |
| period_start | date | |
| period_end | date | |
| order_count | integer | |
| gross_food_revenue | integer | Cents |
| stripe_payout_id | text | |
| payout_amount | integer | Cents (what hit their bank) |
| status | enum | `pending`, `paid`, `failed` |

### `tip_records`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| order_id | uuid (FK) | |
| delivery_assignment_id | uuid (FK) | → delivery_assignments.id |
| driver_id | uuid (FK) | → drivers.id (stable reference for payroll aggregation) |
| driver_name | text | Snapshot for display |
| amount | integer | Cents |
| shift_date | date | For payroll grouping |
| paid_via_payroll | boolean | Default: false |

---

## 8. API Endpoints

### Payments (internal, triggered by order flow)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payments/create-intent` | Create PaymentIntent for new order |
| POST | `/api/webhooks/stripe` | Handle all Stripe webhooks (shared endpoint) |

### Restaurant Earnings (Dashboard)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/earnings` | Current period earnings summary |
| GET | `/api/dashboard/earnings/history` | Past settlement periods |
| GET | `/api/dashboard/earnings/doordash-comparison` | Calculated savings vs. 25% commission |
| GET | `/api/dashboard/subscription` | Subscription status and billing history |

### Program Economics (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/economics/overview` | Platform-wide financials |
| GET | `/api/admin/economics/revenue` | Subscription + delivery fee revenue |
| GET | `/api/admin/economics/costs` | Driver wages, Onfleet, Stripe fees, hosting |
| GET | `/api/admin/economics/sustainability` | Break-even tracking, projections |
| GET | `/api/admin/tips/summary` | Tips by driver by shift (for payroll) |
| POST | `/api/admin/tips/mark-paid` | Mark tips as processed through payroll |

---

## 9. Reporting Surfaces

### 9.1 Restaurant Earnings (in Restaurant Dashboard)

- **This week's earnings:** Total food revenue, order count, average order value
- **DoorDash comparison:** "You earned $8,200 this week. On DoorDash at 25% commission, you'd have kept $6,150. You saved $2,050."
- **Payout history:** Table of past payouts with dates and amounts
- **Subscription status:** Next billing date, payment method on file

### 9.2 Program Economics (in Admin UI)

- **Revenue dashboard:** Monthly subscription revenue + delivery fee revenue
- **Cost dashboard:** Driver wages, Onfleet costs, Stripe fees, hosting/infra
- **Sustainability gauge:** Revenue vs. costs, break-even progress
- **City investment tracker:** How much city subsidy remains, projected exhaustion date
- **ROI calculator:** "$X kept in local economy" — the headline number for council reporting
- **Tip report:** Exportable CSV of tips by driver by shift for city payroll processing

---

## 10. Refund Policy & Handling

| Scenario | Action |
|----------|--------|
| Customer cancels before restaurant confirms | Full refund (automatic) |
| Customer cancels after restaurant starts preparing | No refund (food cost incurred) |
| Order never delivered (driver/system failure) | Full refund + restaurant still paid for food |
| Food quality issue (customer complaint) | Program Coordinator reviews case → partial or full refund at discretion |
| Wrong items delivered | Full refund or re-delivery at restaurant's choice |

**Refund mechanics:** Stripe Refund API against the original PaymentIntent. If restaurant was already paid, the refund comes from the platform balance (city absorbs the cost as a program expense, then works with the restaurant offline if needed).

---

## 11. Tax Considerations

- **Sales tax:** California requires sales tax on food delivery. Stripe Tax can calculate and collect automatically. Tax is added at checkout and remitted by the city (as the platform operator) or by each restaurant individually — needs legal guidance.
- **1099 reporting:** Not applicable for drivers (W-2 employees). Restaurants receive 1099-K from Stripe if they exceed the threshold.
- **Restaurant subscription:** Likely not subject to sales tax (B2B software service), but confirm with city finance.

---

## 12. Security & Compliance

- **PCI DSS:** Stripe handles all card data. Our servers never see card numbers. Stripe.js + Elements keep us in SAQ-A scope (simplest PCI compliance level).
- **Financial data access:** Only restaurant owners see their own earnings. Only Program Coordinator + city admin see platform-wide financials. Enforced by Supabase row-level security.
- **Stripe Connect compliance:** Express accounts mean Stripe handles KYC/AML for restaurants. We don't collect or store bank account numbers.

---

## 13. Open Questions

- [ ] Sales tax collection and remittance — who is responsible, city or individual restaurants?
- [ ] Tip distribution timing — real-time per delivery or pooled per shift?
- [ ] Refund budget — should the city set aside a monthly refund reserve?
- [ ] Subscription billing date — first of month for all, or rolling from signup date?
- [ ] ACH vs. card for subscriptions — ACH is cheaper but slower to set up
