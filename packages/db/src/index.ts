export { createBrowserClient, createServerClient } from "./client";
export type { Database } from "./types";
export { getRestaurants, getRestaurantBySlug, getRestaurantMenu } from "./queries/restaurants";
export { createOrder, getOrder, updateOrderStatus } from "./queries/orders";
