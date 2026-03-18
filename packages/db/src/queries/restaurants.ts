import { createServerClient } from "../client";
import type {
  Restaurant,
  RestaurantWithStatus,
  MenuCategoryWithItems,
  RestaurantHours,
} from "@rwc/shared";
import { isRestaurantOpen } from "@rwc/shared";

export async function getRestaurants(): Promise<RestaurantWithStatus[]> {
  const supabase = createServerClient();

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  const { data: allHours } = await supabase
    .from("restaurant_hours")
    .select("*");

  return (restaurants || []).map((r) => {
    const hours = (allHours || []).filter(
      (h) => h.restaurant_id === r.id
    ) as RestaurantHours[];
    return {
      ...(r as unknown as Restaurant),
      is_open: isRestaurantOpen(hours),
      hours,
    };
  });
}

export async function getRestaurantBySlug(
  slug: string
): Promise<RestaurantWithStatus | null> {
  const supabase = createServerClient();

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !restaurant) return null;

  const { data: hours } = await supabase
    .from("restaurant_hours")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("day_of_week");

  const typedHours = (hours || []) as unknown as RestaurantHours[];

  return {
    ...(restaurant as unknown as Restaurant),
    is_open: isRestaurantOpen(typedHours),
    hours: typedHours,
  };
}

export async function getRestaurantMenu(
  restaurantId: string
): Promise<MenuCategoryWithItems[]> {
  const supabase = createServerClient();

  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_available", true)
    .order("sort_order");

  if (catError) throw catError;

  const { data: items, error: itemError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_available", true)
    .order("sort_order");

  if (itemError) throw itemError;

  const { data: modifierGroups } = await supabase
    .from("modifier_groups")
    .select("*")
    .in(
      "menu_item_id",
      (items || []).map((i) => i.id)
    )
    .order("sort_order");

  const { data: modifierOptions } = await supabase
    .from("modifier_options")
    .select("*")
    .in(
      "modifier_group_id",
      (modifierGroups || []).map((g) => g.id)
    )
    .eq("is_available", true)
    .order("sort_order");

  return (categories || []).map((cat) => ({
    ...(cat as any),
    items: (items || [])
      .filter((item) => item.category_id === cat.id)
      .map((item) => ({
        ...(item as any),
        modifier_groups: (modifierGroups || [])
          .filter((g) => g.menu_item_id === item.id)
          .map((g) => ({
            ...(g as any),
            options: (modifierOptions || []).filter(
              (o) => o.modifier_group_id === g.id
            ) as any[],
          })),
      })),
  }));
}
