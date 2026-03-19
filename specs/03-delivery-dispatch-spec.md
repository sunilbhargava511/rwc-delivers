# Delivery Dispatch — App Spec

**Version:** 2.0
**Date:** March 18, 2026
**Status:** Build-Ready Draft

---

## 1. Overview

The Delivery Dispatch system manages the assignment, routing, and tracking of all deliveries. It connects the Restaurant Dashboard ("order is ready") to the student drivers ("go pick this up") and the Marketplace ("your driver is 3 minutes away").

The architecture splits responsibility between two layers:

- **Dispatch intelligence (custom-built):** Zone-based batching, driver assignment, configurable dispatch triggers — all controlled by our dispatch app and the Program Coordinator.
- **Driver app + tracking (Shipday):** Native mobile app for drivers, GPS tracking, proof of delivery, customer tracking URL, and webhooks for status updates.

Shipday is a "dumb" driver app layer. It does NOT control dispatch decisions — our app tells Shipday which driver gets which order.

**Primary users:** City Program Coordinator (dispatch admin), Student delivery drivers (via Shipday driver app)
**Secondary users:** Restaurant staff (see driver status), Customers (see delivery tracking)

---

## 2. Goals

- Assign deliveries to drivers using zone-based batching logic controlled by the Program Coordinator
- Give the Program Coordinator a real-time view of all active deliveries, driver locations, and zone queues
- Provide reliable driver tracking data to the Marketplace (customer) and Restaurant Dashboard
- Support the three-phase driver model: courier partner (pilot) → hybrid → full city driver pool
- Keep the custom-built portion focused on dispatch intelligence — leverage Shipday for driver app, GPS, and tracking

---

## 3. Why Shipday (Not Onfleet, Not Custom-Built)

Our dispatch model uses custom zone-based batching — we decide when and who to dispatch. This means we don't need a platform's auto-dispatch or route optimization. What we do need is a driver mobile app (expensive to build) and live GPS tracking.

| Capability | Shipday Provides | We Build |
|-----------|-----------------|----------|
| Driver mobile app (iOS + Android) | Yes | — |
| Real-time GPS tracking | Yes (driver location) | — |
| Proof of delivery (photo) | Yes | — |
| Customer tracking URL | Yes | — |
| Webhooks for status updates | Yes | Webhook receiver that updates our orders table |
| Auto-dispatch / route optimization | Yes (but we don't use it) | Zone-based batching engine in dispatch app |
| Zone management + batch triggers | No | Custom admin UI for Program Coordinator |
| Driver scheduling | No | Simple shift scheduler |
| Integration with our order flow | No | API integration layer |
| City-specific reporting | No | Analytics dashboard |
| Overflow to DoorDash Drive / Uber Direct | Yes (built-in) | Configuration only |

**Cost:** Shipday Professional plan at $39/month + $0.04/task overage beyond 300 tasks. At ~100 deliveries/day (~3,000/month), estimated cost: **~$147/month**. Compare to Onfleet at $599–1,299/month for features we don't need.

---

## 4. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Driver App | Shipday Driver App (iOS/Android) | Native app with GPS, navigation, proof of delivery |
| Driver Tracking | Shipday GPS | Live driver location for customer tracking |
| Integration Layer | Next.js API Routes | Webhook receivers, task creation, driver assignment |
| Zone Batching Engine | Custom (dispatch app) | Configurable per-zone dispatch triggers |
| Admin UI | Next.js (dispatch app) | Program Coordinator interface |
| Real-time | Shipday webhooks → Supabase | Status updates flow to all apps |
| Scheduling | Custom (lightweight) | Supabase tables + simple UI |

---

## 5. Delivery Zones

The delivery area covers a 5–7 mile radius from downtown Redwood City, divided into zones with independent dispatch rules.

### 5.1 Zone Definitions

| Zone | Area | Radius | Delivery Fee | Est. Delivery Time | Dispatch Rule |
|------|------|--------|-------------|-------------------|---------------|
| A | Downtown RWC | <2 mi | $4.00 | 20–25 min | Immediate (point-to-point) |
| B | San Carlos | 3–5 mi | $5.50 | 28–35 min | Configurable batch trigger |
| C | North Fair Oaks | 3–4 mi | $5.00 | 25–30 min | Configurable batch trigger |
| D | Emerald Hills / Woodside | 5–7 mi | $6.50 | 35–45 min | Configurable batch trigger |

### 5.2 Configurable Dispatch Triggers

Each zone (except A) has two settings, fully configurable by the Program Coordinator:

- **Order count threshold:** Dispatch when N orders are queued for this zone (default: 2)
- **Time cap (minutes):** Dispatch when the oldest order in the zone queue has waited N minutes (default: 12–15 min)

Dispatch fires when **either** threshold is hit, whichever comes first. This prevents far-zone orders from waiting forever during off-peak while still enabling batching during peak hours.

**Suggested starting defaults (coordinator adjusts from day one):**

| Zone | Order Threshold | Time Cap |
|------|----------------|----------|
| A | 1 (immediate) | — |
| B | 2 orders | 12 min |
| C | 2 orders | 12 min |
| D | 2 orders | 15 min |

### 5.3 Zone Batching — How It Works

```
1. Customer places order → system identifies delivery zone from address
2. Restaurant accepts order → order enters zone queue
3. Dispatch engine checks zone triggers:
   a. Zone A: dispatch immediately, assign nearest available driver
   b. Zones B/C/D: check if order count threshold OR time cap is hit
      → If yes: batch all queued orders for that zone
      → Assign one driver to do a restaurant sweep → deliver batch in a loop
      → If no: order waits in queue
4. Driver receives batched route in Shipday app
5. Driver picks up from relevant restaurants → delivers all orders in zone
```

**During peak dinner (6:30–8pm), typical batch sizes:**
- Zone A: 1–2 orders (dispatched immediately)
- Zone B: 1–2 orders per batch (batches ~40% of the time)
- Zone C: 1–2 orders per batch
- Zone D: 1–2 orders per batch (batches ~30% of the time)

**Driver efficiency:** Zone batching saves ~2 drivers per shift compared to point-to-point for all zones. With 8 drivers on shift, this is significant.

---

## 6. System Flow

### 6.1 Order → Delivery Lifecycle

```
1. Customer places order (Marketplace)
   └→ Order created in Supabase (status: placed)
   └→ System identifies delivery zone from customer address
   └→ Zone-specific delivery fee and ETA applied to order
   └→ Notification sent to Restaurant Dashboard

2. Restaurant accepts order, sets prep time (Dashboard)
   └→ Order status: confirmed
   └→ Order enters zone dispatch queue

3. Dispatch engine evaluates zone triggers
   └→ Zone A: immediate dispatch
   └→ Zones B/C/D: wait for batch threshold or time cap
   └→ When triggered: select available driver, create batch

4. Dispatch app assigns driver and creates Shipday order(s)
   └→ Shipday order created via API with specific driver assigned
   └→ Driver sees order(s) in Shipday app with pickup + delivery addresses
   └→ Order status: driver_assigned
   └→ Restaurant Dashboard shows driver name + ETA
   └→ Customer sees "Driver assigned" on tracking page

5. Driver arrives at restaurant
   └→ Shipday webhook fires: order status update
   └→ Order status: awaiting_pickup

6. Driver picks up order
   └→ Driver marks pickup complete in Shipday app
   └→ Shipday webhook fires: picked up
   └→ Order status: en_route
   └→ Customer tracking page shows live driver location

7. Driver delivers order
   └→ Driver marks delivery complete in Shipday app (+ optional photo)
   └→ Shipday webhook fires: delivered
   └→ Order status: delivered
   └→ Customer notified
   └→ Payment captured (see Payments spec)
```

### 6.2 Driver Shift Management

The city employs 15–20 part-time student drivers. They work scheduled shifts, not on-demand gig availability.

```
Program Coordinator sets weekly schedule → Assigns drivers to zones →
Drivers see their shifts + zone assignments →
Drivers clock in via Shipday app → Available for dispatch → Clock out at shift end
```

**Shift model:**
- Shifts: Lunch (11am–2pm), Dinner (5pm–9pm), Weekend extended (11am–9pm)
- Drivers sign up for shifts via a simple web form (or scheduling tool)
- Program Coordinator approves/adjusts the weekly schedule
- Each shift includes a **zone assignment** — drivers are assigned to specific zones based on expected demand
- Zone assignments can be adjusted mid-shift by the coordinator if demand shifts

### 6.3 Backup Courier (Pilot Phase)

During months 1–6, a local courier partner handles overflow:

- If no city driver is available within 5 minutes of batch trigger, escalate to courier partner
- Shipday has built-in integration with **DoorDash Drive** and **Uber Direct** — overflow tasks are automatically routed to these on-demand networks
- Webhook events work identically regardless of driver type
- Program Coordinator can see which deliveries used courier vs. city drivers (for cost tracking)

---

## 7. Shipday Integration Details

### 7.1 Order Creation

When the dispatch engine triggers (immediately for Zone A, on batch threshold for other zones), we create a Shipday order assigned to a specific driver:

```json
{
  "orderNumber": "RWC-20260318-0042",
  "customerName": "Customer Name",
  "customerPhone": "+14155551234",
  "customerAddress": "123 Main St, Redwood City, CA 94063",
  "restaurantName": "La Viga Mexican Bistro",
  "restaurantPhone": "+16505551234",
  "restaurantAddress": "2015 Broadway, Redwood City, CA 94063",
  "orderItems": [
    { "name": "Lamb Shawarma", "quantity": 2 },
    { "name": "Hummus", "quantity": 1 }
  ],
  "deliveryFee": 4.00,
  "tips": 5.00,
  "pickupTime": "2026-03-18T18:30:00Z",
  "deliveryTime": "2026-03-18T18:55:00Z",
  "assignedDriverId": "shipday-driver-id-here",
  "orderMetadata": {
    "order_id": "uuid-here",
    "restaurant_id": "uuid-here",
    "zone_id": "uuid-here",
    "batch_id": "uuid-or-null"
  }
}
```

For batched deliveries, multiple Shipday orders are created and assigned to the same driver. The driver sees them as a multi-stop route in the Shipday app.

### 7.2 Webhook Events We Handle

| Shipday Event | Our Action |
|--------------|------------|
| Order assigned / accepted by driver | Update order status, store driver details |
| Driver arrived at pickup | Update order: driver at restaurant |
| Order picked up | Update order: en_route, begin customer tracking |
| Order delivered | Update order: delivered, trigger payment capture |
| Order failed / cancelled | Alert Program Coordinator, notify customer, attempt reassignment |
| Driver location update | Update tracking data for customer-facing map |

### 7.3 Tracking URL

Shipday provides a per-order tracking URL that shows live driver location on a map. We embed this in the customer's order tracking page for real-time delivery visibility.

---

## 8. Data Models

### `delivery_zones`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| name | text | e.g., "Downtown RWC", "San Carlos" |
| slug | text | e.g., "downtown", "san-carlos" |
| polygon | jsonb | GeoJSON Polygon geometry |
| delivery_fee | integer | Cents (e.g., 400 = $4.00) |
| estimated_delivery_minutes | integer | Base estimate for this zone |
| batch_order_threshold | integer | Dispatch when N orders queued (null = immediate) |
| batch_time_cap_minutes | integer | Dispatch when oldest order waited N min (null = immediate) |
| radius_miles | decimal | Approximate distance from downtown |
| is_active | boolean | Multiple zones can be active simultaneously |
| sort_order | integer | Display order |
| created_at | timestamptz | |

### `drivers`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| shipday_driver_id | text | Stable Shipday reference |
| name | text | |
| phone | text | |
| email | text | |
| type | enum | `city_driver`, `courier_partner` |
| is_active | boolean | |
| hired_at | date | |
| created_at | timestamptz | |

### `delivery_assignments`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| order_id | uuid (FK) | → orders.id |
| driver_id | uuid (FK) | → drivers.id |
| zone_id | uuid (FK) | → delivery_zones.id |
| batch_id | uuid | Nullable — groups orders dispatched together |
| shipday_order_id | text | Shipday order ID |
| driver_name | text | Snapshot from driver record |
| driver_phone | text | Snapshot for order context |
| assigned_at | timestamptz | |
| picked_up_at | timestamptz | Nullable |
| delivered_at | timestamptz | Nullable |
| estimated_pickup_at | timestamptz | |
| estimated_delivery_at | timestamptz | Zone-based estimate |
| tracking_url | text | Shipday tracking link |
| delivery_photo_url | text | Proof of delivery |
| is_batched | boolean | True if part of a multi-order batch |
| status | enum | `queued`, `assigned`, `en_route_to_pickup`, `at_pickup`, `en_route_to_delivery`, `delivered`, `failed` |

### `driver_shifts`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| driver_id | uuid (FK) | → drivers.id |
| zone_id | uuid (FK) | → delivery_zones.id (assigned zone for this shift) |
| shift_date | date | |
| shift_start | time | |
| shift_end | time | |
| actual_start | timestamptz | Clock-in time |
| actual_end | timestamptz | Clock-out time |
| deliveries_completed | integer | Auto-counted |
| status | enum | `scheduled`, `active`, `completed`, `no_show` |

### `dispatch_events`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| order_id | uuid (FK) | |
| event_type | text | Shipday webhook event name |
| payload | jsonb | Full webhook payload |
| received_at | timestamptz | |

This event log is critical for debugging delivery issues and calculating performance metrics.

---

## 9. Admin UI (Program Coordinator)

### 9.1 Live Dispatch View

- Map showing all active drivers and pending deliveries in real time
- **Zone overlay** — zones displayed as colored regions on the map
- **Zone queues** — sidebar shows queued orders per zone with countdown to time cap
- Sidebar list of active orders with status, ETAs, and zone assignment
- Ability to manually reassign a delivery or override zone assignment
- Alert panel for failed/delayed deliveries requiring intervention
- Batch indicator showing which orders are grouped together

### 9.2 Zone Settings

- Per-zone configuration panel:
  - Order count threshold (dispatch at N orders)
  - Time cap in minutes (dispatch after N minutes)
  - Delivery fee (cents)
  - Estimated delivery time (minutes)
  - Active/inactive toggle
- Changes take effect immediately (no restart needed)
- History log of setting changes for auditing

### 9.3 Driver Schedule

- Weekly calendar view with shift slots
- Drag-and-drop driver assignment to shifts
- **Zone assignment per shift** — each shift slot shows which zone the driver covers
- View of driver availability preferences
- Coverage gaps highlighted in red (especially per-zone gaps)

### 9.4 Performance Dashboard

- Deliveries per day/week (city drivers vs. courier partner)
- **Per-zone metrics:** delivery count, average time, on-time rate, batch utilization
- Average delivery time (pickup to dropoff), broken down by zone
- On-time delivery rate (overall and per zone)
- Driver performance: deliveries completed, average time, customer ratings
- Cost per delivery trending over time, broken down by zone
- Batch efficiency: % of far-zone deliveries that were batched, avg batch size

### 9.5 Driver Management

- List of all drivers with contact info and Shipday status
- Onboarding checklist for new drivers (background check, training, Shipday app setup)
- Active/inactive toggle

---

## 10. Key UI Screens

1. **Live Map** — Real-time view of all drivers and deliveries on a map with zone overlays
2. **Active Deliveries** — List/table of all in-progress deliveries with status, ETAs, and zone
3. **Zone Queues** — Per-zone order queues with batch status and countdown timers
4. **Zone Settings** — Configuration panel for dispatch triggers, fees, and time estimates per zone
5. **Driver Schedule** — Weekly calendar with shift + zone management
6. **Driver Roster** — List of all drivers with status and performance stats
7. **Delivery History** — Searchable log of past deliveries with zone and batch details
8. **Performance Dashboard** — Charts for delivery times, volume, cost per delivery (filterable by zone)
9. **Alerts** — Failed deliveries, coverage gaps, zone queue warnings, escalations

---

## 11. Failure Handling

| Scenario | Response |
|----------|----------|
| No driver available for zone | Hold in zone queue → if time cap exceeded with no driver, escalate to DoorDash Drive / Uber Direct via Shipday → alert Program Coordinator + notify customer of delay |
| Driver can't find restaurant | Driver calls restaurant (phone number in Shipday order notes) |
| Customer not available | Driver waits 5 min → calls customer → leaves at door with photo → marks complete |
| Restaurant not ready at estimated time | Driver waits up to 10 min → alerts dispatch if longer |
| App/system outage | Shipday operates independently — drivers can still complete tasks. Webhooks queued and replayed on recovery. |
| Zone queue backing up | Coordinator sees queue growing in real time → can lower time cap or reassign drivers from quiet zones |

---

## 12. Phase Transitions

### Phase 1: Pilot (Months 1–6)
- Courier partner handles all deliveries via DoorDash Drive / Uber Direct through Shipday
- 5 city drivers onboarded in parallel, shadow/train with courier
- Start with Zone A only (downtown, <2 mi) — immediate dispatch, no batching
- Simple admin UI: live map, delivery history, basic zone settings
- Cost per delivery: ~$6.50
- Shipday cost: ~$39/month (low volume)

### Phase 2: Transition (Months 7–9)
- City drivers handle most deliveries; courier as peak-time backup
- Expand to Zones A + B + C (up to 5 miles)
- Full shift scheduling UI with zone assignments
- Zone batching logic goes live for Zones B/C
- Cost per delivery: ~$5.50
- Shipday cost: ~$80–120/month

### Phase 3: Steady State (Month 10+)
- 15–20 city drivers handle all deliveries
- All four zones active (full 5–7 mile radius)
- Courier on standby for holidays/finals week only
- Full performance analytics with zone-level insights
- Coordinator has tuned batch triggers based on real data
- Cost per delivery: ~$4.00–$4.50
- Shipday cost: ~$147/month

---

## 13. Open Questions

- [x] ~~Dispatch platform pricing~~ → Shipday at ~$147/month (resolved)
- [x] ~~Delivery radius~~ → 5–7 miles, four zones (resolved)
- [x] ~~Batching model~~ → Zone-based batching with configurable triggers (resolved)
- [ ] Courier partner selection — DoorDash Drive vs. Uber Direct for Phase 1 overflow? Or a local courier?
- [ ] Driver hiring pipeline — how does the city recruit student drivers? Jobs for Youth integration?
- [ ] Exact zone polygons — need GeoJSON boundaries for each zone (city input needed)
- [ ] Shipday API confirmation — verify order creation API supports assigning to specific driver + multi-stop batching
- [ ] Zone overlap rules — if a customer address falls in two zones, which zone applies?
