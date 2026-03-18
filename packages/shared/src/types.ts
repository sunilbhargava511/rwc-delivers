import type { OrderStatus } from "./order-status";

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  cuisine_tags: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  lat: number;
  lng: number;
  rating: number;
  review_count: number;
  price_range: string;
  is_active: boolean;
  default_prep_time_min: number;
  stripe_account_id: string | null;
  image_url: string | null;
  created_at: string;
}

export interface RestaurantHours {
  id: string;
  restaurant_id: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  open_time: string; // HH:MM
  close_time: string; // HH:MM
  closes_next_day: boolean;
}

export interface RestaurantClosure {
  id: string;
  restaurant_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_available: boolean;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number; // cents
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

export interface ModifierGroup {
  id: string;
  menu_item_id: string;
  name: string;
  is_required: boolean;
  min_selections: number;
  max_selections: number;
  sort_order: number;
}

export interface ModifierOption {
  id: string;
  modifier_group_id: string;
  name: string;
  price_delta: number; // cents (can be 0)
  is_available: boolean;
  sort_order: number;
}

export interface Customer {
  id: string;
  email: string | null;
  phone: string;
  full_name: string | null;
  is_guest: boolean;
  default_address_id: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  street: string;
  unit: string | null;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  label: string | null;
  is_within_zone: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  restaurant_id: string;
  status: OrderStatus;
  delivery_address_id: string;
  subtotal: number; // cents
  delivery_fee: number; // cents
  tip: number; // cents
  total: number; // cents
  stripe_payment_intent_id: string | null;
  onfleet_task_id: string | null;
  estimated_delivery_at: string | null;
  placed_at: string;
  delivered_at: string | null;
  notes: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string; // snapshot
  quantity: number;
  unit_price: number; // cents, snapshot
  modifiers: SelectedModifier[] | null; // jsonb snapshot
  special_instructions: string | null;
}

export interface SelectedModifier {
  group_name: string;
  option_name: string;
  price_delta: number; // cents
}

export interface DeliveryZone {
  id: string;
  name: string;
  polygon: GeoJSON.Polygon;
  is_active: boolean;
  created_at: string;
}

export interface Driver {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  is_active: boolean;
  onfleet_worker_id: string | null;
  created_at: string;
}

export interface DeliveryAssignment {
  id: string;
  order_id: string;
  driver_id: string;
  onfleet_task_id: string | null;
  assigned_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
  driver_lat: number | null;
  driver_lng: number | null;
}

export interface Payment {
  id: string;
  order_id: string;
  stripe_payment_intent_id: string;
  amount: number; // cents
  delivery_fee: number; // cents
  tip: number; // cents
  stripe_fee: number; // cents
  status: "pending" | "succeeded" | "failed" | "refunded";
  created_at: string;
}

export interface RestaurantSettlement {
  id: string;
  restaurant_id: string;
  period_start: string;
  period_end: string;
  total_orders: number;
  gross_food_sales: number; // cents
  stripe_transfer_id: string | null;
  status: "pending" | "processing" | "paid";
  created_at: string;
}

export interface TipRecord {
  id: string;
  order_id: string;
  delivery_assignment_id: string;
  driver_id: string;
  amount: number; // cents
  shift_date: string;
  paid_via_payroll: boolean;
}

// ----- Cart types (client-side) -----

export interface CartItem {
  id: string; // generated client-side
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number; // cents
  modifiers: SelectedModifier[];
  special_instructions: string;
  line_total: number; // cents
}

// ----- Enriched types for API responses -----

export interface RestaurantWithStatus extends Restaurant {
  is_open: boolean;
  hours: RestaurantHours[];
}

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItemWithModifiers[];
}

export interface MenuItemWithModifiers extends MenuItem {
  modifier_groups: ModifierGroupWithOptions[];
}

export interface ModifierGroupWithOptions extends ModifierGroup {
  options: ModifierOption[];
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  restaurant: Restaurant;
  delivery_assignment: DeliveryAssignment | null;
}
