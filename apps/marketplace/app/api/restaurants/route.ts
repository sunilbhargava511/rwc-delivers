import { NextResponse } from "next/server";
import { getMockRestaurants } from "../../../lib/mock-data";

export async function GET() {
  // In production: const restaurants = await getRestaurants();
  const restaurants = getMockRestaurants();

  return NextResponse.json(restaurants, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
