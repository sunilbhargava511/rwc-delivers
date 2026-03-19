-- Rename Onfleet columns to Shipday to match the chosen delivery platform.
-- Shipday is a "dumb" driver app layer — our dispatch app controls zone-based
-- batching and assignment; Shipday provides the driver mobile app, GPS tracking,
-- and proof of delivery.

-- orders: onfleet_task_id → shipday_order_id
ALTER TABLE orders RENAME COLUMN onfleet_task_id TO shipday_order_id;

-- drivers: onfleet_worker_id → shipday_driver_id
ALTER TABLE drivers RENAME COLUMN onfleet_worker_id TO shipday_driver_id;

-- delivery_assignments: onfleet_task_id → shipday_order_id
ALTER TABLE delivery_assignments RENAME COLUMN onfleet_task_id TO shipday_order_id;

-- Add new columns from the dispatch spec that don't exist yet
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS delivery_photo_url TEXT;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES delivery_zones(id);
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS batch_id UUID;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS is_batched BOOLEAN DEFAULT false;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS driver_name TEXT;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS driver_phone TEXT;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS estimated_pickup_at TIMESTAMPTZ;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS estimated_delivery_at TIMESTAMPTZ;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'assigned';

-- Add zone-specific columns to delivery_zones (from spec)
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS delivery_fee INTEGER DEFAULT 400;
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS estimated_delivery_minutes INTEGER DEFAULT 30;
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS batch_order_threshold INTEGER;
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS batch_time_cap_minutes INTEGER;
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS radius_miles DECIMAL;
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add driver type and hired_at (from spec)
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'city_driver';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS hired_at DATE;

-- Add zone assignment to driver_shifts (from spec)
ALTER TABLE driver_shifts ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES delivery_zones(id);
ALTER TABLE driver_shifts ADD COLUMN IF NOT EXISTS actual_start TIMESTAMPTZ;
ALTER TABLE driver_shifts ADD COLUMN IF NOT EXISTS actual_end TIMESTAMPTZ;
ALTER TABLE driver_shifts ADD COLUMN IF NOT EXISTS deliveries_completed INTEGER DEFAULT 0;
ALTER TABLE driver_shifts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled';
