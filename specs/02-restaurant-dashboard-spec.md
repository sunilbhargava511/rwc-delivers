# Restaurant Dashboard — App Spec

**Version:** 1.0
**Date:** March 17, 2026
**Status:** Build-Ready Draft

---

## 1. Overview

The Restaurant Dashboard is the web application used by restaurant owners and staff to manage their presence on RWC Delivers. It is where restaurants receive and manage incoming orders, update their menus and hours, view earnings and customer data, and control their day-to-day delivery operations.

This is the app that must earn restaurant trust. If it's clunky, slow, or confusing, restaurants will stop checking it and the whole platform fails. Simplicity and reliability are the top design priorities.

**Primary users:** Restaurant owners, managers
**Secondary users:** Kitchen staff (order view only), city program coordinator (read-only oversight)

---

## 2. Goals

- Give restaurants a single screen to manage all incoming delivery orders
- Let owners update menus, hours, and availability without calling anyone
- Provide clear earnings reports that show savings vs. DoorDash
- Ensure restaurants own their customer data (names, order patterns, favorites)
- Keep the daily workflow to under 5 minutes of active dashboard time

---

## 3. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 14+ (App Router) | Shared codebase/tooling with Marketplace |
| Styling | Tailwind CSS | Consistent design system |
| Real-time | Supabase Realtime subscriptions | Instant order notifications |
| Backend | Shared Supabase instance | Same database as Marketplace |
| Auth | Supabase Auth (email + password) | Restaurant accounts are more persistent than customer accounts |
| File storage | Supabase Storage | Menu item photos, restaurant banners |
| Notifications | Browser push + SMS (Twilio) + audio chime | Cannot miss an incoming order |
| Hosting | Vercel (separate project, same org) | Independent deploy cycle from Marketplace |

---

## 4. User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **Owner** | Full access: menu, orders, earnings, settings, customer data, staff accounts |
| **Manager** | Orders, menu edits, daily earnings. Cannot manage billing or staff accounts. |
| **Kitchen Staff** | View incoming orders, mark orders as preparing/ready. No menu or earnings access. |
| **City Admin** (read-only) | Cross-restaurant view: aggregate order volume, response times, earnings. Cannot modify restaurant data. |

---

## 5. User Flows

### 5.1 Order Management (Core Loop)

This is the screen restaurant staff will live on during service hours.

```
New Order Alert → Accept/Reject → Set Prep Time → Mark Preparing → Mark Ready for Pickup → Driver Assigned (auto) → Complete
```

**Order queue screen:**
- Shows all active orders in columns or a list: New → Preparing → Ready → Out for Delivery
- Each order card shows: order number, customer name, items (with modifiers), special instructions, time since placed, estimated pickup time
- **Audio chime + browser notification** on new orders — this is critical. A missed order means a bad customer experience.
- Accept button sets prep time (default: 20 min, adjustable per order)
- Auto-reject if not accepted within 10 minutes (configurable) — sends customer a notification with option to reorder

**Order detail view:**
- Full item list with modifiers and special instructions
- Customer phone number (for questions about the order)
- Delivery address and driver info (once assigned)
- Timeline: placed → confirmed → preparing → ready → picked up → delivered

### 5.2 Menu Management

```
Menu Overview → Add/Edit Category → Add/Edit Item → Set Modifiers → Upload Photo → Publish
```

- **Menu categories:** Restaurant organizes items into categories (Appetizers, Mains, Drinks, etc.). Drag-and-drop reordering.
- **Menu items:** Name, description, price, photo (optional), category, modifier groups, availability toggle.
- **Modifier groups:** "Choose your protein" (required, pick one), "Add toppings" (optional, pick many). Each modifier has a name and price delta.
- **86'd items:** One-tap toggle to mark an item as temporarily unavailable ("86'd"). Immediately reflected on Marketplace. Un-86 with another tap.
- **Bulk hours:** Set which menu categories are available at which times (e.g., lunch menu vs. dinner menu).

### 5.3 Restaurant Profile & Hours

- Restaurant name, description, banner photo, cuisine tags
- Operating hours for delivery (can differ from dine-in hours)
- Temporary closures: "Close for today" button, or schedule a closure range
- Delivery prep time default (restaurant-wide, overridable per order)

### 5.4 Earnings & Analytics

- **Daily/weekly/monthly earnings:** Revenue from orders, with breakdown of subtotal vs. delivery fees vs. tips
- **DoorDash comparison widget:** "You paid $399 this month. On DoorDash at 25%, you would have paid $X." This is a key retention tool.
- **Order volume trends:** Orders per day, average order value, peak hours
- **Top items:** Best sellers by volume and revenue
- **Customer data:** List of customers who have ordered, with order count and total spend. This is data restaurants never get from DoorDash — it's a major selling point.

### 5.5 Settings

- Business info (address, phone, tax ID)
- Notification preferences (SMS, email, push)
- Staff account management (invite, role assignment, deactivate)
- Payout settings (bank account via Stripe Connect onboarding)

---

## 6. Data Models

### `restaurants`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| name | text | |
| slug | text | Unique, URL-friendly |
| description | text | Owner-written blurb |
| cuisine_tags | text[] | e.g., ["Mediterranean", "Middle Eastern"] |
| banner_image_url | text | Supabase Storage URL |
| address | text | Physical restaurant address |
| phone | text | |
| lat | decimal | For distance calculations |
| lng | decimal | |
| default_prep_time_min | integer | Default: 20 |
| auto_reject_timeout_min | integer | Default: 10 |
| is_active | boolean | Master on/off for the platform |
| stripe_account_id | text | Stripe Connect account |
| created_at | timestamptz | |

### `restaurant_hours`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| restaurant_id | uuid (FK) | |
| day_of_week | integer | 0=Sunday, 6=Saturday |
| open_time | time | |
| close_time | time | |
| closes_next_day | boolean | Default: false. Set true for late-night hours (e.g., open 5pm, close 1am spans into next day). |
| is_closed | boolean | For permanent day-off |

### `restaurant_closures`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| restaurant_id | uuid (FK) | |
| start_date | date | |
| end_date | date | |
| reason | text | Optional |

### `menu_categories`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| restaurant_id | uuid (FK) | |
| name | text | e.g., "Appetizers" |
| sort_order | integer | |
| available_start | time | Nullable (always available if null) |
| available_end | time | |

### `menu_items`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| category_id | uuid (FK) | → menu_categories.id |
| restaurant_id | uuid (FK) | Denormalized for query speed |
| name | text | |
| description | text | |
| price | integer | Cents |
| image_url | text | Nullable |
| is_available | boolean | True by default; false = 86'd |
| sort_order | integer | |
| created_at | timestamptz | |

### `modifier_groups`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| menu_item_id | uuid (FK) | |
| name | text | e.g., "Choose your protein" |
| is_required | boolean | |
| min_selections | integer | Default: 0 |
| max_selections | integer | Default: 1 |
| sort_order | integer | |

### `modifier_options`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| group_id | uuid (FK) | → modifier_groups.id |
| name | text | e.g., "Chicken" |
| price_delta | integer | Cents (can be 0) |
| is_available | boolean | |
| sort_order | integer | |

### `restaurant_staff`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| restaurant_id | uuid (FK) | |
| user_id | uuid (FK) | → Supabase auth user |
| role | enum | `owner`, `manager`, `kitchen` |
| invited_at | timestamptz | |
| accepted_at | timestamptz | Nullable |

---

## 7. API Endpoints

### Orders

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/orders` | List orders for restaurant (filterable by status, date range) |
| GET | `/api/dashboard/orders/[id]` | Order detail |
| POST | `/api/dashboard/orders/[id]/accept` | Accept order + set prep time. **Triggers Onfleet task creation** (pickup at restaurant → deliver to customer). This is the handoff point to Dispatch. |
| POST | `/api/dashboard/orders/[id]/reject` | Reject order (with reason) |
| POST | `/api/dashboard/orders/[id]/status` | Update status (preparing → ready) |

### Menu

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/menu` | Full menu with categories, items, modifiers |
| POST | `/api/dashboard/menu/categories` | Create category |
| PUT | `/api/dashboard/menu/categories/[id]` | Update category (name, sort, hours) |
| POST | `/api/dashboard/menu/items` | Create menu item |
| PUT | `/api/dashboard/menu/items/[id]` | Update menu item |
| PATCH | `/api/dashboard/menu/items/[id]/availability` | Toggle 86'd status |
| POST | `/api/dashboard/menu/items/[id]/image` | Upload item photo |
| PUT | `/api/dashboard/menu/reorder` | Batch update sort orders |

### Analytics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/analytics/earnings` | Earnings summary (daily/weekly/monthly) |
| GET | `/api/dashboard/analytics/orders` | Order volume and trends |
| GET | `/api/dashboard/analytics/top-items` | Best sellers |
| GET | `/api/dashboard/analytics/customers` | Customer list with order history |

### Settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/settings` | Restaurant profile and config |
| PUT | `/api/dashboard/settings` | Update profile |
| PUT | `/api/dashboard/settings/hours` | Update operating hours |
| POST | `/api/dashboard/settings/closures` | Schedule a closure |
| POST | `/api/dashboard/settings/staff/invite` | Invite staff member |
| PUT | `/api/dashboard/settings/staff/[id]` | Update staff role |

---

## 8. Key UI Screens

1. **Order Queue** — The main screen. Kanban-style columns: New / Preparing / Ready / Out for Delivery. Real-time updates.
2. **Order Detail** — Full order breakdown, customer info, timeline, action buttons.
3. **Menu Editor** — Category list → item list → item detail with modifiers. Drag-and-drop reordering.
4. **Item Editor** — Name, description, price, photo upload, modifier group builder.
5. **Earnings Dashboard** — Charts for revenue, order volume, DoorDash comparison. Date range selector.
6. **Customer List** — Table of customers with order count, total spend, last order date.
7. **Restaurant Profile** — Edit name, description, banner, hours, closures.
8. **Staff Management** — Invite/manage team members with role assignment.
9. **Payout Settings** — Stripe Connect onboarding flow, payout history.

---

## 9. Notification Strategy

Orders are time-sensitive. The notification system must be aggressive:

| Trigger | Channels | Notes |
|---------|----------|-------|
| New order placed | Audio chime (in-browser) + Push notification + SMS to owner | All three. Cannot miss this. |
| Order not accepted in 5 min | Repeat audio chime + escalation SMS | |
| Order not accepted in 10 min | Auto-reject + customer notified | Configurable timeout |
| Driver assigned | Dashboard update (silent) | |
| Order delivered | Dashboard update | |
| Daily earnings summary | Email (8pm) | |

**Audio chime:** Plays in-browser using Web Audio API. Repeats every 30 seconds until order is accepted. Requires keeping the dashboard tab open — display a prominent "keep this tab open during service" onboarding message.

---

## 10. Onboarding Flow

When a restaurant signs up:

1. City Program Coordinator creates restaurant account
2. Owner receives invite email → sets password
3. Guided setup wizard: restaurant name, description, banner photo → operating hours → menu entry (bulk import from existing DoorDash/Yelp menu if possible) → Stripe Connect onboarding (bank account for payouts)
4. Test order from Program Coordinator to verify everything works
5. Go live

Target: restaurant fully onboarded in under 1 hour with Program Coordinator support.

---

## 11. Open Questions

- [ ] Menu import tool — can we scrape/import existing DoorDash or Yelp menus to speed onboarding?
- [ ] Tablet mode — should we optimize for a dedicated tablet in the kitchen, or is browser-on-laptop sufficient for v1?
- [ ] Printer integration — can we auto-print order tickets? (Likely v2, but restaurants will ask)
- [ ] Multi-location support — any RWC restaurants with multiple locations?
