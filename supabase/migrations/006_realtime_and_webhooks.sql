-- Enable Supabase Realtime on orders and delivery_assignments tables
-- so dashboard, marketplace, and dispatch can subscribe to live changes.

ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_assignments;

-- Enable RLS on tables that don't have it yet
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_shifts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PRE-AUTH PERMISSIVE POLICIES
-- These are intentionally open for the pre-auth phase.
-- Once Supabase Auth is wired up, replace with scoped policies.
-- ============================================================

-- Anon can update orders (dashboard status changes, webhook updates)
CREATE POLICY "Anon can update orders"
  ON orders FOR UPDATE
  USING (true);

-- Customer tracking page needs to see delivery assignments and driver info
CREATE POLICY "Anon can select delivery_assignments"
  ON delivery_assignments FOR SELECT
  USING (true);

CREATE POLICY "Anon can insert delivery_assignments"
  ON delivery_assignments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon can update delivery_assignments"
  ON delivery_assignments FOR UPDATE
  USING (true);

CREATE POLICY "Anon can select drivers"
  ON drivers FOR SELECT
  USING (true);

CREATE POLICY "Anon can insert drivers"
  ON drivers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon can update drivers"
  ON drivers FOR UPDATE
  USING (true);

-- Tip records (created by webhook on delivery completion)
CREATE POLICY "Anon can insert tip_records"
  ON tip_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon can select tip_records"
  ON tip_records FOR SELECT
  USING (true);

-- Dispatch events audit log
CREATE POLICY "Anon can insert dispatch_events"
  ON dispatch_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon can select dispatch_events"
  ON dispatch_events FOR SELECT
  USING (true);

-- Driver shifts (dispatch app reads these)
CREATE POLICY "Anon can select driver_shifts"
  ON driver_shifts FOR SELECT
  USING (true);
