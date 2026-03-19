# RWC Delivers Marketplace — App Spec

**Version:** 2.0
**Date:** March 18, 2026
**Status:** Build-Ready Draft

---

## 1. Overview

The RWC Delivers Marketplace is the customer-facing web application (progressive web app) where Redwood City residents browse local restaurants, view menus, place delivery orders, and track their deliveries in real time. It is the primary revenue-generating touchpoint and the public face of the RWC Delivers program.

**Primary users:** Redwood City residents ordering food delivery
**Secondary users:** Visitors, downtown workers, event attendees

---

## 2. Goals

- Provide a simple, fast ordering experience that beats DoorDash on price transparency (no hidden fees, no surge pricing)
- Showcase independent Redwood City restaurants with personality — not a generic grid of logos
- Drive repeat usage through a clean UX, fair pricing ($4–6.50 zone-based delivery fee), and civic pride messaging
- Collect first-party customer data that belongs to the restaurants, not the platform

---

## 3. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 14+ (App Router) | SSR for SEO, fast page loads, React ecosystem |
| Styling | Tailwind CSS | Rapid UI development, consistent design system |
| State | Zustand | Lightweight cart/order state; no Redux overhead |
| Backend API | Next.js API Routes + Supabase | Serverless, low-ops, real-time subscriptions |
| Database | Supabase (PostgreSQL) | Row-level security, real-time, auth built in |
| Auth | Supabase Auth (phone OTP) | No passwords to remember for quick ordering. Email is optional (for receipts/account upgrade). |
| Payments | Stripe Checkout + Stripe Connect | PCI-compliant, handles restaurant payouts |
| Real-time tracking | Shipday webhooks → Supabase Realtime | Live driver location on order status page |
| Hosting | Vercel | Auto-scaling, edge CDN, zero-config deploys |
| Analytics | PostHog (self-hosted or cloud) | Privacy-friendly, city-owned data |

---

## 4. User Flows

### 4.1 Browse & Discover

```
Landing Page → Restaurant List → Restaurant Page → Menu
```

- **Landing page:** Hero with "Order from Redwood City's best independents" + city branding. Shows currently-open restaurants first, with estimated delivery times (zone-dependent based on customer's saved or entered address).
- **Restaurant list:** Card grid showing: restaurant name, cuisine tag, photo, rating, delivery estimate, open/closed status. Filter by: cuisine type, currently open, delivery time. Sort by: distance, rating, delivery time.
- **Restaurant page:** Banner photo, description (written by the owner), full menu organized by category, hours, delivery area note (covers 4 zones up to 7 miles).

### 4.2 Ordering

```
Add Items → Cart Review → Checkout → Order Confirmation
```

- **Add to cart:** Tap item → modifier/customization sheet (size, add-ons, special instructions) → add to cart. Cart persists across restaurant pages but warns if switching restaurants ("This will clear your current cart from La Viga").
- **Cart review:** Line items with quantities, modifiers, and prices. Subtotal + delivery fee ($4.00–$6.50, zone-dependent) clearly shown. No service fee. No surge pricing. Tip option (default suggestions: $3, $5, $7, custom).
- **Checkout:** Delivery address (with validation against delivery zones — 4 zones covering 5–7 mile radius). Zone-specific delivery fee and estimated delivery time shown before confirming. Payment via Stripe (saved cards for returning users). Phone number required (for driver contact).
- **Order confirmation:** Order number, estimated delivery time, link to real-time tracking page.

### 4.3 Order Tracking

```
Order Confirmed → Preparing → Driver En Route → Delivered
```

- Real-time status updates via Supabase Realtime (sourced from Restaurant Dashboard + Shipday webhooks).
- Map view showing driver location when en route (Shipday tracking URL embedded or custom map via Mapbox).
- Push notification support (via service worker) for status transitions.
- SMS fallback for status updates (via Twilio, triggered by webhook).

### 4.4 Account & History

- **Account page:** Name, email, phone, saved addresses, saved payment methods.
- **Order history:** Past orders with reorder button, receipt view.
- **No mandatory account creation:** Guest checkout supported. Account creation prompted post-order ("Save your info for faster checkout next time").

---

## 5. Data Models

### `customers`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Supabase auth user ID |
| email | text | Nullable — not required for guest checkout |
| phone | text | Required — this is the primary identifier for guest checkout |
| full_name | text | |
| is_guest | boolean | Default: true. Set to false when customer adds email/creates full account. |
| created_at | timestamptz | |
| default_address_id | uuid (FK) | → addresses.id |

**Guest checkout flow:** When a customer checks out without an account, a minimal customer record is created from their phone number (via Supabase phone OTP). The `is_guest = true` flag marks them as unconverted. After their first order, we prompt: "Add your email for order receipts and faster checkout next time." If they do, `is_guest` flips to false. If the same phone number is used on a future order, we match to the existing customer record — their order history accumulates automatically. The `orders.customer_id` FK is never null.

### `addresses`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| customer_id | uuid (FK) | → customers.id |
| street | text | |
| unit | text | Nullable |
| city | text | Default: "Redwood City" |
| state | text | Default: "CA" |
| zip | text | |
| lat | decimal | For delivery zone validation |
| lng | decimal | For delivery zone validation |
| label | text | "Home", "Work", etc. |
| is_within_zone | boolean | Computed on save |

### `orders`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| order_number | text | Human-readable, e.g. "RWC-20260317-0042" |
| customer_id | uuid (FK) | → customers.id |
| restaurant_id | uuid (FK) | → restaurants.id |
| status | enum | `placed`, `confirmed`, `preparing`, `ready_for_pickup`, `driver_assigned`, `en_route`, `delivered`, `cancelled` |
| delivery_address_id | uuid (FK) | → addresses.id |
| subtotal | integer | Cents |
| delivery_fee | integer | Cents (400–650, zone-dependent) |
| tip | integer | Cents |
| total | integer | Cents |
| stripe_payment_intent_id | text | |
| zone_id | uuid (FK) | → delivery_zones.id |
| shipday_order_id | text | |
| estimated_delivery_at | timestamptz | |
| placed_at | timestamptz | |
| delivered_at | timestamptz | Nullable |
| notes | text | Special delivery instructions |

### `order_items`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| order_id | uuid (FK) | → orders.id |
| menu_item_id | uuid (FK) | → menu_items.id |
| item_name | text | Snapshot — preserves name even if menu item is later edited or deleted |
| quantity | integer | |
| unit_price | integer | Cents (snapshot at time of order) |
| modifiers | jsonb | Selected customizations (snapshot of names + prices at order time) |
| special_instructions | text | |

---

## 6. API Endpoints

### Restaurants & Menus (public, cached)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List restaurants (with open/closed, delivery estimates) |
| GET | `/api/restaurants/[slug]` | Single restaurant detail + menu |
| GET | `/api/restaurants/[slug]/menu` | Menu items grouped by category |

### Orders (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/orders` | Place a new order (validates zone, applies zone fee, creates Stripe PaymentIntent). Note: Shipday order is NOT created here — it is created when the dispatch engine triggers (after restaurant accepts). |
| GET | `/api/orders/[id]` | Get order detail + current status |
| GET | `/api/orders` | List customer's order history |
| POST | `/api/orders/[id]/cancel` | Cancel order (only if status = `placed`) |

### Webhooks (internal)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/webhooks/stripe` | Payment confirmation/failure |
| POST | `/api/webhooks/shipday` | Delivery status updates → writes to orders table |

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/otp/send` | Send phone OTP via Supabase |
| POST | `/api/auth/otp/verify` | Verify OTP, return session |

---

## 7. Key UI Screens

1. **Home / Restaurant List** — Hero + restaurant cards + filters
2. **Restaurant Page** — Banner, description, menu by category
3. **Item Detail Sheet** — Modifiers, quantity, special instructions
4. **Cart Drawer** — Slide-out cart with line items and totals
5. **Checkout Page** — Address, payment, delivery time, tip
6. **Order Confirmation** — Success state with tracking link
7. **Order Tracking** — Status timeline + live map
8. **Account / Order History** — Past orders, saved info
9. **Login / OTP** — Phone number entry → code verification

---

## 8. Delivery Zone Validation

The delivery area covers a 5–7 mile radius from downtown Redwood City, divided into four zones. Each zone has its own delivery fee and estimated delivery time. Multiple zones are active simultaneously.

### `delivery_zones`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| name | text | e.g., "Downtown RWC", "San Carlos" |
| slug | text | e.g., "downtown", "san-carlos" |
| polygon | jsonb | GeoJSON Polygon geometry |
| delivery_fee | integer | Cents (e.g., 400 = $4.00) |
| estimated_delivery_minutes | integer | Base estimate for this zone |
| radius_miles | decimal | Approximate distance from downtown |
| is_active | boolean | Multiple zones can be active simultaneously |
| sort_order | integer | Display order |
| created_at | timestamptz | |

### Zone Definitions

| Zone | Area | Delivery Fee | Est. Time |
|------|------|-------------|-----------|
| A | Downtown RWC (<2 mi) | $4.00 | 20–25 min |
| B | San Carlos (3–5 mi) | $5.50 | 28–35 min |
| C | North Fair Oaks (3–4 mi) | $5.00 | 25–30 min |
| D | Emerald Hills / Woodside (5–7 mi) | $6.50 | 35–45 min |

### Address validation flow

1. Customer enters address
2. Geocode via Mapbox Geocoding API → get lat/lng
3. Point-in-polygon check against **all active** delivery zone GeoJSONs (use PostGIS `ST_Contains` or JS library `@turf/boolean-point-in-polygon`)
4. If outside all zones: show friendly message ("We're currently delivering within the Redwood City area. We're expanding soon!")
5. If inside a zone: apply that zone's delivery fee and estimated time, proceed to checkout
6. If inside multiple overlapping zones: use the zone with the lowest delivery fee (best for customer)

### Checkout display

When zone is identified, the checkout page shows:
- "Delivery to [Zone Name]" (e.g., "Delivery to San Carlos")
- Zone-specific delivery fee (e.g., "$5.50")
- Zone-specific estimated time (e.g., "28–35 min")

**Restaurant open/closed logic:** A restaurant is "open" when all three conditions are true: (a) `restaurants.is_active = true`, (b) current time falls within `restaurant_hours` for today's `day_of_week`, (c) today's date does not fall within any `restaurant_closures` range. This check runs as a Supabase database function `is_restaurant_open(restaurant_id)` called by the Marketplace and cached for 1 minute.

---

## 9. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Performance | > 90 |
| Order placement (click to confirmation) | < 10s |
| Real-time tracking latency | < 5s delay |

---

## 10. Mobile Strategy

Build as a Progressive Web App (PWA) rather than native iOS/Android apps for v1:

- Installable via "Add to Home Screen"
- Offline-capable service worker (caches restaurant list and menus)
- Push notifications for order status
- Responsive design optimized for mobile-first

Native apps can be considered for v2 if adoption warrants the investment.

---

## 11. Open Questions

- [x] ~~Delivery zone model~~ → 4 zones, 5–7 mile radius, zone-dependent fees (resolved)
- [ ] Exact zone polygons (GeoJSON) — needs input from city on boundaries
- [ ] Tip distribution model — 100% to driver, or pooled across shift?
- [ ] Multi-restaurant orders — support in v1 or defer?
- [ ] Scheduled/future orders — support in v1 or delivery-now only?
