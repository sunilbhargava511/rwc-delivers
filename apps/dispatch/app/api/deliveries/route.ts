import { NextResponse } from "next/server";
import { createServerClient } from "@rwc/db";
import type { OrderStatus } from "@rwc/shared";
import type { ActiveDelivery } from "../../../lib/mock-data";

// Map OrderStatus to dispatch-app delivery status
function mapStatus(
  status: OrderStatus,
  hasDriver: boolean
): ActiveDelivery["status"] {
  switch (status) {
    case "placed":
    case "confirmed":
    case "preparing":
    case "ready_for_pickup":
      return hasDriver ? "driver_assigned" : "awaiting_driver";
    case "driver_assigned":
      return "driver_assigned";
    case "en_route":
      return "en_route_to_delivery";
    case "delivered":
      return "delivered";
    default:
      return "awaiting_driver";
  }
}

export async function GET() {
  try {
    const supabase = createServerClient();

    // Fetch active orders (not delivered/cancelled)
    const { data: orders, error: ordersErr } = await supabase
      .from("orders")
      .select("*")
      .in("status", [
        "placed",
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "driver_assigned",
        "en_route",
      ])
      .order("placed_at", { ascending: false });

    if (ordersErr) throw ordersErr;
    if (!orders || orders.length === 0) {
      return NextResponse.json([]);
    }

    const orderIds = orders.map((o) => o.id);

    // Fetch related data in parallel
    const [
      { data: allItems },
      { data: restaurants },
      { data: assignments },
      { data: addresses },
    ] = await Promise.all([
      supabase.from("order_items").select("*").in("order_id", orderIds),
      supabase
        .from("restaurants")
        .select("*")
        .in(
          "id",
          orders.map((o) => o.restaurant_id)
        ),
      supabase
        .from("delivery_assignments")
        .select("*, drivers(*)")
        .in("order_id", orderIds),
      supabase
        .from("addresses")
        .select("*")
        .in(
          "id",
          orders.map((o) => o.delivery_address_id)
        ),
    ]);

    // Build lookup maps
    const restaurantMap = new Map<string, any>();
    for (const r of restaurants || []) restaurantMap.set(r.id, r);

    const itemsByOrder = new Map<string, any[]>();
    for (const item of allItems || []) {
      const list = itemsByOrder.get(item.order_id) || [];
      list.push(item);
      itemsByOrder.set(item.order_id, list);
    }

    const assignmentByOrder = new Map<string, any>();
    for (const a of assignments || []) {
      assignmentByOrder.set(a.order_id, a);
    }

    const addressMap = new Map<string, any>();
    for (const addr of addresses || []) addressMap.set(addr.id, addr);

    // Transform to ActiveDelivery format
    const deliveries: ActiveDelivery[] = orders.map((order) => {
      const restaurant = restaurantMap.get(order.restaurant_id);
      const items = itemsByOrder.get(order.id) || [];
      const assignment = assignmentByOrder.get(order.id);
      const address = addressMap.get(order.delivery_address_id);
      const driver = assignment?.drivers;
      const hasDriver = !!assignment;

      const itemsSummary =
        items.length > 0
          ? items
              .map(
                (i: any) => `${i.quantity}x ${i.item_name || "Item"}`
              )
              .join(", ")
          : "Order items";

      // Default coords around Redwood City
      const restaurantLat = 37.4852;
      const restaurantLng = -122.2364;
      const customerLat = address?.lat ? Number(address.lat) : 37.4872;
      const customerLng = address?.lng ? Number(address.lng) : -122.229;

      return {
        id: order.id,
        order_number: order.order_number,
        restaurant_name: restaurant?.name || "Restaurant",
        restaurant_address: restaurant?.address || "Redwood City, CA",
        customer_name: "Customer", // No auth yet
        customer_address: address
          ? `${address.street}, ${address.city}`
          : "Redwood City, CA",
        driver_name: driver?.full_name || null,
        driver_id: driver?.id || null,
        status: mapStatus(order.status as OrderStatus, hasDriver),
        items_summary: itemsSummary,
        order_total: order.total,
        estimated_pickup: new Date(
          new Date(order.placed_at).getTime() + 20 * 60000
        ).toISOString(),
        estimated_delivery: new Date(
          new Date(order.placed_at).getTime() + 45 * 60000
        ).toISOString(),
        placed_at: order.placed_at,
        pickup_location: { lat: restaurantLat, lng: restaurantLng },
        delivery_location: { lat: customerLat, lng: customerLng },
      };
    });

    return NextResponse.json(deliveries);
  } catch (err: any) {
    console.error("Failed to fetch deliveries:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch deliveries" },
      { status: 500 }
    );
  }
}
