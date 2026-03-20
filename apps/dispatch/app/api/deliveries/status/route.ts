import { NextResponse } from "next/server";
import { createServerClient } from "@rwc/db";
import { canTransition } from "@rwc/shared";
import type { OrderStatus } from "@rwc/shared";

export async function POST(request: Request) {
  try {
    const { order_id, status } = await request.json();

    if (!order_id || !status) {
      return NextResponse.json(
        { error: "order_id and status are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get current order status
    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("status")
      .eq("id", order_id)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Validate transition
    const currentStatus = order.status as OrderStatus;
    const newStatus = status as OrderStatus;

    if (!canTransition(currentStatus, newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${newStatus}` },
        { status: 400 }
      );
    }

    // Update order status
    const { error: updateErr } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order_id);

    if (updateErr) throw updateErr;

    // If delivered, update delivery_assignment delivered_at
    if (newStatus === "delivered") {
      await supabase
        .from("delivery_assignments")
        .update({ delivered_at: new Date().toISOString() })
        .eq("order_id", order_id);
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err: any) {
    console.error("Failed to update delivery status:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
