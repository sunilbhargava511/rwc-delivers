const SHIPDAY_BASE_URL = "https://api.shipday.com";

function getApiKey(): string {
  const key = process.env.SHIPDAY_API_KEY;
  if (!key) throw new Error("Missing SHIPDAY_API_KEY environment variable");
  return key;
}

async function shipdayFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${SHIPDAY_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shipday API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ----- Types -----

export interface ShipdayOrderInput {
  order_id: string;
  order_number: string;
  restaurant_name: string;
  restaurant_phone: string;
  restaurant_address: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  order_items: { name: string; quantity: number }[];
  delivery_fee: number; // dollars (Shipday uses dollars, not cents)
  tips: number; // dollars
  pickup_time: string; // ISO datetime
  delivery_time: string; // ISO datetime
  assigned_driver_id?: string; // Shipday driver ID for explicit assignment
  zone_id?: string;
  batch_id?: string;
}

export interface ShipdayOrder {
  orderId: number;
  orderNumber: string;
  companyId: number;
  trackingLink: string;
  deliveryStatus:
    | "READY_TO_PICKUP"
    | "ASSIGNED"
    | "STARTED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "FAILED"
    | "CANCELLED";
  assignedCarrier?: {
    id: number;
    name: string;
    phone: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface ShipdayDriver {
  id: number;
  name: string;
  phone: string;
  email?: string;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

// ----- API Functions -----

export async function createOrder(
  input: ShipdayOrderInput
): Promise<ShipdayOrder> {
  return shipdayFetch<ShipdayOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      orderNumber: input.order_number,
      customerName: input.customer_name,
      customerPhone: input.customer_phone,
      customerAddress: input.customer_address,
      restaurantName: input.restaurant_name,
      restaurantPhone: input.restaurant_phone,
      restaurantAddress: input.restaurant_address,
      orderItems: input.order_items,
      deliveryFee: input.delivery_fee,
      tips: input.tips,
      pickupTime: input.pickup_time,
      deliveryTime: input.delivery_time,
      assignedDriverId: input.assigned_driver_id,
      orderMetadata: {
        order_id: input.order_id,
        zone_id: input.zone_id ?? null,
        batch_id: input.batch_id ?? null,
      },
    }),
  });
}

export async function getOrder(shipdayOrderId: number): Promise<ShipdayOrder> {
  return shipdayFetch<ShipdayOrder>(`/orders/${shipdayOrderId}`);
}

export async function assignDriver(
  shipdayOrderId: number,
  shipdayDriverId: number
): Promise<void> {
  await shipdayFetch(`/orders/${shipdayOrderId}/assign`, {
    method: "POST",
    body: JSON.stringify({ driverId: shipdayDriverId }),
  });
}

export async function getDrivers(): Promise<ShipdayDriver[]> {
  return shipdayFetch<ShipdayDriver[]>("/carriers");
}

export async function getDriver(shipdayDriverId: number): Promise<ShipdayDriver> {
  return shipdayFetch<ShipdayDriver>(`/carriers/${shipdayDriverId}`);
}
