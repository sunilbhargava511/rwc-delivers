# RWC Delivers — System Architecture

**Version:** 2.0
**Date:** March 18, 2026
**Status:** Build-Ready Draft

---

## 1. Executive Summary

RWC Delivers is a city-powered delivery platform composed of four applications sharing a common backend. This document describes how they fit together: the shared infrastructure, data flows between apps, integration points with third-party services, deployment strategy, and the order lifecycle that connects everything.

The architecture prioritizes three things: low operational overhead (the city is not a tech company), fast time-to-market (AI-assisted development), and a cost structure that works for a 30-restaurant municipal program.

---

## 2. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER LAYER                               │
│                                                                     │
│   ┌─────────────────┐                    ┌──────────────────────┐   │
│   │   RWC Delivers   │                    │  Restaurant Dashboard │  │
│   │   Marketplace    │                    │                      │  │
│   │   (PWA)          │                    │  (Web App)           │  │
│   │                  │                    │                      │  │
│   │  • Browse/Order  │                    │  • Order Management  │  │
│   │  • Track Delivery│                    │  • Menu Editor       │  │
│   │  • Account       │                    │  • Earnings/Analytics│  │
│   └────────┬─────────┘                    └──────────┬───────────┘  │
│            │                                          │              │
│   ┌────────┴──────────────────────────────────────────┴───────────┐ │
│   │                    Dispatch Admin UI                           │ │
│   │            (Program Coordinator Web App)                      │ │
│   │  • Live Map • Driver Schedule • Performance • Economics       │ │
│   └──────────────────────────┬────────────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                        API LAYER                                    │
│                                                                     │
│   ┌──────────────────────────┴────────────────────────────────────┐ │
│   │              Next.js API Routes (Vercel Serverless)           │ │
│   │                                                               │ │
│   │  /api/restaurants/*    Public restaurant & menu data          │ │
│   │  /api/orders/*         Order placement & tracking            │ │
│   │  /api/auth/*           Customer authentication (OTP)         │ │
│   │  /api/dashboard/*      Restaurant dashboard endpoints        │ │
│   │  /api/admin/*          Program coordinator endpoints         │ │
│   │  /api/payments/*       Payment intent creation               │ │
│   │  /api/webhooks/*       Stripe + Shipday webhook receivers    │ │
│   └──────────────────────────┬────────────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                        DATA LAYER                                   │
│                                                                     │
│   ┌──────────────────────────┴────────────────────────────────────┐ │
│   │                   Supabase (PostgreSQL)                       │ │
│   │                                                               │ │
│   │  • All application data (restaurants, orders, menus, etc.)   │ │
│   │  • Auth (customer + restaurant staff accounts)               │ │
│   │  • Row-Level Security (data isolation per restaurant)        │ │
│   │  • Realtime subscriptions (order status → all apps)          │ │
│   │  • Storage (menu photos, restaurant banners)                 │ │
│   └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                    THIRD-PARTY SERVICES                              │
│                                                                     │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│   │    Stripe     │  │   Shipday    │  │   Twilio     │             │
│   │   Connect     │  │              │  │              │             │
│   │              │  │  • Driver App │  │  • SMS OTP   │             │
│   │  • Payments  │  │  • GPS Track  │  │  • Order     │             │
│   │  • Payouts   │  │  • Proof of   │  │    alerts    │             │
│   │  • Billing   │  │    Delivery   │  │              │             │
│   └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│   │   Mapbox     │  │   PostHog    │  │   Vercel     │             │
│   │              │  │              │  │              │             │
│   │  • Geocoding │  │  • Analytics │  │  • Hosting   │             │
│   │  • Maps      │  │  • Events    │  │  • CDN       │             │
│   │  • Zone      │  │  • Funnels   │  │  • CI/CD     │             │
│   │    validation│  │              │  │              │             │
│   └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Application Inventory

| App | Spec Doc | Users | Deployment |
|-----|----------|-------|------------|
| **Marketplace** | `01-marketplace-spec.md` | Customers (public) | `marketplace.rwcdelivers.com` |
| **Restaurant Dashboard** | `02-restaurant-dashboard-spec.md` | Restaurant owners/staff | `dashboard.rwcdelivers.com` |
| **Delivery Dispatch** | `03-delivery-dispatch-spec.md` | Program Coordinator, drivers | `dispatch.rwcdelivers.com` |
| **Payments & Settlements** | `04-payments-settlements-spec.md` | Backend system (no standalone UI) | Embedded in Dashboard + Dispatch |

All four apps are Next.js projects in a monorepo, sharing a common Supabase backend, UI component library, and type definitions.

---

## 4. Monorepo Structure

```
rwc-delivers/
├── apps/
│   ├── marketplace/          # Customer-facing PWA
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # Marketplace-specific components
│   │   └── next.config.js
│   ├── dashboard/            # Restaurant Dashboard
│   │   ├── app/
│   │   ├── components/
│   │   └── next.config.js
│   └── dispatch/             # Dispatch Admin UI
│       ├── app/
│       ├── components/
│       └── next.config.js
├── packages/
│   ├── ui/                   # Shared component library (Tailwind)
│   │   ├── components/       # Button, Card, Modal, etc.
│   │   └── styles/           # Shared Tailwind config + design tokens
│   ├── db/                   # Supabase client, types, queries
│   │   ├── client.ts         # Supabase client initialization
│   │   ├── types.ts          # Auto-generated from Supabase schema
│   │   └── queries/          # Shared query functions
│   ├── payments/             # Stripe integration logic
│   │   ├── stripe.ts         # Stripe client
│   │   ├── intents.ts        # PaymentIntent creation
│   │   ├── subscriptions.ts  # Subscription management
│   │   └── webhooks.ts       # Webhook handler logic
│   └── shared/               # Constants, utils, types
│       ├── constants.ts      # Zone-dependent delivery fees, zone config, etc.
│       ├── order-status.ts   # Status enum + transition rules
│       └── utils.ts          # Date formatting, currency, etc.
├── supabase/
│   ├── migrations/           # Database migrations (version controlled)
│   ├── seed.sql              # Test data for development
│   └── config.toml           # Supabase project config
├── turbo.json                # Turborepo config
├── package.json              # Root workspace config
└── .env.example              # Environment variables template
```

**Tooling:** Turborepo for monorepo management (shared builds, caching, task dependencies).

---

## 5. Shared Database Schema

All four apps read/write to the same Supabase PostgreSQL database. Here is the complete entity relationship map:

```
customers ──────────────┐
  └── addresses          │
                         │
restaurants ─────────────┤
  ├── restaurant_hours   │
  ├── restaurant_closures│
  ├── restaurant_staff   │
  ├── menu_categories    │
  │     └── menu_items   │
  │          └── modifier_groups
  │               └── modifier_options
  ├── subscriptions      │
  │     └── subscription_invoices
  └── restaurant_settlements
                         │
orders ──────────────────┤ (FK: customer_id, restaurant_id)
  ├── order_items        │ (FK: menu_item_id)
  ├── payments           │ (FK: order_id)
  ├── delivery_assignments (FK: order_id, driver_id)
  └── tip_records        │ (FK: order_id, delivery_assignment_id)
                         │
drivers ─────────────────┤ (stable identity for all delivery drivers)
  └── driver_shifts      │ (FK: driver_id)
                         │
delivery_zones ──────────┘ (multiple active zones, each with GeoJSON polygon, fee, batch triggers)
dispatch_events ─────────  (FK: order_id, event log)
```

**Required database indexes** (include in Phase 1 migration):

| Table | Column(s) | Why |
|-------|-----------|-----|
| `orders` | `restaurant_id` | Dashboard queries all orders for a restaurant |
| `orders` | `customer_id` | Order history lookups |
| `orders` | `status` | Active order filtering (placed, confirmed, en_route) |
| `orders` | `placed_at` | Date-range queries for analytics |
| `order_items` | `order_id` | Join to orders for detail views |
| `payments` | `order_id` | Payment lookup per order |
| `delivery_assignments` | `order_id` | Delivery status per order |
| `delivery_assignments` | `driver_id` | Driver performance queries |
| `menu_items` | `restaurant_id` | Menu loading for Marketplace |
| `menu_items` | `category_id` | Menu grouped by category |
| `tip_records` | `driver_id, shift_date` | Payroll aggregation |
| `driver_shifts` | `driver_id, shift_date` | Schedule lookups |
| `dispatch_events` | `order_id` | Debugging delivery issues |

**Row-Level Security (RLS) policies:**
- Customers can only read/write their own data and orders
- Restaurant staff can only access their own restaurant's data (filtered by `restaurant_id` on `restaurant_staff`)
- City admin role has read access to all restaurants (for aggregate reporting)
- Public endpoints (restaurant list, menus) use service role with read-only policies

---

## 6. The Order Lifecycle (Cross-App Flow)

This is the central flow that connects all four apps. Each step shows which app is involved and what data changes:

```
Step 1: CUSTOMER PLACES ORDER
├── App: Marketplace
├── Actions:
│   • Validate items, prices, identify delivery zone
│   • Apply zone-specific delivery fee and ETA
│   • Create order record (status: placed, zone_id set)
│   • Create Stripe PaymentIntent (charge immediately — refund if cancelled)
│   • Return confirmation to customer
└── Data: orders, order_items, payments (status: succeeded)

Step 2: RESTAURANT RECEIVES & ACCEPTS ORDER
├── App: Restaurant Dashboard (via Supabase Realtime subscription)
├── Actions:
│   • Audio chime + push notification
│   • Restaurant staff reviews and accepts
│   • Sets prep time estimate
│   • Order status → confirmed
│   • Order enters zone dispatch queue
└── Triggers: Dispatch engine evaluates zone batch triggers

Step 3: DRIVER ASSIGNED
├── App: Delivery Dispatch (custom zone batching engine)
├── Actions:
│   • Zone A: immediate dispatch; Zones B/C/D: batch trigger fires
│   • Dispatch app selects driver and creates Shipday order (assigned to specific driver)
│   • Create delivery_assignment record
│   • Order status → driver_assigned
└── Data visible in: Marketplace (tracking), Dashboard (driver info)

Step 4: DRIVER PICKS UP ORDER
├── App: Delivery Dispatch (Shipday driver app)
├── Actions:
│   • Driver arrives at restaurant, marks pickup
│   • Shipday webhook → our API
│   • Order status → en_route
└── Data visible in: Marketplace (live tracking map via Shipday)

Step 5: ORDER DELIVERED
├── App: Delivery Dispatch (Shipday driver app)
├── Actions:
│   • Driver marks delivery complete (optional photo)
│   • Shipday webhook → our API
│   • Order status → delivered
│   • Record tip for driver payroll
│   • (Payment already captured at checkout — no action needed)
└── Data: tip_records created

Step 6: SETTLEMENT
├── App: Payments & Settlements (automated)
├── Actions:
│   • Stripe Connect auto-transfers restaurant earnings
│   • Weekly payout to restaurant's bank account
│   • Tip records exported for city payroll
│   • Settlement record created
└── Data: restaurant_settlements, tip_records (paid_via_payroll: true)
```

---

## 7. Real-Time Data Flow

Supabase Realtime is the backbone that keeps all apps in sync without polling:

| Event | Producer | Consumers | Channel |
|-------|----------|-----------|---------|
| New order placed | Marketplace | Restaurant Dashboard | `orders:restaurant_id=X` |
| Order status change | Dashboard / Webhooks | Marketplace, Dashboard, Dispatch | `orders:id=X` |
| Driver location update | Shipday webhook | Marketplace (tracking page) | `delivery_assignments:order_id=X` |
| Menu item 86'd | Dashboard | Marketplace | `menu_items:restaurant_id=X` |
| Restaurant goes offline | Dashboard | Marketplace | `restaurants:id=X` |

**Pattern:** Each app subscribes to the Supabase Realtime channels relevant to its view. When any app (or webhook handler) writes to the database, all subscribers receive the update within 1–3 seconds.

---

## 8. Webhook Architecture

External services communicate with our system via webhooks. All webhooks hit a single API route that dispatches to handlers:

```
POST /api/webhooks/stripe
  ├── payment_intent.succeeded  → Confirm order payment
  ├── payment_intent.payment_failed → Mark payment failed, alert customer
  ├── invoice.paid → Record subscription payment
  ├── invoice.payment_failed → Alert Program Coordinator
  └── account.updated → Update restaurant payment-ready status

POST /api/webhooks/shipday
  ├── order.assigned → Update order: driver_assigned
  ├── driver.arrived → Update order: driver at restaurant
  ├── order.pickedup → Update order: en_route
  ├── order.delivered → Update order: delivered
  ├── order.failed → Alert coordinator, reassign
  └── driver.location → Update tracking data
```

**Webhook reliability:**
- Verify signatures (Stripe: `stripe-signature` header; Shipday: webhook secret)
- Idempotent handlers (use Stripe event ID / Shipday order ID to deduplicate)
- Log all webhook events to `dispatch_events` table for debugging
- Stripe retries failed webhooks automatically; Shipday has similar retry logic

---

## 9. Authentication & Authorization

### 9.1 Customer Auth (Marketplace)

- **Method:** Phone OTP via Supabase Auth
- **Why:** Customers ordering food want speed, not password management. Phone OTP is 1-tap on mobile.
- **Session:** Supabase JWT, refreshed automatically
- **Guest checkout:** Supported — account creation prompted after first order

### 9.2 Restaurant Staff Auth (Dashboard)

- **Method:** Email + password via Supabase Auth
- **Why:** Restaurant accounts are persistent, shared across staff. Password-based is appropriate.
- **Roles:** Owner / Manager / Kitchen (stored in `restaurant_staff` table, enforced by RLS)
- **Onboarding:** Program Coordinator creates account, owner receives invite email

### 9.3 City Admin Auth (Dispatch)

- **Method:** Email + password via Supabase Auth
- **Role:** `city_admin` flag on user profile
- **Access:** Read-only across all restaurants; full access to dispatch and economics

### 9.4 API Security

- All API routes validate Supabase JWT
- RLS policies enforce data isolation at the database level (defense in depth)
- Webhook endpoints validate signatures (no JWT required)
- Rate limiting via Vercel's built-in edge rate limiter:
  - `POST /api/orders`: max 5 per customer per hour, max 1 per second per IP
  - `POST /api/auth/otp/send`: max 3 per phone number per 10 minutes (prevents SMS abuse)
  - Webhook endpoints: no rate limit (Stripe/Shipday control their own send rate)
  - All other authenticated endpoints: max 60 requests per minute per user

---

## 10. Third-Party Service Map

| Service | Purpose | Used By | Est. Monthly Cost |
|---------|---------|---------|-------------------|
| **Supabase** (Pro) | Database, auth, realtime, storage | All apps | $25/mo |
| **Vercel** (Pro) | Hosting, CDN, serverless functions | All apps | $20/mo |
| **Stripe** | Payments, Connect, Billing | Payments system | ~2.9% + $0.30/txn |
| **Shipday** | Driver app, GPS tracking, proof of delivery | Dispatch | ~$147/mo |
| **Twilio** | SMS (OTP, order notifications) | Marketplace, Dashboard | $50–100/mo |
| **Mapbox** | Geocoding, maps, zone validation | Marketplace, Dispatch | $0–50/mo (free tier) |
| **PostHog** | Analytics, funnels, feature flags | All apps | $0 (free tier) |
| **Resend** | Transactional email (receipts, invites) | All apps | $0–20/mo |
| **Sentry** | Error tracking, performance monitoring | All apps | $0 (free tier — 5K errors/mo) |

**Total infrastructure cost estimate: $350–550/month** (excluding Stripe transaction fees, which are covered by delivery fees).

---

## 11. Deployment Strategy

### 11.1 Environments

| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Local dev | Development | `localhost:3000/3001/3002` |
| Preview | PR previews, staging | `*.vercel.app` (auto-generated) |
| Production | Live platform | `*.rwcdelivers.com` |

### 11.2 CI/CD Pipeline

```
Push to main branch
  └→ Turborepo detects which apps changed
     └→ Build only affected apps
        └→ Run type checks + linting
           └→ Run tests
              └→ Deploy to Vercel (auto)
                 └→ Run Supabase migrations (if any)
```

**Database migrations:** Managed via Supabase CLI. Migrations are version-controlled in `/supabase/migrations/`. Applied automatically on deploy via GitHub Actions.

### 11.3 Domain Setup

| Domain | App |
|--------|-----|
| `rwcdelivers.com` | Marketplace (customer-facing) |
| `dashboard.rwcdelivers.com` | Restaurant Dashboard |
| `dispatch.rwcdelivers.com` | Dispatch Admin UI |
| `api.rwcdelivers.com` | API routes (optional — can use app-specific routes) |

---

## 12. Development Approach

### 12.1 AI-Assisted Development

As noted in the pitch deck, these apps will be built using modern AI coding tools (Cursor, Claude Code, etc.). The architecture supports this:

- **Next.js + Supabase** is extremely well-documented and common in AI training data
- **Monorepo with clear boundaries** means AI can work on one app at a time without breaking others
- **Typed database schema** (auto-generated from Supabase) reduces AI hallucination on data shapes
- **Third-party APIs for hard problems** (Shipday, Stripe) means we're writing integration code, not building driver apps from scratch

### 12.2 Build Order

| Phase | What | Duration | Dependency |
|-------|------|----------|------------|
| 1 | Database schema + Supabase setup | 1 week | None |
| 2 | Restaurant Dashboard (menu + orders) | 2 weeks | Phase 1 |
| 3 | Marketplace (browse + order) | 2 weeks | Phase 1 |
| 4 | Stripe Connect integration | 1 week | Phases 2–3 |
| 5 | Shipday integration + Dispatch UI + zone batching | 1.5 weeks | Phase 2 |
| 6 | Real-time tracking + notifications | 1 week | Phases 3–5 |
| 7 | Analytics dashboards + admin | 1 week | All above |
| 8 | Testing, polish, onboard first restaurant | 1.5 weeks | All above |

**Estimated total: 10–12 weeks** for a working v1 with a single developer + AI tooling.

---

## 13. Database Hosting: Supabase vs. Railway

**Current choice: Supabase (hosted PostgreSQL + Auth + Realtime + Storage)**

| Concern | Supabase (current) | Railway PostgreSQL | Verdict |
|---------|-------------------|-------------------|---------|
| PostgreSQL | Included (Pro: 8GB RAM, 100GB storage) | Full control, any size | Both work at this scale |
| Auth (phone OTP, JWT) | Built in | Must build or add (e.g., Auth.js, Clerk) | Supabase saves ~2 weeks |
| Realtime subscriptions | Built in (Postgres changes → WebSocket) | Must build (pg_notify + custom WS server) | Supabase saves ~3 weeks |
| File storage | Built in (S3-compatible) | Must add (S3, Cloudflare R2) | Supabase simpler |
| Connection limits | 100 Realtime connections (Pro) | No artificial limits | Railway wins at scale |
| Cost | $25/mo (Pro) | ~$10–20/mo for equivalent instance | Similar |
| Lock-in risk | Moderate — uses standard Postgres under the hood | None — raw Postgres | Railway wins |
| Ops overhead | Zero (managed) | Low (Railway handles infra) | Similar |

**Decision:** Use Supabase for v1. The Auth, Realtime, and Storage features save 4–6 weeks of development time. At 30 restaurants and 100 deliveries/day, we won't hit the connection or storage limits.

**When to migrate to Railway (or self-hosted Supabase on Railway):**
- If Realtime connections become a bottleneck (>100 concurrent on busy nights)
- If the city wants to own the database infrastructure entirely (data sovereignty)
- If the program expands to multiple cities and needs more database flexibility
- If costs grow significantly past the $25/mo Pro tier

**Escape hatch:** Because Supabase uses standard PostgreSQL, migration to Railway (or any Postgres host) is a `pg_dump` + `pg_restore`. The custom code replacement would be: (a) swap Supabase Auth for Auth.js or Clerk, (b) swap Supabase Realtime for a pg_notify + WebSocket layer, (c) swap Supabase Storage for S3/R2. Budget 2–3 weeks for the migration if needed.

---

## 14. Scaling Considerations

RWC Delivers is designed for 30 restaurants and ~100 deliveries/day. Here's what changes if it grows:

| Growth Trigger | Architecture Impact |
|---------------|-------------------|
| 50+ restaurants | No changes needed — Supabase Pro handles this easily |
| 500+ deliveries/day | Shipday pricing scales linearly ($0.04/task); consider connection pooling for Supabase |
| Multiple cities | Multi-tenant database design needed; separate Shipday accounts per city; zone model extends naturally |
| Native mobile apps | API layer already supports this — add React Native frontends |
| Real-time chat (driver ↔ customer) | Add Supabase Realtime chat channel or integrate Twilio Conversations |

For v1, the architecture is intentionally simple. Premature optimization would slow down launch without benefiting a 30-restaurant program.

---

## 15. Security Summary

| Concern | Mitigation |
|---------|-----------|
| Payment data (PCI) | Stripe handles all card data; SAQ-A compliance |
| Customer data privacy | Supabase RLS; restaurants own their customer data |
| Restaurant data isolation | RLS policies prevent cross-restaurant access |
| API authentication | Supabase JWT on all endpoints |
| Webhook verification | Stripe signature validation; Shipday webhook secret |
| Admin access | City admin role with audit logging |
| Infrastructure secrets | Vercel environment variables (encrypted at rest) |
| DDoS / abuse | Vercel edge rate limiting; Supabase connection limits |

---

## 16. Monitoring & Observability

| What | Tool | Alert On |
|------|------|----------|
| App errors / crashes | Vercel + Sentry | Any unhandled exception |
| API latency | Vercel Analytics | p95 > 2s |
| Database performance | Supabase Dashboard | Query time > 500ms |
| Webhook failures | Custom logging → Supabase | Any failed webhook processing |
| Order stuck in status | Cron job (Vercel Cron) | Order in `confirmed` for > 15 min |
| Payment failures | Stripe Dashboard + webhook | Any payment_intent.payment_failed |
| Delivery failures | Shipday Dashboard + webhook | Any order.failed event |
| Uptime | Vercel (built-in) + UptimeRobot | Any downtime > 1 min |

---

## 17. Consolidated Open Questions

Gathered from all four specs — these need resolution before or during build:

**Business decisions:**
- [x] ~~Delivery zone and radius~~ → 4 zones, 5–7 mile radius (resolved)
- [x] ~~Dispatch platform~~ → Shipday at ~$147/month (resolved)
- [ ] Exact zone polygons (GeoJSON boundaries — city input needed)
- [ ] Sales tax: city or restaurant responsibility?
- [ ] Tip distribution: per-delivery or pooled per shift?
- [ ] Courier partner for Phase 1 pilot (DoorDash Drive / Uber Direct / local?)
- [ ] Refund reserve budget

**Product decisions:**
- [ ] Multi-restaurant orders in v1?
- [ ] Scheduled/future orders in v1?
- [ ] Tablet optimization for kitchen use?
- [ ] Receipt/ticket printer integration?

**Technical decisions:**
- [x] ~~Dispatch pricing~~ → Shipday Professional $39/mo + $0.04/task (resolved)
- [ ] Shipday API confirmation — verify specific-driver assignment + multi-stop batching support
- [ ] Menu import tool for faster onboarding
- [ ] Custom tracking map vs. Shipday embedded tracking
- [ ] Subscription billing date: rolling or first-of-month?

---

## 18. Document Index

| Document | Description |
|----------|-------------|
| `00-architecture.md` | This document — system architecture and cross-app design |
| `01-marketplace-spec.md` | Customer-facing ordering app spec |
| `02-restaurant-dashboard-spec.md` | Restaurant management app spec |
| `03-delivery-dispatch-spec.md` | Delivery dispatch and driver management spec |
| `04-payments-settlements-spec.md` | Payment processing and settlement spec |
