import { NextResponse } from "next/server";
import { createServerClient } from "@rwc/db";

export async function POST(request: Request) {
  try {
    const { order_id, driver_id } = await request.json();

    if (!order_id || !driver_id) {
      return NextResponse.json(
        { error: "order_id and driver_id are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Create delivery assignment
    const { data: assignment, error: assignErr } = await supabase
      .from("delivery_assignments")
      .insert({
        order_id,
        driver_id,
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

    return NextResponse.json({ success: true, assignment_id: assignment.id });
  } catch (err: any) {
    console.error("Failed to assign driver:", err);
    return NextResponse.json(
      { error: err.message || "Failed to assign driver" },
      { status: 500 }
    );
  }
}
