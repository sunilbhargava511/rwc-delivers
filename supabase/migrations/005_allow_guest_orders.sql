-- Allow anonymous (guest) users to place orders without authentication.
-- This enables the guest checkout flow before auth is implemented.

-- Anon can insert customers (guest checkout creates a customer record by phone)
CREATE POLICY "Anon can insert guest customers"
  ON customers FOR INSERT
  WITH CHECK (is_guest = true);

-- Anon can select customers (needed for upsert to return the row)
CREATE POLICY "Anon can select guest customers"
  ON customers FOR SELECT
  USING (is_guest = true);

-- Anon can insert addresses (for delivery address during checkout)
CREATE POLICY "Anon can insert addresses"
  ON addresses FOR INSERT
  WITH CHECK (true);

-- Anon can place orders
CREATE POLICY "Anon can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Anon can select orders by ID (for order confirmation page)
CREATE POLICY "Anon can select orders"
  ON orders FOR SELECT
  USING (true);

-- Anon can insert order items (created as part of placing an order)
CREATE POLICY "Anon can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Anon can select order items (for order confirmation page)
CREATE POLICY "Anon can select order items"
  ON order_items FOR SELECT
  USING (true);
