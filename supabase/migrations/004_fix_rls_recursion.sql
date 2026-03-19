-- Fix infinite recursion in restaurant_staff RLS policy
-- The original policy queries restaurant_staff within its own SELECT policy

DROP POLICY IF EXISTS "Staff can view own staff list" ON restaurant_staff;

CREATE POLICY "Staff can view own staff list"
  ON restaurant_staff FOR SELECT
  USING (user_id = auth.uid());

-- Also fix the staff restaurant SELECT policy which conflicts with the public one
-- When anon user queries restaurants, the staff policy's subquery on restaurant_staff
-- triggers the recursive staff policy. Fix: make staff policy only apply to authenticated users.

DROP POLICY IF EXISTS "Staff can view own restaurant" ON restaurants;

CREATE POLICY "Staff can view own restaurant"
  ON restaurants FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    id IN (SELECT restaurant_id FROM restaurant_staff WHERE user_id = auth.uid())
  );
