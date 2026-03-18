import { NextResponse } from "next/server";
import { getMockRestaurants, getMockMenu } from "../../../../lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // In production: const restaurant = await getRestaurantBySlug(slug);
  const restaurant = getMockRestaurants().find((r) => r.slug === slug);

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  // In production: const menu = await getRestaurantMenu(restaurant.id);
  const menu = getMockMenu(slug);

  return NextResponse.json({ restaurant, menu });
}
