import { NextResponse } from "next/server";
import { createServerClient } from "@rwc/db";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("restaurant_id, restaurants(name)")
      .order("placed_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !order) {
      return NextResponse.json({ restaurant_id: null, restaurant_name: null });
    }

    const restaurant = order.restaurants as any;

    return NextResponse.json({
      restaurant_id: order.restaurant_id,
      restaurant_name: restaurant?.name ?? null,
    });
  } catch {
    return NextResponse.json({ restaurant_id: null, restaurant_name: null });
  }
}
