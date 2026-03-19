import { createServerClient } from "../client";
import type { Database } from "../types";

type Json = Database["public"]["Tables"]["dispatch_events"]["Insert"]["payload"];

// ----- Delivery Assignments -----

export async function createDeliveryAssignment(
  order_id: string,
  driver_id: string,
  shipday_order_id: string | null
): Promise<string> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("delivery_assignments")
    .insert({
      order_id,
      driver_id,
      shipday_order_id: shipday_order_id as any,
    })
    .select("id")
    .single();

  if (error || !data) throw error || new Error("Failed to create delivery assignment");
  return data.id;
}

export async function updateDeliveryAssignment(
  assignmentId: string,
  updates: {
    picked_up_at?: string;
    delivered_at?: string;
    driver_lat?: number;
    driver_lng?: number;
    tracking_url?: string;
    delivery_photo_url?: string;
  }
): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("delivery_assignments")
    .update(updates as any)
    .eq("id", assignmentId);

  if (error) throw error;
}

export async function getDeliveryAssignmentByOrderId(
  orderId: string
): Promise<{ id: string; driver_id: string; shipday_order_id: string | null } | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("delivery_assignments")
    .select("id, driver_id")
    .eq("order_id", orderId)
    .order("assigned_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { ...data, shipday_order_id: null } as any;
}

// ----- Drivers -----

export async function getDriverByShipdayId(
  shipdayDriverId: string
): Promise<{ id: string; full_name: string; phone: string } | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("drivers")
    .select("id, full_name, phone")
    .eq("shipday_driver_id" as any, shipdayDriverId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertDriverFromShipday(
  shipdayDriverId: string,
  fullName: string,
  phone: string
): Promise<string> {
  const supabase = createServerClient();

  // Check if driver exists
  const existing = await getDriverByShipdayId(shipdayDriverId);
  if (existing) return existing.id;

  // Create new driver
  const { data, error } = await supabase
    .from("drivers")
    .insert({
      full_name: fullName,
      phone,
      shipday_driver_id: shipdayDriverId,
      is_active: true,
    } as any)
    .select("id")
    .single();

  if (error || !data) throw error || new Error("Failed to create driver");
  return data.id;
}

// ----- Tip Records -----

export async function createTipRecord(
  orderId: string,
  deliveryAssignmentId: string,
  driverId: string,
  amount: number
): Promise<void> {
  const supabase = createServerClient();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { error } = await supabase.from("tip_records").insert({
    order_id: orderId,
    delivery_assignment_id: deliveryAssignmentId,
    driver_id: driverId,
    amount,
    shift_date: today,
    paid_via_payroll: false,
  });

  if (error) throw error;
}

// ----- Dispatch Events (Audit Log) -----

export async function logDispatchEvent(
  orderId: string | null,
  eventType: string,
  source: string,
  payload?: Record<string, unknown>
): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase.from("dispatch_events").insert({
    order_id: orderId,
    event_type: eventType,
    source,
    payload: (payload ?? null) as Json,
  });

  if (error) throw error;
}
