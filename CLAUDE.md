# RWC Delivers — Delivery Marketplace

## Project Overview
Community-owned delivery platform for Redwood City's independent restaurants. Three Next.js apps in a Turborepo monorepo, shared packages, deployed on Railway.

## Architecture

```
apps/
  marketplace/   → Customer-facing PWA (port 3000)
  dashboard/     → Restaurant owner portal (port 3001)
  dispatch/      → Delivery coordinator console (port 3002)
packages/
  shared/        → Types, constants, utilities (@rwc/shared)
  ui/            → Button, Badge, Skeleton components (@rwc/ui)
  db/            → Supabase client & queries (@rwc/db)
specs/           → 5 spec documents (architecture, marketplace, dashboard, dispatch, payments)
```

## Tech Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5.9
- **Styling:** Tailwind CSS 4 with shared config from @rwc/ui
- **State:** Zustand (cart), React useState (local)
- **Monorepo:** Turborepo + pnpm workspaces
- **Database:** Supabase (PostgreSQL + auth + realtime)
- **Payments:** Stripe Connect (planned)
- **Delivery:** Shipday integration (planned)
- **Deploy:** Railway (3 services)

## Conventions
- **Prices in cents** — all monetary values are integers (e.g., 1299 = $12.99). Use `formatCurrency()` from @rwc/shared to display.
- **Snake_case fields** — all data models use snake_case (e.g., `order_total`, `driver_name`, `restaurant_id`).
- **OrderStatus flow:** `placed → confirmed → preparing → ready_for_pickup → driver_assigned → en_route → delivered` (or `cancelled`).
- **"use client"** directive on all interactive pages (state, event handlers).
- **Imports:** Types/utils from `@rwc/shared`, components from `@rwc/ui`, db from `@rwc/db`.

## Key Commands
```bash
pnpm dev                          # All apps
pnpm dev --filter marketplace     # Single app
pnpm build --filter dashboard     # Build single app
pnpm build                        # Build everything
```

## Railway Deployment
Three services in project `902c8fac-3ada-45fe-8373-c830857f8aae`:
- **rwc-delivers** → marketplace (https://rwc-delivers-production.up.railway.app)
- **rwc-dashboard** → dashboard (https://rwc-dashboard-production.up.railway.app)
- **rwc-dispatch** → dispatch (https://rwc-dispatch-production.up.railway.app)

Each service uses env vars:
- `APP=marketplace|dashboard|dispatch`
- `NIXPACKS_BUILD_CMD=pnpm build --filter <app>`
- `NIXPACKS_START_CMD=cd apps/<app> && npx next start -p 3000`

Push to `main` triggers auto-deploy on all services.

## Current Status
- **Marketplace:** Complete with 15 real restaurant menus, Yelp food photos, cart, checkout, order tracking
- **Dashboard:** Complete with orders kanban, menu editor (86'd toggles), earnings/DoorDash comparison, settings
- **Dispatch:** Complete with live map, deliveries table, driver roster, schedule calendar, performance analytics, delivery history
- **All three apps use mock data** — no live database connection yet

## What's Not Built Yet
- Supabase database connection (queries exist in @rwc/db but not wired to apps)
- Authentication (Supabase Auth + Twilio SMS OTP)
- Stripe Connect payments & settlement
- Shipday delivery integration
- Real-time order updates (Supabase realtime subscriptions)
- Push notifications
- Admin/analytics dashboard (PostHog)
- Customer accounts & order history

## Deployment
When the user says "deploy", "deploy to studio", "push to studio", or similar:
- This machine is the **MacBook Pro** (dev machine). Run the `/deploy-studio` slash command.
