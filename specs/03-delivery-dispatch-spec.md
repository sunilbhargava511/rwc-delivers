# Delivery Dispatch — App Spec

**Version:** 1.0
**Date:** March 17, 2026
**Status:** Build-Ready Draft

---

## 1. Overview

The Delivery Dispatch system manages the assignment, routing, and tracking of all deliveries. It connects the Restaurant Dashboard ("order is ready") to the student drivers ("go pick this up") and the Marketplace ("your driver is 3 minutes away"). This is not a from-scratch build — it is an integration layer built on top of Onfleet's delivery management API, with a lightweight admin UI for the city's Program Coordinator.

**Primary users:** City Program Coordinator (dispatch admin), Student delivery drivers (via Onfleet driver app)
**Secondary users:** Restaurant staff (see driver status), Customers (see delivery tracking)

---

## 2. Goals

- Automatically assign deliveries to available drivers with optimized routing
- Give the Program Coordinator a real-time view of all active deliveries and driver locations
- Provide reliable driver tracking data to the Marketplace (customer) and Restaurant Dashboard
- Support the three-phase driver model: courier partner (pilot) → hybrid → full city driver pool
- Keep the custom-built portion minimal — leverage Onfleet for the hard logistics problems

---

## 3. Why Onfleet (Not Custom-Built)

Building delivery dispatch from scratch requires solving route optimization, driver assignment algorithms, real-time GPS tracking, and a native driver app. Onfleet provides all of this as a service:

| Capability | Onfleet Provides | We Build |
|-----------|-----------------|----------|
| Route optimization | Yes (auto-assign by distance/time) | — |
| Driver mobile app | Yes (iOS + Android) | — |
| Real-time GPS tracking | Yes (driver location every 10s) | — |
| Delivery ETAs | Yes (ML-based predictions) | — |
| Webhooks for status updates | Yes | Webhook receiver that updates our orders table |
| Dispatch admin dashboard | Yes (basic) | Enhanced admin UI for Program Coordinator |
| Driver scheduling | No | Simple shift scheduler |
| Integration with our order flow | No | API integration layer |
| City-specific reporting | No | Analytics dashboard |

**Cost:** Onfleet charges per task (delivery). At ~100 deliveries/day, estimated $500–800/month. This is built into the delivery fee economics.

---

## 4. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Dispatch API | Onfleet API | Industry-standard last-mile delivery platform |
| Driver App | Onfleet Driver App (iOS/Android) | No custom driver app needed |
| Integration Layer | Next.js API Routes | Webhook receivers, task creation |
| Admin UI | Next.js (shared with Dashboard) | Program Coordinator interface |
| Real-time | Onfleet webhooks → Supabase | Status updates flow to all apps |
| Scheduling | Custom (lightweight) | Supabase tables + simple UI |

---

## 5. System Flow

### 5.1 Order → Delivery Lifecycle

```
1. Customer places order (Marketplace)
   └→ Order created in Supabase (status: placed)
   └→ Notification sent to Restaurant Dashboard

2. Restaurant accepts order, sets prep time (Dashboard)
   └→ Order status: confirmed
   └→ Onfleet task created via API (pickup at restaurant, deliver to customer)
   └→ Onfleet auto-assigns to optimal driver based on location + availability

3. Onfleet assigns driver
   └→ Webhook fires: task_assigned
   └→ Our webhook receiver updates order (status: driver_assigned, driver details)
   └→ Restaurant Dashboard shows driver name + ETA
   └→ Customer sees "Driver assigned" on tracking page

4. Driver arrives at restaurant
   └→ Webhook fires: driver_arrived_pickup
   └→ Order status: awaiting pickup

5. Driver picks up order
   └→ Driver marks pickup complete in Onfleet app
   └→ Webhook fires: task_started (en route)
   └→ Order status: en_route
   └→ Customer tracking page shows live driver location

6. Driver delivers order
   └→ Driver marks delivery complete in Onfleet app (+ optional photo)
   └→ Webhook fires: task_completed
   └→ Order status: delivered
   └→ Customer notified
   └→ Payment captured (see Payments spec)
```

### 5.2 Driver Shift Management

The city employs 15–20 part-time student drivers. They work scheduled shifts, not on-demand gig availability.

```
Program Coordinator sets weekly schedule → Drivers see their shifts →
Drivers clock in via Onfleet app → Available for dispatch → Clock out at shift end
```

**Shift model:**
- Shifts: Lunch (11am–2pm), Dinner (5pm–9pm), Weekend extended (11am–9pm)
- Drivers sign up for shifts via a simple web form (or scheduling tool)
- Program Coordinator approves/adjusts the weekly schedule
- Onfleet teams feature used to manage active vs. off-duty drivers

### 5.3 Backup Courier (Pilot Phase)

During months 1–6, a local courier partner handles overflow:

- If no city driver is available within 5 minutes of task creation, escalate to courier partner
- Courier partner has their own Onfleet team — tasks auto-reassign
- Webhook events work identically regardless of driver type
- Program Coordinator can see which deliveries used courier vs. city drivers (for cost tracking)

---

## 6. Onfleet Integration Details

### 6.1 Task Creation

When a restaurant accepts an order, we create an Onfleet task:

```json
{
  "destination": {
    "address": {
      "street": "123 Main St",
      "city": "Redwood City",
      "state": "CA",
      "postalCode": "94063",
      "country": "US"
    }
  },
  "recipients": [{
    "name": "Customer Name",
    "phone": "+14155551234"
  }],
  "pickupTask": false,
  "notes": "Order #RWC-20260317-0042\nItems: 2x Lamb Shawarma, 1x Hummus\nSpecial: No onions",
  "metadata": [{
    "name": "order_id",
    "type": "string",
    "value": "uuid-here"
  }, {
    "name": "restaurant_id",
    "type": "string",
    "value": "uuid-here"
  }],
  "completeAfter": 1710700800000,
  "completeBefore": 1710704400000
}
```

A corresponding linked pickup task is created at the restaurant address.

### 6.2 Webhook Events We Handle

| Onfleet Event | Our Action |
|--------------|------------|
| `taskAssigned` | Update order status, store driver name/phone/ETA |
| `workerArrived` (pickup) | Update order: driver at restaurant |
| `taskStarted` | Update order: en_route, begin customer tracking |
| `taskCompleted` | Update order: delivered, trigger payment capture |
| `taskFailed` | Alert Program Coordinator, notify customer, attempt reassignment |
| `taskDelayed` | Update ETA for customer and restaurant |

### 6.3 Tracking URL

Onfleet provides a per-task tracking URL that shows live driver location on a map. We embed this in the customer's order tracking page (or use Onfleet's tracking API to build a custom map in our UI for a more branded experience).

---

## 7. Data Models

### `drivers`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| onfleet_worker_id | text | Stable Onfleet reference |
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
| onfleet_task_id | text | Onfleet task ID |
| onfleet_pickup_task_id | text | Linked pickup task |
| driver_name | text | Snapshot from driver record |
| driver_phone | text | Snapshot for order context |
| assigned_at | timestamptz | |
| picked_up_at | timestamptz | Nullable |
| delivered_at | timestamptz | Nullable |
| estimated_pickup_at | timestamptz | Onfleet ETA |
| estimated_delivery_at | timestamptz | Onfleet ETA |
| tracking_url | text | Onfleet tracking link |
| delivery_photo_url | text | Proof of delivery |
| status | enum | `assigned`, `en_route_to_pickup`, `at_pickup`, `en_route_to_delivery`, `delivered`, `failed` |

### `driver_shifts`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| driver_id | uuid (FK) | → drivers.id |
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
| event_type | text | Onfleet webhook event name |
| payload | jsonb | Full webhook payload |
| received_at | timestamptz | |

This event log is critical for debugging delivery issues and calculating performance metrics.

---

## 8. Admin UI (Program Coordinator)

### 8.1 Live Dispatch View

- Map showing all active drivers and pending deliveries in real time
- Sidebar list of active orders with status and ETAs
- Ability to manually reassign a delivery if needed
- Alert panel for failed/delayed deliveries requiring intervention

### 8.2 Driver Schedule

- Weekly calendar view with shift slots
- Drag-and-drop driver assignment to shifts
- View of driver availability preferences
- Coverage gaps highlighted in red

### 8.3 Performance Dashboard

- Deliveries per day/week (city drivers vs. courier partner)
- Average delivery time (pickup to dropoff)
- On-time delivery rate
- Driver performance: deliveries completed, average time, customer ratings
- Cost per delivery trending over time (target: decreasing as volume grows)

### 8.4 Driver Management

- List of all drivers with contact info and Onfleet status
- Onboarding checklist for new drivers (background check, training, Onfleet app setup)
- Active/inactive toggle

---

## 9. Key UI Screens

1. **Live Map** — Real-time view of all drivers and deliveries on a map of Redwood City
2. **Active Deliveries** — List/table of all in-progress deliveries with status and ETAs
3. **Driver Schedule** — Weekly calendar with shift management
4. **Driver Roster** — List of all drivers with status and performance stats
5. **Delivery History** — Searchable log of past deliveries with details
6. **Performance Dashboard** — Charts for delivery times, volume, cost per delivery
7. **Alerts** — Failed deliveries, coverage gaps, escalations

---

## 10. Failure Handling

| Scenario | Response |
|----------|----------|
| No driver available | Hold task in queue for 5 min → escalate to courier partner → if still unassigned after 10 min, alert Program Coordinator + notify customer of delay |
| Driver can't find restaurant | Driver calls restaurant (phone number in Onfleet task notes) |
| Customer not available | Driver waits 5 min → calls customer → leaves at door with photo → marks complete |
| Restaurant not ready at estimated time | Driver waits up to 10 min → alerts dispatch if longer |
| App/system outage | Onfleet operates independently — drivers can still complete tasks. Webhooks queued and replayed on recovery. |

---

## 11. Phase Transitions

### Phase 1: Pilot (Months 1–6)
- Courier partner handles all deliveries via their Onfleet account
- 5 city drivers onboarded in parallel, shadow/train with courier
- Simple admin UI: just the live map and delivery history
- Cost per delivery: ~$6.50

### Phase 2: Transition (Months 7–9)
- City drivers handle most deliveries; courier as peak-time backup
- Full shift scheduling UI live
- Auto-escalation logic: city drivers first, courier if unavailable
- Cost per delivery: ~$5.50

### Phase 3: Steady State (Month 10+)
- 15–20 city drivers handle all deliveries
- Courier on standby for holidays/finals week only
- Full performance analytics
- Cost per delivery: ~$4.00–$4.50

---

## 12. Open Questions

- [ ] Onfleet pricing tier — need to confirm per-task pricing at projected volume
- [ ] Courier partner selection — who is the local courier partner for Phase 1?
- [ ] Driver hiring pipeline — how does the city recruit student drivers? Jobs for Youth integration?
- [ ] Delivery radius — how far from downtown does dispatch extend?
- [ ] Batching — should drivers pick up multiple orders from the same restaurant? Onfleet supports this.
