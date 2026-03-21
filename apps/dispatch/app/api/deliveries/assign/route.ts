import { NextResponse } from "next/server";
import { createServerClient } from "@rwc/db";

export async function POST(request: Request) {
  try {
    const { order_id, driver_id, driver_name, driver_phone } = await request.json();

    if (!order_id || !driver_id) {
      return NextResponse.json(
        { error: "order_id and driver_id are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Ensure the driver exists in the DB
    // If driver_id doesn't match a real record (e.g. mock "drv_01"), create one
    let realDriverId = driver_id;
    const { data: existingDriver } = await supabase
      .from("drivers")
      .select("id")
      .eq("id", driver_id)
      .maybeSingle();

    if (!existingDriver) {
      // Create the driver record so the FK constraint is satisfied
      const { data: newDriver, error: driverErr } = await supabase
        .from("drivers")
        .insert({
          full_name: driver_name || "Driver",
          phone: driver_phone || "",
          is_active: true,
        } as any)
        .select("id")
        .single();

      if (driverErr) throw driverErr;
      realDriverId = newDriver.id;
    }

    // Create delivery assignment
    const { data: assignment, error: assignErr } = await supabase
      .from("delivery_assignments")
      .insert({
        order_id,
        driver_id: realDriverId,
      })
      .select("id")
      .single();

    if (assignErr) throw assignErr;

    // Update order status to driver_assigned
    const { error: orderErr } = await supabase
      .from("orders")
      .update({ status: "driver_assigned" })
      .eq("id", order_id);

    if (orderErr) throw orderErr;

    return NextResponse.json({ success: true, assignment_id: assignment.id, driver_id: realDriverId });
  } catch (err: any) {
    console.error("Failed to assign driver:", err);
    return NextResponse.json(
      { error: err.message || "Failed to assign driver" },
      { status: 500 }
    );
  }
}
