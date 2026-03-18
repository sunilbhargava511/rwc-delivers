-- RWC Delivers - Initial Database Schema
-- All prices stored in cents (integer)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE order_status AS ENUM (
  'placed', 'confirmed', 'preparing', 'ready_for_pickup',
  'driver_assigned', 'en_route', 'delivered', 'cancelled'
);

CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE settlement_status AS ENUM ('pending', 'processing', 'paid');
CREATE TYPE staff_role AS ENUM ('owner', 'manager', 'kitchen');

-- ============================================================
-- CUSTOMERS
-- ============================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT NOT NULL,
  full_name TEXT,
  is_guest BOOLEAN NOT NULL DEFAULT true,
  default_address_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_customers_phone ON customers(phone);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  street TEXT NOT NULL,
  unit TEXT,
  city TEXT NOT NULL DEFAULT 'Redwood City',
  state TEXT NOT NULL DEFAULT 'CA',
  zip TEXT NOT NULL,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  label TEXT,
  is_within_zone BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE customers
  ADD CONSTRAINT fk_default_address
  FOREIGN KEY (default_address_id) REFERENCES addresses(id) ON DELETE SET NULL;

-- ============================================================
-- RESTAURANTS
-- ============================================================

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cuisine_tags TEXT[] NOT NULL DEFAULT '{}',
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Redwood City',
  state TEXT NOT NULL DEFAULT 'CA',
  zip TEXT NOT NULL DEFAULT '94063',
  phone TEXT NOT NULL,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  rating DECIMAL NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  price_range TEXT NOT NULL DEFAULT '$$',
  is_active BOOLEAN NOT NULL DEFAULT true,
  default_prep_time_min INTEGER NOT NULL DEFAULT 25,
  stripe_account_id TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE restaurant_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  closes_next_day BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_restaurant_hours_restaurant ON restaurant_hours(restaurant_id);

CREATE TABLE restaurant_closures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT
);

CREATE TABLE restaurant_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role staff_role NOT NULL DEFAULT 'kitchen',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, user_id)
);

-- ============================================================
-- MENUS
-- ============================================================

CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_menu_categories_restaurant ON menu_categories(restaurant_id);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- cents
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);

CREATE TABLE modifier_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  min_selections INTEGER NOT NULL DEFAULT 0,
  max_selections INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE modifier_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_delta INTEGER NOT NULL DEFAULT 0, -- cents
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  status order_status NOT NULL DEFAULT 'placed',
  delivery_address_id UUID NOT NULL REFERENCES addresses(id),
  subtotal INTEGER NOT NULL, -- cents
  delivery_fee INTEGER NOT NULL, -- cents
  tip INTEGER NOT NULL DEFAULT 0, -- cents
  total INTEGER NOT NULL, -- cents
  stripe_payment_intent_id TEXT,
  onfleet_task_id TEXT,
  estimated_delivery_at TIMESTAMPTZ,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  notes TEXT
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  item_name TEXT NOT NULL, -- snapshot
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- cents, snapshot
  modifiers JSONB, -- snapshot of selected modifiers
  special_instructions TEXT
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- DELIVERY
-- ============================================================

CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  polygon JSONB NOT NULL, -- GeoJSON Polygon
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  onfleet_worker_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE delivery_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  onfleet_task_id TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  driver_lat DECIMAL,
  driver_lng DECIMAL
);

CREATE INDEX idx_delivery_assignments_order ON delivery_assignments(order_id);
CREATE INDEX idx_delivery_assignments_driver ON delivery_assignments(driver_id);

CREATE TABLE driver_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE(driver_id, shift_date)
);

CREATE INDEX idx_driver_shifts_lookup ON driver_shifts(driver_id, shift_date);

CREATE TABLE dispatch_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  event_type TEXT NOT NULL,
  source TEXT NOT NULL, -- 'stripe', 'onfleet', 'system'
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dispatch_events_order ON dispatch_events(order_id);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  stripe_payment_intent_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- cents (total charge)
  delivery_fee INTEGER NOT NULL, -- cents
  tip INTEGER NOT NULL, -- cents
  stripe_fee INTEGER NOT NULL DEFAULT 0, -- cents
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_order ON payments(order_id);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  amount INTEGER NOT NULL, -- cents (39900 = $399)
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscription_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL, -- cents
  status TEXT NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE restaurant_settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0,
  gross_food_sales INTEGER NOT NULL DEFAULT 0, -- cents
  stripe_transfer_id TEXT,
  status settlement_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tip_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  delivery_assignment_id UUID NOT NULL REFERENCES delivery_assignments(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  amount INTEGER NOT NULL, -- cents
  shift_date DATE NOT NULL,
  paid_via_payroll BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_tip_records_driver_shift ON tip_records(driver_id, shift_date);
