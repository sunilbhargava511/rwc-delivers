-- RWC Delivers - Database Functions

-- Check if a restaurant is currently open
CREATE OR REPLACE FUNCTION is_restaurant_open(p_restaurant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_now TIMESTAMPTZ := now();
  v_current_time TIME := v_now::TIME;
  v_day_of_week INTEGER := EXTRACT(DOW FROM v_now)::INTEGER;
  v_is_active BOOLEAN;
  v_is_open BOOLEAN := false;
  v_has_closure BOOLEAN;
BEGIN
  -- Check if restaurant is active
  SELECT is_active INTO v_is_active
  FROM restaurants WHERE id = p_restaurant_id;

  IF NOT v_is_active THEN
    RETURN false;
  END IF;

  -- Check for closures today
  SELECT EXISTS(
    SELECT 1 FROM restaurant_closures
    WHERE restaurant_id = p_restaurant_id
    AND v_now::DATE BETWEEN start_date AND end_date
  ) INTO v_has_closure;

  IF v_has_closure THEN
    RETURN false;
  END IF;

  -- Check hours for current day
  SELECT EXISTS(
    SELECT 1 FROM restaurant_hours
    WHERE restaurant_id = p_restaurant_id
    AND day_of_week = v_day_of_week
    AND (
      (NOT closes_next_day AND v_current_time >= open_time AND v_current_time < close_time)
      OR
      (closes_next_day AND v_current_time >= open_time)
    )
  ) INTO v_is_open;

  -- Also check if still open from previous day (closes_next_day)
  IF NOT v_is_open THEN
    SELECT EXISTS(
      SELECT 1 FROM restaurant_hours
      WHERE restaurant_id = p_restaurant_id
      AND day_of_week = (v_day_of_week + 6) % 7
      AND closes_next_day = true
      AND v_current_time < close_time
    ) INTO v_is_open;
  END IF;

  RETURN v_is_open;
END;
$$ LANGUAGE plpgsql STABLE;

-- Generate a sequential order number for today
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  v_today TEXT := to_char(now(), 'YYYYMMDD');
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO v_count
  FROM orders
  WHERE placed_at::DATE = now()::DATE;

  RETURN 'RWC-' || v_today || '-' || lpad(v_count::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
