import { NextResponse } from "next/server";
import { getRestaurants } from "@rwc/db";

export async function GET() {
  const restaurants = await getRestaurants();

  return NextResponse.json(restaurants, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
