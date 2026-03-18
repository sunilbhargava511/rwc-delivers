# RWC Delivers — Roadmap

> Last updated: 2026-03-18

## Current State

All three apps are fully built as interactive prototypes with realistic mock data. No live database, auth, payments, or delivery integration yet.

| App | Status | URL |
|-----|--------|-----|
| Marketplace | Complete (mock data) | [rwc-delivers-production.up.railway.app](https://rwc-delivers-production.up.railway.app) |
| Dashboard | Complete (mock data) | [rwc-dashboard-production.up.railway.app](https://rwc-dashboard-production.up.railway.app) |
| Dispatch | Complete (mock data) | [rwc-dispatch-production.up.railway.app](https://rwc-dispatch-production.up.railway.app) |

---

## Phases

### Phase 1: Connect the Database
> *Replace mock data with live Supabase queries*

| Task | App(s) | Integration | Priority |
|------|--------|-------------|----------|
| Seed database with 15 restaurants, menus, hours | All | Supabase | P0 |
| Wire restaurant listing & detail pages to live queries | Marketplace | Supabase | P0 |
| Wire menu pages to live queries | Marketplace, Dashboard | Supabase | P0 |
| Wire order creation (checkout → database) | Marketplace | Supabase | P0 |
| Wire order kanban to live order data | Dashboard | Supabase | P0 |
| Wire dispatch deliveries & history to live data | Dispatch | Supabase | P0 |
| Real-time order updates via Supabase Realtime | Dashboard, Dispatch | Supabase Realtime | P1 |
| Optimistic UI updates for status changes | Dashboard | Supabase | P1 |

### Phase 2: Authentication & Accounts
> *User identity, roles, and saved data*

| Task | App(s) | Integration | Priority |
|------|--------|-------------|----------|
| Customer login via SMS OTP | Marketplace | Twilio + Supabase Auth | P0 |
| Guest checkout → account creation flow | Marketplace | Supabase Auth | P0 |
| Restaurant staff login with role-based access | Dashboard | Supabase Auth | P0 |
| Coordinator login for dispatch console | Dispatch | Supabase Auth | P1 |
| Saved addresses per customer | Marketplace | Supabase | P1 |
| Order history per customer | Marketplace | Supabase | P1 |
| Row-level security policies | All | Supabase | P0 |

### Phase 3: Payments
> *Real money flow from customer to restaurant to driver*

| Task | App(s) | Integration | Priority |
|------|--------|-------------|----------|
| Stripe Connect onboarding for restaurants | Dashboard | Stripe Connect | P0 |
| Customer payment processing (cards) | Marketplace | Stripe | P0 |
| Apple Pay / Google Pay | Marketplace | Stripe | P1 |
| Tip allocation to drivers | Dashboard, Dispatch | Stripe | P0 |
| Weekly/biweekly restaurant settlement batches | Dashboard | Stripe Connect | P0 |
| Refund and chargeback handling | Dashboard | Stripe | P1 |
| Earnings page with real settlement data | Dashboard | Stripe + Supabase | P0 |

### Phase 4: Delivery Operations
> *Real driver dispatch, routing, and GPS tracking*

| Task | App(s) | Integration | Priority |
|------|--------|-------------|----------|
| Onfleet task creation from new orders | Dispatch | Onfleet API | P0 |
| Auto-assignment based on driver proximity | Dispatch | Onfleet | P0 |
| Real-time GPS tracking on order page | Marketplace | Onfleet + Mapbox | P0 |
| Driver status sync (Onfleet → Supabase) | Dispatch | Onfleet webhooks | P0 |
| Webhook receivers for task status updates | API | Onfleet | P0 |
| Backup courier partner API integration | Dispatch | TBD | P2 |
| Driver mobile app config | Dispatch | Onfleet Driver App | P1 |

### Phase 5: Notifications & Communication
> *Keep everyone informed at every step*

| Task | App(s) | Integration | Priority |
|------|--------|-------------|----------|
| SMS order confirmation to customer | Marketplace | Twilio | P0 |
| SMS delivery updates (picked up, arriving) | Marketplace | Twilio | P0 |
| Push notifications for new orders | Dashboard | Web Push API | P1 |
| Email receipts | Marketplace | SendGrid / Resend | P1 |
| Driver notifications for new assignments | Dispatch | Onfleet | P0 |
| Alert escalation for delayed orders | Dispatch | Twilio | P1 |

### Phase 6: Analytics & Admin
> *Data-driven program management*

| Task | App(s) | Integration | Priority |
|------|--------|-------------|----------|
| PostHog analytics integration | Marketplace | PostHog | P1 |
| Admin dashboard for city program managers | New app? | Supabase | P2 |
| Restaurant onboarding wizard | Dashboard | Stripe + Supabase | P1 |
| A/B testing framework | Marketplace | PostHog | P2 |
| Revenue & usage reporting | Admin | Supabase | P2 |

### Phase 7: Polish & Scale
> *Production hardening and user delight*

| Task | App(s) | Integration | Priority |
|------|--------|-------------|----------|
| PWA install prompt & offline support | Marketplace | Service Worker | P1 |
| Mapbox integration for live map | Dispatch | Mapbox GL | P1 |
| Image CDN for food photos | Marketplace | Cloudinary / Supabase Storage | P1 |
| Performance monitoring & error tracking | All | Sentry | P1 |
| Load testing & horizontal scaling | Infra | Railway | P2 |
| Custom domain (rwcdelivers.com) | Infra | Railway + DNS | P1 |
| SEO & Open Graph metadata | Marketplace | — | P1 |
| Accessibility audit (WCAG 2.1 AA) | All | — | P1 |

---

## Priority Key

| Label | Meaning |
|-------|---------|
| **P0** | Must have — blocks launch |
| **P1** | Should have — needed for good UX |
| **P2** | Nice to have — can launch without |
