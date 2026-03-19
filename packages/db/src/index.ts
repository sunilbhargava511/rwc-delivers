export { createBrowserClient, createServerClient, createServiceRoleClient } from "./client";
export type { Database } from "./types";
export { getRestaurants, getRestaurantBySlug, getRestaurantMenu } from "./queries/restaurants";
export { createOrder, getOrder, updateOrderStatus, getOrdersByRestaurant, getOrderWithAddress } from "./queries/orders";
export {
  createDeliveryAssignment,
  updateDeliveryAssignment,
  getDeliveryAssignmentByOrderId,
  getDriverByShipdayId,
  upsertDriverFromShipday,
  createTipRecord,
  logDispatchEvent,
} from "./queries/delivery";
export {
  createOrder as createShipdayOrder,
  getOrder as getShipdayOrder,
  assignDriver as assignShipdayDriver,
  getDrivers as getShipdayDrivers,
  getDriver as getShipdayDriver,
} from "./shipday";
