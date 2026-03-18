
<div align="center">

# RWC Delivers

### A Community-Owned Delivery Platform for Redwood City

*Fair fees. Local restaurants. City-powered delivery.*

---

</div>

## What is RWC Delivers?

RWC Delivers is a municipal delivery marketplace designed to serve independent restaurants in Redwood City, California. Unlike DoorDash or Uber Eats, which charge restaurants 20–30% commissions, RWC Delivers operates as a community utility — keeping fees low, data local, and dollars circulating in the local economy.

The platform has three apps, each built for a different user:

| App | Who Uses It | What It Does |
|-----|-------------|--------------|
| **Marketplace** | Customers | Browse restaurants, build orders, checkout, track delivery |
| **Dashboard** | Restaurant owners & staff | Manage incoming orders, edit menus, view earnings |
| **Dispatch** | Program coordinators | Monitor live deliveries, manage drivers, schedule shifts |

---

## The Marketplace

**URL:** [rwc-delivers-production.up.railway.app](https://rwc-delivers-production.up.railway.app)

The customer-facing app where residents browse and order from 15 independent Redwood City restaurants.

### Features

**Restaurant Discovery**
- Browse all 15 restaurants with real photos, ratings, and cuisine tags
- Filter by cuisine type (Mexican, Italian, Indian, Asian, American, Mediterranean)
- Search by restaurant name
- See real-time open/closed status based on operating hours

**Full Menus with Photos**
- Complete menus sourced from each restaurant's actual offerings
- Food photography for every dish
- Modifier support (choose protein, add toppings, select size)
- Dietary labels and descriptions

**Ordering Flow**
- Tap any item to see details, customize, and add to cart
- Persistent cart drawer with item counts and running total
- Checkout with delivery address, tip selection, and order summary
- Order confirmation with tracking page

### Restaurants

| Restaurant | Cuisine | Highlights |
|-----------|---------|------------|
| La Viga | Mexican Seafood | Seafood tostadas, ceviches, octopus |
| Vesta | Wood-Fired | Pizzas, salads, charcuterie |
| Mazra | Mediterranean | Hummus, kebabs, shawarma |
| Donato Enoteca | Italian | Handmade pasta, osso buco |
| Angelica's | Mexican | Birria tacos, mole enchiladas |
| Broadway Masala | Indian | Butter chicken, biryani, dosa |
| Timber & Salt | American | Smoked brisket, craft burgers |
| Nomadic Kitchen | Pan-Asian | Dumplings, ramen, bao buns |
| Hurrica | Sushi & Japanese | Omakase, rolls, ramen |
| Pamilya | Filipino | Adobo, sisig, lumpia |
| La Fonda | Latin American | Pupusas, plantains, ceviche |
| Pizzeria Cardamomo | Artisan Pizza | Neapolitan pies, antipasti |
| Mistral | French Bistro | Duck confit, steak frites |
| Bao | Taiwanese | Bao buns, dan dan noodles |
| Limon | Peruvian | Lomo saltado, ceviche, anticuchos |

---

## The Restaurant Dashboard

**URL:** [rwc-dashboard-production.up.railway.app](https://rwc-dashboard-production.up.railway.app)

The back-of-house tool where restaurant owners manage their presence on RWC Delivers.

### Pages

**Orders — Kanban Board**
- Four-column board: New → Preparing → Ready → Out for Delivery
- Accept or reject incoming orders with one tap
- See customer name, items, modifiers, special instructions, and total
- Mark orders as ready for pickup when food is done

**Menu Editor**
- Browse menu by category (Appetizers, Tacos, Enchiladas, Entrees, etc.)
- Toggle items as **86'd** (unavailable) with a single click — instantly reflected on the marketplace
- View modifier groups and item prices
- Add new categories and items

**Earnings**
- Today / This Week / This Month revenue cards
- **DoorDash fee comparison** — shows exactly how much the restaurant saves vs. a 25% commission platform
- 14-day revenue trend chart
- Top-selling items ranked by volume

**Settings**
- Restaurant profile (name, address, phone, description)
- Operating hours editor for each day of the week
- Staff list with roles
- Notification preferences (new orders, low stock alerts)

---

## The Dispatch Console

**URL:** [rwc-dispatch-production.up.railway.app](https://rwc-dispatch-production.up.railway.app)

The operations center for the program coordinator who oversees all deliveries across the city.

### Pages

**Live Map**
- Bird's-eye view of Redwood City with color-coded driver dots
  - 🟢 Green = available / on duty
  - 🔵 Blue = on delivery
  - 🟡 Yellow = returning
- Active deliveries sidebar with status, ETA, and driver assignment
- Real-time alert banner for high-priority issues (long waits, no driver coverage)
- Stats overlay: active drivers, in-progress deliveries

**Active Deliveries**
- Filterable table of all in-progress orders
- Status badges: Awaiting Driver, Driver Assigned, En Route to Pickup, At Pickup, En Route to Delivery
- One-click driver assignment for unassigned orders
- Restaurant → Customer route with ETA

**Driver Roster**
- Card grid of all 12 drivers with status indicators
- Filter by type: City Drivers (student employees) vs. Courier Partners (gig backup)
- Star ratings, delivery counts, average times
- Active/inactive toggle per driver

**Schedule — Weekly Calendar**
- 7-day view (Mon–Sun) with lunch and dinner shift slots
- Color-coded shift chips: gray (scheduled), green (active), blue (completed), red (no-show)
- Coverage gap warnings (e.g., "No coverage" on Friday lunch)
- Today's shifts detail table
- Coverage summary with driver counts per slot

**Performance Dashboard**
- Today / Week / Month stat cards (deliveries, avg time, on-time rate)
- Delivery volume stacked bar chart (city drivers vs. courier partners)
- Average delivery time trend (14 days)
- Cost per delivery trend
- Driver leaderboard with rankings

**Delivery History**
- Searchable log of all completed deliveries
- Filter by date, search by order number, restaurant, customer, or driver
- Full details: order total, delivery fee, tip, duration, rating
- Summary stats: total deliveries, average time, total tips, city/courier split

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Turborepo Monorepo                │
│                                                     │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────┐ │
│  │ Marketplace  │  │ Dashboard  │  │   Dispatch   │ │
│  │  Port 3000   │  │ Port 3001  │  │  Port 3002   │ │
│  │  Customer    │  │ Restaurant │  │ Coordinator  │ │
│  └──────┬───────┘  └─────┬──────┘  └──────┬───────┘ │
│         │                │                │         │
│  ┌──────┴────────────────┴────────────────┴───────┐ │
│  │              Shared Packages                   │ │
│  │  @rwc/shared  │  @rwc/ui  │  @rwc/db           │ │
│  │  Types/Utils  │ Components│  Supabase Queries   │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         Railway      Railway      Railway
        Service 1    Service 2    Service 3
```

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Zustand · Supabase · pnpm

---

## Development

### Prerequisites
- Node.js 18+
- pnpm 9+

### Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Start a single app
pnpm dev --filter marketplace    # http://localhost:3000
pnpm dev --filter dashboard      # http://localhost:3001
pnpm dev --filter dispatch       # http://localhost:3002

# Build
pnpm build                       # All apps
pnpm build --filter dashboard    # Single app
```

### Project Structure

```
delivery-marketplace/
├── apps/
│   ├── marketplace/          # Customer PWA
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Mock data, utilities
│   │   └── store/            # Zustand cart store
│   ├── dashboard/            # Restaurant portal
│   │   ├── app/              # Pages: orders, menu, earnings, settings
│   │   ├── components/       # OrderCard, Sidebar
│   │   └── lib/              # Mock data
│   └── dispatch/             # Dispatch console
│       ├── app/              # Pages: live, deliveries, drivers, schedule, performance, history
│       ├── components/       # Sidebar
│       └── lib/              # Mock data (drivers, deliveries, shifts, performance)
├── packages/
│   ├── shared/               # @rwc/shared — types, formatCurrency, order status
│   ├── ui/                   # @rwc/ui — Button, Badge, Skeleton
│   └── db/                   # @rwc/db — Supabase client & queries
├── specs/                    # Architecture & feature specs
├── supabase/                 # Database schema, migrations, seed data
└── turbo.json                # Turborepo config
```

---

## Deployment

All three apps deploy to **Railway** as separate services from the same GitHub repo.

| Service | URL | Env Var |
|---------|-----|---------|
| Marketplace | [rwc-delivers-production.up.railway.app](https://rwc-delivers-production.up.railway.app) | `APP=marketplace` |
| Dashboard | [rwc-dashboard-production.up.railway.app](https://rwc-dashboard-production.up.railway.app) | `APP=dashboard` |
| Dispatch | [rwc-dispatch-production.up.railway.app](https://rwc-dispatch-production.up.railway.app) | `APP=dispatch` |

Push to `main` triggers auto-deploy on all three services.

---

## Roadmap — What's Left to Build

### Phase 1: Connect the Database
- [ ] Wire Supabase to all three apps (replace mock data with live queries)
- [ ] Seed database with the 15 restaurants, menus, and sample orders
- [ ] Add real-time order updates via Supabase Realtime subscriptions
- [ ] Implement optimistic UI updates for order status changes

### Phase 2: Authentication & Accounts
- [ ] Customer login (SMS OTP via Twilio + Supabase Auth)
- [ ] Guest checkout → account creation flow
- [ ] Restaurant staff login with role-based access
- [ ] Coordinator login for dispatch console
- [ ] Saved addresses and order history per customer

### Phase 3: Payments
- [ ] Stripe Connect onboarding for restaurants
- [ ] Customer payment processing (cards, Apple Pay, Google Pay)
- [ ] Tip allocation to drivers
- [ ] Weekly/biweekly restaurant settlement batches
- [ ] Refund and chargeback handling

### Phase 4: Delivery Operations
- [ ] Onfleet integration for driver dispatch and route optimization
- [ ] Real-time GPS tracking on the order tracking page
- [ ] Driver mobile app (or Onfleet driver app configuration)
- [ ] Automated driver assignment based on proximity
- [ ] Backup courier partner API integration

### Phase 5: Notifications & Communication
- [ ] SMS order confirmations and delivery updates (Twilio)
- [ ] Push notifications for restaurant staff (new orders)
- [ ] Email receipts
- [ ] Driver notifications for new assignments

### Phase 6: Analytics & Admin
- [ ] PostHog analytics integration
- [ ] Admin dashboard for city program managers
- [ ] Restaurant onboarding wizard
- [ ] A/B testing framework for marketplace features

### Phase 7: Polish & Scale
- [ ] PWA install prompt and offline support
- [ ] Mapbox integration for live map (replace CSS placeholder)
- [ ] Image optimization and CDN for food photos
- [ ] Performance monitoring and error tracking
- [ ] Load testing and horizontal scaling
- [ ] Custom domain setup (e.g., rwcdelivers.com)

---

<div align="center">

*Built with care for Redwood City's independent restaurants.*

*RWC Delivers — keeping it local.*

</div>
