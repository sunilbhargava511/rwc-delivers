import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // Validate required fields
  const { restaurant_id, items, delivery_address, phone, tip } = body;

  if (!restaurant_id || !items?.length || !delivery_address || !phone) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // In production:
  // 1. Validate items against current menu prices
  // 2. Validate delivery address against delivery zone
  // 3. Create Stripe PaymentIntent
  // 4. Create order + order_items in database
  // 5. Return order ID + client_secret for Stripe

  // Dev mode: create mock order
  const orderId = `order-${Date.now()}`;
  const today = new Date();
  const orderNumber = `RWC-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

  return NextResponse.json({
    id: orderId,
    order_number: orderNumber,
    status: "placed",
    estimated_delivery_at: new Date(
      Date.now() + 35 * 60 * 1000
    ).toISOString(),
  });
}
