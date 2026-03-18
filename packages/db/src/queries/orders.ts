import { createServerClient } from "../client";
import type { CartItem, OrderStatus, OrderWithItems, SelectedModifier } from "@rwc/shared";
import { DELIVERY_FEE, canTransition, formatOrderNumber } from "@rwc/shared";

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
    modifiers: item.modifiers as unknown as SelectedModifier[],
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

  return {
    ...(order as any),
    items: (items || []) as any[],
    restaurant: restaurant as any,
    delivery_assignment: null,
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

  const update: Record<string, unknown> = { status };
  if (status === "delivered") {
    update.delivered_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId);

  if (error) throw error;
}
