// Mock data for RWC Delivers Delivery Dispatch App
// All prices in cents. Today: 2026-03-18

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: "city_driver" | "courier_partner";
  is_active: boolean;
  status: "on_duty" | "off_duty" | "on_delivery" | "returning";
  current_location: { lat: number; lng: number } | null;
  deliveries_today: number;
  avg_delivery_time: number; // minutes
  rating: number; // 1-5
  hired_at: string;
  photo_initial: string; // first letter of name
}

export interface ActiveDelivery {
  id: string;
  order_number: string; // RWC-20260318-XXXX format
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  customer_address: string;
  driver_name: string | null;
  driver_id: string | null;
  status:
    | "awaiting_driver"
    | "driver_assigned"
    | "en_route_to_pickup"
    | "at_pickup"
    | "en_route_to_delivery"
    | "delivered";
  items_summary: string;
  order_total: number; // cents
  estimated_pickup: string; // ISO timestamp
  estimated_delivery: string; // ISO timestamp
  placed_at: string;
  pickup_location: { lat: number; lng: number };
  delivery_location: { lat: number; lng: number };
}

export interface Shift {
  id: string;
  driver_id: string;
  driver_name: string;
  shift_date: string; // YYYY-MM-DD
  shift_type: "lunch" | "dinner" | "weekend";
  shift_start: string; // "11:00 AM"
  shift_end: string; // "2:00 PM" etc
  status: "scheduled" | "active" | "completed" | "no_show";
  deliveries_completed: number;
}

export interface PerformanceStats {
  today: { deliveries: number; avgTime: number; onTimeRate: number };
  thisWeek: { deliveries: number; avgTime: number; onTimeRate: number };
  thisMonth: { deliveries: number; avgTime: number; onTimeRate: number };
  dailyVolume: { date: string; cityDriver: number; courier: number }[];
  avgDeliveryTime: { date: string; minutes: number }[];
  costPerDelivery: { date: string; cost: number }[];
  driverLeaderboard: {
    name: string;
    deliveries: number;
    avgTime: number;
    rating: number;
  }[];
}

export interface Alert {
  id: string;
  type:
    | "failed_delivery"
    | "coverage_gap"
    | "driver_late"
    | "long_wait"
    | "escalation";
  severity: "high" | "medium" | "low";
  message: string;
  order_number?: string;
  driver_name?: string;
  timestamp: string;
  resolved: boolean;
}

export interface CompletedDelivery {
  id: string;
  order_number: string;
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  customer_address: string;
  driver_name: string;
  driver_id: string;
  driver_type: "city_driver" | "courier_partner";
  status: "delivered" | "failed";
  items_summary: string;
  order_total: number;
  delivery_fee: number;
  tip: number;
  placed_at: string;
  picked_up_at: string;
  delivered_at: string;
  delivery_time: number; // minutes from placed to delivered
  on_time: boolean;
  rating: number | null;
  pickup_location: { lat: number; lng: number };
  delivery_location: { lat: number; lng: number };
}

// ---------------------------------------------------------------------------
// 1. Drivers
// ---------------------------------------------------------------------------

export function getMockDrivers(): Driver[] {
  return [
    // --- City drivers (students) ---
    {
      id: "drv_01",
      name: "Marcus Chen",
      phone: "(650) 555-0111",
      email: "marcus.chen@rwcdelivers.gov",
      type: "city_driver",
      is_active: true,
      status: "on_duty",
      current_location: { lat: 37.4852, lng: -122.2364 },
      deliveries_today: 4,
      avg_delivery_time: 24,
      rating: 4.8,
      hired_at: "2025-09-15",
      photo_initial: "M",
    },
    {
      id: "drv_02",
      name: "Sofia Ramirez",
      phone: "(650) 555-0122",
      email: "sofia.ramirez@rwcdelivers.gov",
      type: "city_driver",
      is_active: true,
      status: "on_delivery",
      current_location: { lat: 37.4871, lng: -122.2291 },
      deliveries_today: 5,
      avg_delivery_time: 22,
      rating: 4.9,
      hired_at: "2025-08-20",
      photo_initial: "S",
    },
    {
      id: "drv_03",
      name: "Tyler Washington",
      phone: "(650) 555-0133",
      email: "tyler.washington@rwcdelivers.gov",
      type: "city_driver",
      is_active: true,
      status: "on_duty",
      current_location: { lat: 37.4863, lng: -122.2328 },
      deliveries_today: 3,
      avg_delivery_time: 27,
      rating: 4.5,
      hired_at: "2025-10-01",
      photo_initial: "T",
    },
    {
      id: "drv_04",
      name: "Priya Patel",
      phone: "(650) 555-0144",
      email: "priya.patel@rwcdelivers.gov",
      type: "city_driver",
      is_active: true,
      status: "on_delivery",
      current_location: { lat: 37.4889, lng: -122.2415 },
      deliveries_today: 6,
      avg_delivery_time: 21,
      rating: 4.9,
      hired_at: "2025-07-10",
      photo_initial: "P",
    },
    {
      id: "drv_05",
      name: "Jordan Lee",
      phone: "(650) 555-0155",
      email: "jordan.lee@rwcdelivers.gov",
      type: "city_driver",
      is_active: true,
      status: "returning",
      current_location: { lat: 37.4841, lng: -122.2389 },
      deliveries_today: 4,
      avg_delivery_time: 26,
      rating: 4.6,
      hired_at: "2025-11-05",
      photo_initial: "J",
    },
    {
      id: "drv_06",
      name: "Emily Nguyen",
      phone: "(650) 555-0166",
      email: "emily.nguyen@rwcdelivers.gov",
      type: "city_driver",
      is_active: true,
      status: "on_duty",
      current_location: { lat: 37.4876, lng: -122.2345 },
      deliveries_today: 2,
      avg_delivery_time: 25,
      rating: 4.7,
      hired_at: "2026-01-12",
      photo_initial: "E",
    },
    {
      id: "drv_07",
      name: "Aiden Brooks",
      phone: "(650) 555-0177",
      email: "aiden.brooks@rwcdelivers.gov",
      type: "city_driver",
      is_active: false,
      status: "off_duty",
      current_location: null,
      deliveries_today: 0,
      avg_delivery_time: 28,
      rating: 4.3,
      hired_at: "2025-12-01",
      photo_initial: "A",
    },
    {
      id: "drv_08",
      name: "Camila Torres",
      phone: "(650) 555-0188",
      email: "camila.torres@rwcdelivers.gov",
      type: "city_driver",
      is_active: false,
      status: "off_duty",
      current_location: null,
      deliveries_today: 0,
      avg_delivery_time: 23,
      rating: 4.8,
      hired_at: "2025-09-01",
      photo_initial: "C",
    },
    // --- Courier partners ---
    {
      id: "drv_09",
      name: "DashFleet - Unit 7",
      phone: "(650) 555-0199",
      email: "dispatch@dashfleet.com",
      type: "courier_partner",
      is_active: true,
      status: "on_duty",
      current_location: { lat: 37.4835, lng: -122.2301 },
      deliveries_today: 8,
      avg_delivery_time: 29,
      rating: 4.2,
      hired_at: "2025-06-01",
      photo_initial: "D",
    },
    {
      id: "drv_10",
      name: "QuickRun - Alex",
      phone: "(650) 555-0200",
      email: "alex@quickrun.co",
      type: "courier_partner",
      is_active: true,
      status: "on_delivery",
      current_location: { lat: 37.4858, lng: -122.2272 },
      deliveries_today: 7,
      avg_delivery_time: 30,
      rating: 4.1,
      hired_at: "2025-08-15",
      photo_initial: "Q",
    },
    {
      id: "drv_11",
      name: "PedalPost - Jamie",
      phone: "(650) 555-0211",
      email: "jamie@pedalpost.com",
      type: "courier_partner",
      is_active: true,
      status: "on_duty",
      current_location: { lat: 37.4845, lng: -122.2355 },
      deliveries_today: 5,
      avg_delivery_time: 32,
      rating: 4.0,
      hired_at: "2025-10-20",
      photo_initial: "P",
    },
    {
      id: "drv_12",
      name: "SwiftDrop - Maria",
      phone: "(650) 555-0222",
      email: "maria@swiftdrop.co",
      type: "courier_partner",
      is_active: true,
      status: "returning",
      current_location: { lat: 37.4892, lng: -122.2333 },
      deliveries_today: 6,
      avg_delivery_time: 27,
      rating: 4.4,
      hired_at: "2025-07-25",
      photo_initial: "S",
    },
  ];
}

// ---------------------------------------------------------------------------
// 2. Active Deliveries
// ---------------------------------------------------------------------------

export function getMockActiveDeliveries(): ActiveDelivery[] {
  return [
    {
      id: "del_a01",
      order_number: "RWC-20260318-1042",
      restaurant_name: "La Viga",
      restaurant_address: "1772 Broadway St, Redwood City, CA 94063",
      customer_name: "Rachel Kim",
      customer_address: "815 Brewster Ave, Redwood City, CA 94063",
      driver_name: "Sofia Ramirez",
      driver_id: "drv_02",
      status: "en_route_to_delivery",
      items_summary: "2x Fish Tacos, 1x Elote, 1x Horchata",
      order_total: 3475,
      estimated_pickup: "2026-03-18T12:15:00-07:00",
      estimated_delivery: "2026-03-18T12:38:00-07:00",
      placed_at: "2026-03-18T12:02:00-07:00",
      pickup_location: { lat: 37.4862, lng: -122.2295 },
      delivery_location: { lat: 37.4821, lng: -122.2371 },
    },
    {
      id: "del_a02",
      order_number: "RWC-20260318-1048",
      restaurant_name: "Vesta",
      restaurant_address: "2022 Broadway St, Redwood City, CA 94063",
      customer_name: "David Hernandez",
      customer_address: "540 Stambaugh St, Redwood City, CA 94063",
      driver_name: "Priya Patel",
      driver_id: "drv_04",
      status: "at_pickup",
      items_summary: "1x Margherita Pizza, 1x Burrata Salad, 2x Espresso",
      order_total: 4850,
      estimated_pickup: "2026-03-18T12:25:00-07:00",
      estimated_delivery: "2026-03-18T12:48:00-07:00",
      placed_at: "2026-03-18T12:08:00-07:00",
      pickup_location: { lat: 37.4868, lng: -122.2310 },
      delivery_location: { lat: 37.4899, lng: -122.2402 },
    },
    {
      id: "del_a03",
      order_number: "RWC-20260318-1055",
      restaurant_name: "Mazra",
      restaurant_address: "2111 Broadway St, Redwood City, CA 94063",
      customer_name: "Jennifer Liu",
      customer_address: "321 Elm St, Redwood City, CA 94063",
      driver_name: null,
      driver_id: null,
      status: "awaiting_driver",
      items_summary: "2x Lamb Shawarma, 1x Hummus, 1x Fattoush",
      order_total: 4225,
      estimated_pickup: "2026-03-18T12:35:00-07:00",
      estimated_delivery: "2026-03-18T12:58:00-07:00",
      placed_at: "2026-03-18T12:18:00-07:00",
      pickup_location: { lat: 37.4870, lng: -122.2318 },
      delivery_location: { lat: 37.4833, lng: -122.2389 },
    },
    {
      id: "del_a04",
      order_number: "RWC-20260318-1101",
      restaurant_name: "Donato Enoteca",
      restaurant_address: "1 Vivian Dr, Redwood City, CA 94063",
      customer_name: "Michael Thompson",
      customer_address: "1250 Jefferson Ave, Redwood City, CA 94062",
      driver_name: "QuickRun - Alex",
      driver_id: "drv_10",
      status: "en_route_to_pickup",
      items_summary: "1x Pappardelle Bolognese, 1x Tiramisu, 1x Chianti (glass)",
      order_total: 5675,
      estimated_pickup: "2026-03-18T12:30:00-07:00",
      estimated_delivery: "2026-03-18T12:55:00-07:00",
      placed_at: "2026-03-18T12:12:00-07:00",
      pickup_location: { lat: 37.4855, lng: -122.2285 },
      delivery_location: { lat: 37.4810, lng: -122.2440 },
    },
    {
      id: "del_a05",
      order_number: "RWC-20260318-1108",
      restaurant_name: "Broadway Masala",
      restaurant_address: "2397 Broadway St, Redwood City, CA 94063",
      customer_name: "Sarah O'Brien",
      customer_address: "708 Woodside Rd, Redwood City, CA 94061",
      driver_name: "Marcus Chen",
      driver_id: "drv_01",
      status: "driver_assigned",
      items_summary: "1x Chicken Tikka Masala, 2x Garlic Naan, 1x Mango Lassi",
      order_total: 3290,
      estimated_pickup: "2026-03-18T12:40:00-07:00",
      estimated_delivery: "2026-03-18T13:05:00-07:00",
      placed_at: "2026-03-18T12:22:00-07:00",
      pickup_location: { lat: 37.4878, lng: -122.2335 },
      delivery_location: { lat: 37.4790, lng: -122.2410 },
    },
    {
      id: "del_a06",
      order_number: "RWC-20260318-1115",
      restaurant_name: "Angelicas",
      restaurant_address: "863 Main St, Redwood City, CA 94063",
      customer_name: "Brian Park",
      customer_address: "455 Oak Ave, Redwood City, CA 94061",
      driver_name: null,
      driver_id: null,
      status: "awaiting_driver",
      items_summary: "1x Mole Enchiladas, 1x Ceviche, 2x Margarita",
      order_total: 5100,
      estimated_pickup: "2026-03-18T12:45:00-07:00",
      estimated_delivery: "2026-03-18T13:10:00-07:00",
      placed_at: "2026-03-18T12:28:00-07:00",
      pickup_location: { lat: 37.4848, lng: -122.2307 },
      delivery_location: { lat: 37.4815, lng: -122.2355 },
    },
    {
      id: "del_a07",
      order_number: "RWC-20260318-1122",
      restaurant_name: "Timber & Salt",
      restaurant_address: "803 Laurel St, Redwood City, CA 94063",
      customer_name: "Amanda Fischer",
      customer_address: "1050 Main St, Redwood City, CA 94063",
      driver_name: "Tyler Washington",
      driver_id: "drv_03",
      status: "en_route_to_pickup",
      items_summary: "2x Smoked Brisket Sandwich, 1x Mac & Cheese, 1x Lemonade",
      order_total: 4180,
      estimated_pickup: "2026-03-18T12:42:00-07:00",
      estimated_delivery: "2026-03-18T13:05:00-07:00",
      placed_at: "2026-03-18T12:25:00-07:00",
      pickup_location: { lat: 37.4860, lng: -122.2322 },
      delivery_location: { lat: 37.4843, lng: -122.2280 },
    },
    {
      id: "del_a08",
      order_number: "RWC-20260318-1130",
      restaurant_name: "Bao",
      restaurant_address: "2020 Broadway St, Redwood City, CA 94063",
      customer_name: "Kevin Tran",
      customer_address: "620 Vera Ave, Redwood City, CA 94061",
      driver_name: "Emily Nguyen",
      driver_id: "drv_06",
      status: "driver_assigned",
      items_summary: "3x Pork Bao Buns, 1x Dan Dan Noodles, 1x Jasmine Tea",
      order_total: 2995,
      estimated_pickup: "2026-03-18T12:50:00-07:00",
      estimated_delivery: "2026-03-18T13:15:00-07:00",
      placed_at: "2026-03-18T12:32:00-07:00",
      pickup_location: { lat: 37.4867, lng: -122.2312 },
      delivery_location: { lat: 37.4802, lng: -122.2378 },
    },
  ];
}

// ---------------------------------------------------------------------------
// 3. Shifts  (Mon 3/16 – Sun 3/22, 2026)
// ---------------------------------------------------------------------------

export function getMockShifts(): Shift[] {
  return [
    // --- Monday 3/16 (completed) ---
    { id: "shf_01", driver_id: "drv_01", driver_name: "Marcus Chen", shift_date: "2026-03-16", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "completed", deliveries_completed: 5 },
    { id: "shf_02", driver_id: "drv_02", driver_name: "Sofia Ramirez", shift_date: "2026-03-16", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "completed", deliveries_completed: 6 },
    { id: "shf_03", driver_id: "drv_04", driver_name: "Priya Patel", shift_date: "2026-03-16", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "completed", deliveries_completed: 8 },
    { id: "shf_04", driver_id: "drv_09", driver_name: "DashFleet - Unit 7", shift_date: "2026-03-16", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "completed", deliveries_completed: 7 },

    // --- Tuesday 3/17 (completed) ---
    { id: "shf_05", driver_id: "drv_03", driver_name: "Tyler Washington", shift_date: "2026-03-17", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "completed", deliveries_completed: 4 },
    { id: "shf_06", driver_id: "drv_06", driver_name: "Emily Nguyen", shift_date: "2026-03-17", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "completed", deliveries_completed: 3 },
    { id: "shf_07", driver_id: "drv_05", driver_name: "Jordan Lee", shift_date: "2026-03-17", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "completed", deliveries_completed: 6 },
    { id: "shf_08", driver_id: "drv_10", driver_name: "QuickRun - Alex", shift_date: "2026-03-17", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "completed", deliveries_completed: 7 },

    // --- Wednesday 3/18 — TODAY ---
    { id: "shf_09", driver_id: "drv_01", driver_name: "Marcus Chen", shift_date: "2026-03-18", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "active", deliveries_completed: 4 },
    { id: "shf_10", driver_id: "drv_02", driver_name: "Sofia Ramirez", shift_date: "2026-03-18", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "active", deliveries_completed: 5 },
    { id: "shf_11", driver_id: "drv_04", driver_name: "Priya Patel", shift_date: "2026-03-18", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "active", deliveries_completed: 6 },
    { id: "shf_12", driver_id: "drv_03", driver_name: "Tyler Washington", shift_date: "2026-03-18", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "active", deliveries_completed: 3 },
    { id: "shf_13", driver_id: "drv_06", driver_name: "Emily Nguyen", shift_date: "2026-03-18", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "active", deliveries_completed: 2 },
    { id: "shf_14", driver_id: "drv_05", driver_name: "Jordan Lee", shift_date: "2026-03-18", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_15", driver_id: "drv_09", driver_name: "DashFleet - Unit 7", shift_date: "2026-03-18", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_16", driver_id: "drv_11", driver_name: "PedalPost - Jamie", shift_date: "2026-03-18", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },

    // --- Thursday 3/19 ---
    { id: "shf_17", driver_id: "drv_02", driver_name: "Sofia Ramirez", shift_date: "2026-03-19", shift_type: "lunch", shift_start: "11:00 AM", shift_end: "2:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_18", driver_id: "drv_04", driver_name: "Priya Patel", shift_date: "2026-03-19", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_19", driver_id: "drv_12", driver_name: "SwiftDrop - Maria", shift_date: "2026-03-19", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },

    // --- Friday 3/20 ---
    { id: "shf_20", driver_id: "drv_01", driver_name: "Marcus Chen", shift_date: "2026-03-20", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_21", driver_id: "drv_08", driver_name: "Camila Torres", shift_date: "2026-03-20", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_22", driver_id: "drv_10", driver_name: "QuickRun - Alex", shift_date: "2026-03-20", shift_type: "dinner", shift_start: "5:00 PM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },

    // --- Saturday 3/21 (weekend) ---
    { id: "shf_23", driver_id: "drv_02", driver_name: "Sofia Ramirez", shift_date: "2026-03-21", shift_type: "weekend", shift_start: "11:00 AM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_24", driver_id: "drv_09", driver_name: "DashFleet - Unit 7", shift_date: "2026-03-21", shift_type: "weekend", shift_start: "11:00 AM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },

    // --- Sunday 3/22 (weekend) ---
    { id: "shf_25", driver_id: "drv_04", driver_name: "Priya Patel", shift_date: "2026-03-22", shift_type: "weekend", shift_start: "11:00 AM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
    { id: "shf_26", driver_id: "drv_11", driver_name: "PedalPost - Jamie", shift_date: "2026-03-22", shift_type: "weekend", shift_start: "11:00 AM", shift_end: "9:00 PM", status: "scheduled", deliveries_completed: 0 },
  ];
}

// ---------------------------------------------------------------------------
// 4. Performance Stats
// ---------------------------------------------------------------------------

export function getMockPerformanceStats(): PerformanceStats {
  return {
    today: { deliveries: 28, avgTime: 25, onTimeRate: 0.92 },
    thisWeek: { deliveries: 94, avgTime: 26, onTimeRate: 0.89 },
    thisMonth: { deliveries: 412, avgTime: 27, onTimeRate: 0.87 },

    // 14 days of daily volume (March 5–18)
    dailyVolume: [
      { date: "2026-03-05", cityDriver: 14, courier: 8 },
      { date: "2026-03-06", cityDriver: 16, courier: 10 },
      { date: "2026-03-07", cityDriver: 20, courier: 12 },
      { date: "2026-03-08", cityDriver: 22, courier: 14 },
      { date: "2026-03-09", cityDriver: 18, courier: 11 },
      { date: "2026-03-10", cityDriver: 15, courier: 9 },
      { date: "2026-03-11", cityDriver: 17, courier: 10 },
      { date: "2026-03-12", cityDriver: 19, courier: 11 },
      { date: "2026-03-13", cityDriver: 21, courier: 13 },
      { date: "2026-03-14", cityDriver: 24, courier: 14 },
      { date: "2026-03-15", cityDriver: 26, courier: 15 },
      { date: "2026-03-16", cityDriver: 20, courier: 12 },
      { date: "2026-03-17", cityDriver: 22, courier: 13 },
      { date: "2026-03-18", cityDriver: 18, courier: 10 },
    ],

    // 14 days of average delivery time
    avgDeliveryTime: [
      { date: "2026-03-05", minutes: 31 },
      { date: "2026-03-06", minutes: 30 },
      { date: "2026-03-07", minutes: 29 },
      { date: "2026-03-08", minutes: 28 },
      { date: "2026-03-09", minutes: 29 },
      { date: "2026-03-10", minutes: 28 },
      { date: "2026-03-11", minutes: 27 },
      { date: "2026-03-12", minutes: 27 },
      { date: "2026-03-13", minutes: 26 },
      { date: "2026-03-14", minutes: 26 },
      { date: "2026-03-15", minutes: 25 },
      { date: "2026-03-16", minutes: 26 },
      { date: "2026-03-17", minutes: 25 },
      { date: "2026-03-18", minutes: 25 },
    ],

    // 14 days of cost per delivery in cents — trending down
    costPerDelivery: [
      { date: "2026-03-05", cost: 485 },
      { date: "2026-03-06", cost: 472 },
      { date: "2026-03-07", cost: 460 },
      { date: "2026-03-08", cost: 448 },
      { date: "2026-03-09", cost: 455 },
      { date: "2026-03-10", cost: 440 },
      { date: "2026-03-11", cost: 432 },
      { date: "2026-03-12", cost: 425 },
      { date: "2026-03-13", cost: 418 },
      { date: "2026-03-14", cost: 410 },
      { date: "2026-03-15", cost: 405 },
      { date: "2026-03-16", cost: 398 },
      { date: "2026-03-17", cost: 392 },
      { date: "2026-03-18", cost: 385 },
    ],

    driverLeaderboard: [
      { name: "Priya Patel", deliveries: 48, avgTime: 21, rating: 4.9 },
      { name: "Sofia Ramirez", deliveries: 45, avgTime: 22, rating: 4.9 },
      { name: "Marcus Chen", deliveries: 40, avgTime: 24, rating: 4.8 },
      { name: "Camila Torres", deliveries: 38, avgTime: 23, rating: 4.8 },
      { name: "DashFleet - Unit 7", deliveries: 52, avgTime: 29, rating: 4.2 },
      { name: "QuickRun - Alex", deliveries: 49, avgTime: 30, rating: 4.1 },
      { name: "Jordan Lee", deliveries: 36, avgTime: 26, rating: 4.6 },
      { name: "Emily Nguyen", deliveries: 28, avgTime: 25, rating: 4.7 },
      { name: "Tyler Washington", deliveries: 32, avgTime: 27, rating: 4.5 },
      { name: "SwiftDrop - Maria", deliveries: 44, avgTime: 27, rating: 4.4 },
    ],
  };
}

// ---------------------------------------------------------------------------
// 5. Alerts
// ---------------------------------------------------------------------------

export function getMockAlerts(): Alert[] {
  return [
    {
      id: "alt_01",
      type: "long_wait",
      severity: "high",
      message:
        "Order RWC-20260318-1055 has been waiting 12 minutes with no driver assigned.",
      order_number: "RWC-20260318-1055",
      timestamp: "2026-03-18T12:30:00-07:00",
      resolved: false,
    },
    {
      id: "alt_02",
      type: "driver_late",
      severity: "medium",
      message:
        "QuickRun - Alex is running 8 minutes behind estimated pickup for Donato Enoteca order.",
      order_number: "RWC-20260318-1101",
      driver_name: "QuickRun - Alex",
      timestamp: "2026-03-18T12:33:00-07:00",
      resolved: false,
    },
    {
      id: "alt_03",
      type: "coverage_gap",
      severity: "high",
      message:
        "No drivers scheduled for dinner shift on Thursday 3/19. Only courier partners available.",
      timestamp: "2026-03-18T09:00:00-07:00",
      resolved: false,
    },
    {
      id: "alt_04",
      type: "failed_delivery",
      severity: "high",
      message:
        "Delivery RWC-20260317-0934 failed: customer not available. Food returned to Broadway Masala.",
      order_number: "RWC-20260317-0934",
      driver_name: "Jordan Lee",
      timestamp: "2026-03-17T18:42:00-07:00",
      resolved: true,
    },
    {
      id: "alt_05",
      type: "escalation",
      severity: "medium",
      message:
        'Customer complaint on order RWC-20260317-0812: "Food arrived cold." Refund issued.',
      order_number: "RWC-20260317-0812",
      timestamp: "2026-03-17T20:15:00-07:00",
      resolved: true,
    },
    {
      id: "alt_06",
      type: "long_wait",
      severity: "low",
      message:
        "Order RWC-20260318-1115 at Angelicas awaiting driver assignment for 5 minutes.",
      order_number: "RWC-20260318-1115",
      timestamp: "2026-03-18T12:33:00-07:00",
      resolved: false,
    },
  ];
}

// ---------------------------------------------------------------------------
// 6. Delivery History (20 completed deliveries from last 7 days)
// ---------------------------------------------------------------------------

export function getMockDeliveryHistory(): CompletedDelivery[] {
  return [
    {
      id: "del_h01",
      order_number: "RWC-20260318-0901",
      restaurant_name: "La Viga",
      restaurant_address: "1772 Broadway St, Redwood City, CA 94063",
      customer_name: "Anna Martinez",
      customer_address: "305 Bay Rd, Redwood City, CA 94063",
      driver_name: "Marcus Chen",
      driver_id: "drv_01",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Carnitas Burrito, 1x Chips & Guac",
      order_total: 2150,
      delivery_fee: 299,
      tip: 400,
      placed_at: "2026-03-18T09:05:00-07:00",
      picked_up_at: "2026-03-18T09:22:00-07:00",
      delivered_at: "2026-03-18T09:38:00-07:00",
      delivery_time: 33,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4862, lng: -122.2295 },
      delivery_location: { lat: 37.4830, lng: -122.2350 },
    },
    {
      id: "del_h02",
      order_number: "RWC-20260318-0915",
      restaurant_name: "Bao",
      restaurant_address: "2020 Broadway St, Redwood City, CA 94063",
      customer_name: "Chris Wong",
      customer_address: "112 Finger Ave, Redwood City, CA 94062",
      driver_name: "Sofia Ramirez",
      driver_id: "drv_02",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "2x Pork Bao Buns, 1x Wonton Soup",
      order_total: 2480,
      delivery_fee: 299,
      tip: 350,
      placed_at: "2026-03-18T09:18:00-07:00",
      picked_up_at: "2026-03-18T09:30:00-07:00",
      delivered_at: "2026-03-18T09:42:00-07:00",
      delivery_time: 24,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4867, lng: -122.2312 },
      delivery_location: { lat: 37.4805, lng: -122.2400 },
    },
    {
      id: "del_h03",
      order_number: "RWC-20260318-0928",
      restaurant_name: "Mazra",
      restaurant_address: "2111 Broadway St, Redwood City, CA 94063",
      customer_name: "Tom Bradley",
      customer_address: "830 Charter St, Redwood City, CA 94063",
      driver_name: "Priya Patel",
      driver_id: "drv_04",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Chicken Shawarma Plate, 1x Baklava",
      order_total: 2275,
      delivery_fee: 299,
      tip: 300,
      placed_at: "2026-03-18T09:30:00-07:00",
      picked_up_at: "2026-03-18T09:48:00-07:00",
      delivered_at: "2026-03-18T10:00:00-07:00",
      delivery_time: 30,
      on_time: true,
      rating: 4,
      pickup_location: { lat: 37.4870, lng: -122.2318 },
      delivery_location: { lat: 37.4845, lng: -122.2365 },
    },
    {
      id: "del_h04",
      order_number: "RWC-20260317-1205",
      restaurant_name: "Donato Enoteca",
      restaurant_address: "1 Vivian Dr, Redwood City, CA 94063",
      customer_name: "Lisa Greenfield",
      customer_address: "975 Woodside Rd, Redwood City, CA 94061",
      driver_name: "DashFleet - Unit 7",
      driver_id: "drv_09",
      driver_type: "courier_partner",
      status: "delivered",
      items_summary: "1x Risotto ai Funghi, 1x Insalata Mista",
      order_total: 3800,
      delivery_fee: 299,
      tip: 500,
      placed_at: "2026-03-17T12:08:00-07:00",
      picked_up_at: "2026-03-17T12:28:00-07:00",
      delivered_at: "2026-03-17T12:48:00-07:00",
      delivery_time: 40,
      on_time: false,
      rating: 3,
      pickup_location: { lat: 37.4855, lng: -122.2285 },
      delivery_location: { lat: 37.4780, lng: -122.2430 },
    },
    {
      id: "del_h05",
      order_number: "RWC-20260317-1145",
      restaurant_name: "Broadway Masala",
      restaurant_address: "2397 Broadway St, Redwood City, CA 94063",
      customer_name: "Raj Kapoor",
      customer_address: "200 El Camino Real, Redwood City, CA 94063",
      driver_name: "Tyler Washington",
      driver_id: "drv_03",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "2x Butter Chicken, 3x Naan, 1x Raita",
      order_total: 4490,
      delivery_fee: 299,
      tip: 600,
      placed_at: "2026-03-17T11:48:00-07:00",
      picked_up_at: "2026-03-17T12:05:00-07:00",
      delivered_at: "2026-03-17T12:18:00-07:00",
      delivery_time: 30,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4878, lng: -122.2335 },
      delivery_location: { lat: 37.4860, lng: -122.2270 },
    },
    {
      id: "del_h06",
      order_number: "RWC-20260317-1820",
      restaurant_name: "Vesta",
      restaurant_address: "2022 Broadway St, Redwood City, CA 94063",
      customer_name: "Michelle Davis",
      customer_address: "490 Winslow St, Redwood City, CA 94063",
      driver_name: "Jordan Lee",
      driver_id: "drv_05",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Pepperoni Pizza, 1x Caesar Salad",
      order_total: 2990,
      delivery_fee: 299,
      tip: 400,
      placed_at: "2026-03-17T18:22:00-07:00",
      picked_up_at: "2026-03-17T18:40:00-07:00",
      delivered_at: "2026-03-17T18:55:00-07:00",
      delivery_time: 33,
      on_time: true,
      rating: 4,
      pickup_location: { lat: 37.4868, lng: -122.2310 },
      delivery_location: { lat: 37.4838, lng: -122.2342 },
    },
    {
      id: "del_h07",
      order_number: "RWC-20260317-1905",
      restaurant_name: "Timber & Salt",
      restaurant_address: "803 Laurel St, Redwood City, CA 94063",
      customer_name: "Greg Simmons",
      customer_address: "1500 Hudson St, Redwood City, CA 94061",
      driver_name: "QuickRun - Alex",
      driver_id: "drv_10",
      driver_type: "courier_partner",
      status: "delivered",
      items_summary: "1x Pulled Pork Plate, 1x Coleslaw, 1x Cornbread",
      order_total: 2650,
      delivery_fee: 299,
      tip: 350,
      placed_at: "2026-03-17T19:08:00-07:00",
      picked_up_at: "2026-03-17T19:25:00-07:00",
      delivered_at: "2026-03-17T19:45:00-07:00",
      delivery_time: 37,
      on_time: false,
      rating: 4,
      pickup_location: { lat: 37.4860, lng: -122.2322 },
      delivery_location: { lat: 37.4795, lng: -122.2410 },
    },
    {
      id: "del_h08",
      order_number: "RWC-20260316-1210",
      restaurant_name: "Angelicas",
      restaurant_address: "863 Main St, Redwood City, CA 94063",
      customer_name: "Patricia Holmes",
      customer_address: "725 Arguello St, Redwood City, CA 94063",
      driver_name: "Marcus Chen",
      driver_id: "drv_01",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Chile Relleno, 1x Rice & Beans",
      order_total: 1975,
      delivery_fee: 299,
      tip: 300,
      placed_at: "2026-03-16T12:12:00-07:00",
      picked_up_at: "2026-03-16T12:28:00-07:00",
      delivered_at: "2026-03-16T12:40:00-07:00",
      delivery_time: 28,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4848, lng: -122.2307 },
      delivery_location: { lat: 37.4835, lng: -122.2360 },
    },
    {
      id: "del_h09",
      order_number: "RWC-20260316-1235",
      restaurant_name: "La Viga",
      restaurant_address: "1772 Broadway St, Redwood City, CA 94063",
      customer_name: "Steven Yates",
      customer_address: "440 Maple St, Redwood City, CA 94063",
      driver_name: "Sofia Ramirez",
      driver_id: "drv_02",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "3x Shrimp Tacos, 2x Agua Fresca",
      order_total: 3120,
      delivery_fee: 299,
      tip: 450,
      placed_at: "2026-03-16T12:38:00-07:00",
      picked_up_at: "2026-03-16T12:52:00-07:00",
      delivered_at: "2026-03-16T13:05:00-07:00",
      delivery_time: 27,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4862, lng: -122.2295 },
      delivery_location: { lat: 37.4850, lng: -122.2380 },
    },
    {
      id: "del_h10",
      order_number: "RWC-20260316-1830",
      restaurant_name: "Bao",
      restaurant_address: "2020 Broadway St, Redwood City, CA 94063",
      customer_name: "Karen Olsen",
      customer_address: "610 Spring St, Redwood City, CA 94063",
      driver_name: "Priya Patel",
      driver_id: "drv_04",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Kung Pao Chicken, 1x Fried Rice, 2x Spring Rolls",
      order_total: 3340,
      delivery_fee: 299,
      tip: 500,
      placed_at: "2026-03-16T18:32:00-07:00",
      picked_up_at: "2026-03-16T18:48:00-07:00",
      delivered_at: "2026-03-16T19:02:00-07:00",
      delivery_time: 30,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4867, lng: -122.2312 },
      delivery_location: { lat: 37.4840, lng: -122.2335 },
    },
    {
      id: "del_h11",
      order_number: "RWC-20260315-1200",
      restaurant_name: "Mazra",
      restaurant_address: "2111 Broadway St, Redwood City, CA 94063",
      customer_name: "Diane Foster",
      customer_address: "280 Redwood Ave, Redwood City, CA 94061",
      driver_name: "SwiftDrop - Maria",
      driver_id: "drv_12",
      driver_type: "courier_partner",
      status: "delivered",
      items_summary: "1x Falafel Wrap, 1x Tabbouleh, 1x Mint Lemonade",
      order_total: 2190,
      delivery_fee: 299,
      tip: 300,
      placed_at: "2026-03-15T12:02:00-07:00",
      picked_up_at: "2026-03-15T12:18:00-07:00",
      delivered_at: "2026-03-15T12:35:00-07:00",
      delivery_time: 33,
      on_time: true,
      rating: 4,
      pickup_location: { lat: 37.4870, lng: -122.2318 },
      delivery_location: { lat: 37.4812, lng: -122.2395 },
    },
    {
      id: "del_h12",
      order_number: "RWC-20260315-1830",
      restaurant_name: "Donato Enoteca",
      restaurant_address: "1 Vivian Dr, Redwood City, CA 94063",
      customer_name: "Robert Nakamura",
      customer_address: "1100 Middlefield Rd, Redwood City, CA 94063",
      driver_name: "Emily Nguyen",
      driver_id: "drv_06",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Osso Buco, 1x Bruschetta, 1x Prosecco",
      order_total: 5200,
      delivery_fee: 299,
      tip: 800,
      placed_at: "2026-03-15T18:32:00-07:00",
      picked_up_at: "2026-03-15T18:55:00-07:00",
      delivered_at: "2026-03-15T19:12:00-07:00",
      delivery_time: 40,
      on_time: false,
      rating: 4,
      pickup_location: { lat: 37.4855, lng: -122.2285 },
      delivery_location: { lat: 37.4825, lng: -122.2320 },
    },
    {
      id: "del_h13",
      order_number: "RWC-20260314-1150",
      restaurant_name: "Vesta",
      restaurant_address: "2022 Broadway St, Redwood City, CA 94063",
      customer_name: "Nancy Whitfield",
      customer_address: "950 Main St, Redwood City, CA 94063",
      driver_name: "Camila Torres",
      driver_id: "drv_08",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "2x Margherita Pizza, 1x Arancini",
      order_total: 3450,
      delivery_fee: 299,
      tip: 500,
      placed_at: "2026-03-14T11:52:00-07:00",
      picked_up_at: "2026-03-14T12:10:00-07:00",
      delivered_at: "2026-03-14T12:22:00-07:00",
      delivery_time: 30,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4868, lng: -122.2310 },
      delivery_location: { lat: 37.4843, lng: -122.2280 },
    },
    {
      id: "del_h14",
      order_number: "RWC-20260314-1825",
      restaurant_name: "Broadway Masala",
      restaurant_address: "2397 Broadway St, Redwood City, CA 94063",
      customer_name: "James Rivera",
      customer_address: "335 Duane St, Redwood City, CA 94062",
      driver_name: "PedalPost - Jamie",
      driver_id: "drv_11",
      driver_type: "courier_partner",
      status: "failed",
      items_summary: "1x Lamb Biryani, 1x Samosa (4pc), 1x Chai",
      order_total: 3175,
      delivery_fee: 299,
      tip: 400,
      placed_at: "2026-03-14T18:28:00-07:00",
      picked_up_at: "2026-03-14T18:48:00-07:00",
      delivered_at: "2026-03-14T19:10:00-07:00",
      delivery_time: 42,
      on_time: false,
      rating: 3,
      pickup_location: { lat: 37.4878, lng: -122.2335 },
      delivery_location: { lat: 37.4808, lng: -122.2415 },
    },
    {
      id: "del_h15",
      order_number: "RWC-20260313-1215",
      restaurant_name: "Timber & Salt",
      restaurant_address: "803 Laurel St, Redwood City, CA 94063",
      customer_name: "Heather Blake",
      customer_address: "520 Bradford St, Redwood City, CA 94063",
      driver_name: "Marcus Chen",
      driver_id: "drv_01",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Brisket Plate, 1x Side Mac & Cheese, 1x Sweet Tea",
      order_total: 2890,
      delivery_fee: 299,
      tip: 400,
      placed_at: "2026-03-13T12:18:00-07:00",
      picked_up_at: "2026-03-13T12:35:00-07:00",
      delivered_at: "2026-03-13T12:48:00-07:00",
      delivery_time: 30,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4860, lng: -122.2322 },
      delivery_location: { lat: 37.4842, lng: -122.2355 },
    },
    {
      id: "del_h16",
      order_number: "RWC-20260313-1850",
      restaurant_name: "Angelicas",
      restaurant_address: "863 Main St, Redwood City, CA 94063",
      customer_name: "Victor Castillo",
      customer_address: "890 Warren St, Redwood City, CA 94063",
      driver_name: "Priya Patel",
      driver_id: "drv_04",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Pozole, 1x Quesadilla, 1x Churros",
      order_total: 2780,
      delivery_fee: 299,
      tip: 350,
      placed_at: "2026-03-13T18:52:00-07:00",
      picked_up_at: "2026-03-13T19:08:00-07:00",
      delivered_at: "2026-03-13T19:20:00-07:00",
      delivery_time: 28,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4848, lng: -122.2307 },
      delivery_location: { lat: 37.4855, lng: -122.2370 },
    },
    {
      id: "del_h17",
      order_number: "RWC-20260312-1140",
      restaurant_name: "La Viga",
      restaurant_address: "1772 Broadway St, Redwood City, CA 94063",
      customer_name: "Cynthia Park",
      customer_address: "215 Birch St, Redwood City, CA 94062",
      driver_name: "Sofia Ramirez",
      driver_id: "drv_02",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Al Pastor Plate, 1x Carne Asada Tacos (3)",
      order_total: 2950,
      delivery_fee: 299,
      tip: 400,
      placed_at: "2026-03-12T11:42:00-07:00",
      picked_up_at: "2026-03-12T11:58:00-07:00",
      delivered_at: "2026-03-12T12:10:00-07:00",
      delivery_time: 28,
      on_time: true,
      rating: 5,
      pickup_location: { lat: 37.4862, lng: -122.2295 },
      delivery_location: { lat: 37.4820, lng: -122.2385 },
    },
    {
      id: "del_h18",
      order_number: "RWC-20260312-1900",
      restaurant_name: "Vesta",
      restaurant_address: "2022 Broadway St, Redwood City, CA 94063",
      customer_name: "Douglas Meier",
      customer_address: "730 Lathrop St, Redwood City, CA 94063",
      driver_name: "DashFleet - Unit 7",
      driver_id: "drv_09",
      driver_type: "courier_partner",
      status: "delivered",
      items_summary: "1x Quattro Formaggi Pizza, 1x Caprese Salad",
      order_total: 3200,
      delivery_fee: 299,
      tip: 450,
      placed_at: "2026-03-12T19:02:00-07:00",
      picked_up_at: "2026-03-12T19:22:00-07:00",
      delivered_at: "2026-03-12T19:40:00-07:00",
      delivery_time: 38,
      on_time: false,
      rating: 3,
      pickup_location: { lat: 37.4868, lng: -122.2310 },
      delivery_location: { lat: 37.4832, lng: -122.2348 },
    },
    {
      id: "del_h19",
      order_number: "RWC-20260311-1225",
      restaurant_name: "Bao",
      restaurant_address: "2020 Broadway St, Redwood City, CA 94063",
      customer_name: "Linda Chow",
      customer_address: "405 James Ave, Redwood City, CA 94062",
      driver_name: "Aiden Brooks",
      driver_id: "drv_07",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "2x Char Siu Bao, 1x Hot & Sour Soup, 1x Green Tea",
      order_total: 2310,
      delivery_fee: 299,
      tip: 300,
      placed_at: "2026-03-11T12:28:00-07:00",
      picked_up_at: "2026-03-11T12:45:00-07:00",
      delivered_at: "2026-03-11T13:02:00-07:00",
      delivery_time: 34,
      on_time: true,
      rating: 4,
      pickup_location: { lat: 37.4867, lng: -122.2312 },
      delivery_location: { lat: 37.4818, lng: -122.2405 },
    },
    {
      id: "del_h20",
      order_number: "RWC-20260311-1815",
      restaurant_name: "Mazra",
      restaurant_address: "2111 Broadway St, Redwood City, CA 94063",
      customer_name: "Eric Johansson",
      customer_address: "680 Hopkins Ave, Redwood City, CA 94063",
      driver_name: "Tyler Washington",
      driver_id: "drv_03",
      driver_type: "city_driver",
      status: "delivered",
      items_summary: "1x Mixed Grill Platter, 1x Hummus, 1x Pita Bread",
      order_total: 3560,
      delivery_fee: 299,
      tip: 500,
      placed_at: "2026-03-11T18:18:00-07:00",
      picked_up_at: "2026-03-11T18:35:00-07:00",
      delivered_at: "2026-03-11T18:52:00-07:00",
      delivery_time: 34,
      on_time: true,
      rating: 4,
      pickup_location: { lat: 37.4870, lng: -122.2318 },
      delivery_location: { lat: 37.4848, lng: -122.2375 },
    },
  ];
}
