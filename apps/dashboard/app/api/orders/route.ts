import { NextRequest, NextResponse } from "next/server";
import { getOrdersByRestaurant, getOrder } from "@rwc/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Single order fetch (for Realtime INSERT follow-up)
  const orderId = searchParams.get("id");
  if (orderId) {
    try {
      const order = await getOrder(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to fetch order" },
        { status: 500 }
      );
    }
  }

  // Restaurant orders fetch
  const restaurantId = searchParams.get("restaurant_id");
  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurant_id is required" },
      { status: 400 }
    );
  }

  try {
    const orders = await getOrdersByRestaurant(restaurantId);
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
