import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, getOrderWithAddress, createShipdayOrder, logDispatchEvent } from "@rwc/db";
import type { OrderStatus } from "@rwc/shared";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;

  let body: { status: OrderStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { status } = body;
  if (!status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  try {
    await updateOrderStatus(id, status);

    // When order becomes ready_for_pickup, create Shipday order for delivery
    // The dispatch app's zone batching engine will handle driver assignment
    if (status === "ready_for_pickup" && process.env.SHIPDAY_API_KEY) {
      try {
        const orderData = await getOrderWithAddress(id);
        if (orderData) {
          const { order, delivery_address, restaurant } = orderData;
          const shipdayOrder = await createShipdayOrder({
            order_id: id,
            order_number: order.order_number,
            restaurant_name: restaurant.name,
            restaurant_phone: restaurant.phone,
            restaurant_address: restaurant.address,
            customer_name: "Customer", // pre-auth, no name available
            customer_phone: "", // will be populated once auth is wired
            customer_address: `${delivery_address.street}, ${delivery_address.city}, ${delivery_address.state} ${delivery_address.zip}`,
            order_items: order.items.map((item) => ({
              name: item.item_name,
              quantity: item.quantity,
            })),
            delivery_fee: order.delivery_fee / 100, // Shipday uses dollars
            tips: order.tip / 100,
            pickup_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            delivery_time: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
          });

          // Store Shipday order ID and tracking URL
          const { createServerClient } = await import("@rwc/db");
          const supabase = createServerClient();
          await supabase
            .from("orders")
            .update({ shipday_order_id: shipdayOrder.orderId } as any)
            .eq("id", id);

          await logDispatchEvent(id, "shipday_order_created", "dashboard", {
            shipday_order_id: shipdayOrder.orderId,
            tracking_link: shipdayOrder.trackingLink,
          });
        }
      } catch (shipdayErr) {
        // Log but don't fail the status update
        console.error("Shipday order creation failed:", shipdayErr);
        await logDispatchEvent(id, "shipday_order_creation_failed", "dashboard", {
          error: String(shipdayErr),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update status" },
      { status: 400 }
    );
  }
}
