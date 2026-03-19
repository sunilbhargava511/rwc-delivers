import { createServerClient } from "../client";
import type { Database } from "../types";
import type { CartItem, OrderStatus, OrderWithItems, Address, Restaurant } from "@rwc/shared";
import { DELIVERY_FEE, canTransition, formatOrderNumber, isActive } from "@rwc/shared";

type Json = Database["public"]["Tables"]["order_items"]["Insert"]["modifiers"];

interface CreateOrderInput {
  customer_id: string;
  restaurant_id: string;
  delivery_address_id: string;
  items: CartItem[];
  tip: number; // cents
  notes?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const supabase = createServerClient();

  const subtotal = input.items.reduce((sum, item) => sum + item.line_total, 0);
  const total = subtotal + DELIVERY_FEE + input.tip;

  // Generate order number
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("placed_at", startOfDay.toISOString());

  const orderNumber = formatOrderNumber(today, (count || 0) + 1);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: input.customer_id,
      restaurant_id: input.restaurant_id,
      status: "placed",
      delivery_address_id: input.delivery_address_id,
      subtotal,
      delivery_fee: DELIVERY_FEE,
      tip: input.tip,
      total,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error || !order) throw error || new Error("Failed to create order");

  // Insert order items
  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    item_name: item.name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    modifiers: item.modifiers as unknown as Json,
    special_instructions: item.special_instructions || null,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order.id;
}

export async function getOrder(orderId: string): Promise<OrderWithItems | null> {
  const supabase = createServerClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", order.restaurant_id)
    .single();

  // Fetch delivery assignment with driver info if exists
  const { data: assignment } = await supabase
    .from("delivery_assignments")
    .select("*, drivers(*)")
    .eq("order_id", orderId)
    .order("assigned_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    ...(order as any),
    items: (items || []) as any[],
    restaurant: restaurant as any,
    delivery_assignment: assignment ?? null,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const supabase = createServerClient();

  // Fetch current status to validate the transition
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    throw fetchError || new Error(`Order ${orderId} not found`);
  }

  const currentStatus = order.status as OrderStatus;
  if (!canTransition(currentStatus, status)) {
    throw new Error(
      `Invalid status transition from "${currentStatus}" to "${status}"`
    );
  }

  const update: Database["public"]["Tables"]["orders"]["Update"] = { status };
  if (status === "delivered") {
    update.delivered_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId);

  if (error) throw error;
}

export async function getOrdersByRestaurant(
  restaurantId: string,
  statuses?: OrderStatus[]
): Promise<OrderWithItems[]> {
  const supabase = createServerClient();

  const isAll = restaurantId === "all";

  let query = supabase
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false });

  if (!isAll) {
    query = query.eq("restaurant_id", restaurantId);
  }

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }

  const { data: orders, error } = await query;
  if (error) throw error;
  if (!orders || orders.length === 0) return [];

  // Fetch items for all orders in one query
  const orderIds = orders.map((o) => o.id);
  const { data: allItems } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  // Fetch restaurants for these orders
  const restaurantIds = [...new Set(orders.map((o) => o.restaurant_id))];
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .in("id", restaurantIds);

  const restaurantMap = new Map<string, any>();
  for (const r of restaurants || []) {
    restaurantMap.set(r.id, r);
  }

  // Fetch delivery assignments for these orders
  const { data: assignments } = await supabase
    .from("delivery_assignments")
    .select("*, drivers(*)")
    .in("order_id", orderIds);

  const itemsByOrder = new Map<string, any[]>();
  for (const item of allItems || []) {
    const list = itemsByOrder.get(item.order_id) || [];
    list.push(item);
    itemsByOrder.set(item.order_id, list);
  }

  const assignmentByOrder = new Map<string, any>();
  for (const a of assignments || []) {
    assignmentByOrder.set(a.order_id, a);
  }

  return orders.map((order) => ({
    ...(order as any),
    items: (itemsByOrder.get(order.id) || []) as any[],
    restaurant: restaurantMap.get(order.restaurant_id) ?? null,
    delivery_assignment: assignmentByOrder.get(order.id) ?? null,
  }));
}

export async function getOrderWithAddress(
  orderId: string
): Promise<{
  order: OrderWithItems;
  delivery_address: Address;
  restaurant: Restaurant;
} | null> {
  const supabase = createServerClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) return null;

  const [{ data: items }, { data: restaurant }, { data: address }, { data: assignment }] =
    await Promise.all([
      supabase.from("order_items").select("*").eq("order_id", orderId),
      supabase.from("restaurants").select("*").eq("id", order.restaurant_id).single(),
      supabase.from("addresses").select("*").eq("id", order.delivery_address_id).single(),
      supabase
        .from("delivery_assignments")
        .select("*, drivers(*)")
        .eq("order_id", orderId)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (!restaurant || !address) return null;

  return {
    order: {
      ...(order as any),
      items: (items || []) as any[],
      restaurant: restaurant as any,
      delivery_assignment: assignment ?? null,
    },
    delivery_address: address as any,
    restaurant: restaurant as any,
  };
}
