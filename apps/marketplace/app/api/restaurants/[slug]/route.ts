import { NextResponse } from "next/server";
import { getRestaurantBySlug, getRestaurantMenu } from "@rwc/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const menu = await getRestaurantMenu(restaurant.id);

  return NextResponse.json({ restaurant, menu });
}
