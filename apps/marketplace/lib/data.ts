import { getRestaurants as dbGetRestaurants, getRestaurantBySlug as dbGetRestaurantBySlug, getRestaurantMenu as dbGetRestaurantMenu } from "@rwc/db";
import { getMockRestaurants, getMockMenu } from "./mock-data";
import type { RestaurantWithStatus, MenuCategoryWithItems } from "@rwc/shared";

/**
 * Data layer that tries Supabase first, falls back to mock data.
 * In demo mode (or when DB is unavailable), mock data is used.
 *
 * Server components can't read localStorage, so we always try the DB first
 * and fall back to mock data on any error. The client-side demo mode toggle
 * controls whether the demo banner is shown.
 */

export async function getRestaurants(): Promise<RestaurantWithStatus[]> {
  try {
    const data = await dbGetRestaurants();
    if (data.length > 0) return data;
  } catch {}
  return getMockRestaurants();
}

export async function getRestaurantBySlug(slug: string): Promise<RestaurantWithStatus | null> {
  try {
    const data = await dbGetRestaurantBySlug(slug);
    if (data) return data;
  } catch {}
  // Fall back to mock
  const all = getMockRestaurants();
  return all.find((r) => r.slug === slug) || null;
}

export async function getRestaurantMenu(restaurantId: string, slug?: string): Promise<MenuCategoryWithItems[]> {
  try {
    const data = await dbGetRestaurantMenu(restaurantId);
    if (data.length > 0) return data;
  } catch {}
  // Fall back to mock — use slug to find the right menu
  if (slug) {
    return getMockMenu(slug);
  }
  return [];
}
