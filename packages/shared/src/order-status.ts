export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "driver_assigned",
  "en_route",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready_for_pickup: "Ready for Pickup",
  driver_assigned: "Driver Assigned",
  en_route: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Valid transitions: status → allowed next statuses
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready_for_pickup", "cancelled"],
  ready_for_pickup: ["driver_assigned"],
  driver_assigned: ["en_route"],
  en_route: ["en_route", "delivered"],
  delivered: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from].includes(to);
}

export function isTerminal(status: OrderStatus): boolean {
  return status === "delivered" || status === "cancelled";
}

export function isActive(status: OrderStatus): boolean {
  return !isTerminal(status);
}
