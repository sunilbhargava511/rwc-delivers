-- RWC Delivers - Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PUBLIC READ: Restaurants, menus, delivery zones
-- ============================================================

CREATE POLICY "Public can view active restaurants"
  ON restaurants FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view restaurant hours"
  ON restaurant_hours FOR SELECT
  USING (true);

CREATE POLICY "Public can view restaurant closures"
  ON restaurant_closures FOR SELECT
  USING (true);

CREATE POLICY "Public can view available menu categories"
  ON menu_categories FOR SELECT
  USING (is_available = true);

CREATE POLICY "Public can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

CREATE POLICY "Public can view modifier groups"
  ON modifier_groups FOR SELECT
  USING (true);

CREATE POLICY "Public can view available modifier options"
  ON modifier_options FOR SELECT
  USING (is_available = true);

CREATE POLICY "Public can view active delivery zones"
  ON delivery_zones FOR SELECT
  USING (is_active = true);

-- ============================================================
-- CUSTOMER: Own data access
-- ============================================================

CREATE POLICY "Customers can view own profile"
  ON customers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile"
  ON customers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Customers can view own addresses"
  ON addresses FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update own addresses"
  ON addresses FOR UPDATE
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can delete own addresses"
  ON addresses FOR DELETE
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can place orders"
  ON orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));

CREATE POLICY "Customers can view own payments"
  ON payments FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));

-- ============================================================
-- RESTAURANT STAFF: Scoped to their restaurant
-- ============================================================

CREATE POLICY "Staff can view own restaurant"
  ON restaurants FOR SELECT
  USING (id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid()));

CREATE POLICY "Staff can update own restaurant"
  ON restaurants FOR UPDATE
  USING (id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage own menu categories"
  ON menu_categories FOR ALL
  USING (restaurant_id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage own menu items"
  ON menu_items FOR ALL
  USING (restaurant_id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid()));

CREATE POLICY "Staff can view restaurant orders"
  ON orders FOR SELECT
  USING (restaurant_id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid()));

CREATE POLICY "Staff can update restaurant orders"
  ON orders FOR UPDATE
  USING (restaurant_id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid()));

CREATE POLICY "Staff can view own staff list"
  ON restaurant_staff FOR SELECT
  USING (restaurant_id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid()));
