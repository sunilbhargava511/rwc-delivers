import { NextResponse } from "next/server";
import { createOrder } from "@rwc/db";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { restaurant_id, items, delivery_address, phone, tip, notes } = body as {
      restaurant_id: string;
      items: Array<{ menu_item_id: string; quantity: number; unit_price: number; item_name: string; modifiers?: unknown; special_instructions?: string }>;
      delivery_address: { street: string; unit?: string; city?: string; zip?: string };
      phone: string;
      tip: number;
      notes?: string;
    };

    if (!restaurant_id || !items?.length || !delivery_address || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use untyped client for direct inserts to avoid Database generic issues
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upsert guest customer by phone
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        { phone, full_name: "Guest", email: null, is_guest: true },
        { onConflict: "phone" }
      )
      .select("id")
      .single();

    if (customerError || !customer) {
      console.error("Customer upsert failed:", customerError);
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
    }

    // Create delivery address
    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .insert({
        customer_id: customer.id,
        street: delivery_address.street,
        unit: delivery_address.unit || null,
        city: delivery_address.city || "Redwood City",
        state: "CA",
        zip: delivery_address.zip || "94063",
        lat: 37.485,
        lng: -122.228,
        is_within_zone: true,
      })
      .select("id")
      .single();

    if (addressError || !address) {
      console.error("Address insert failed:", addressError);
      return NextResponse.json(
        { error: "Failed to create address" },
        { status: 500 }
      );
    }

    // Map items to CartItem shape expected by createOrder
    const cartItems = items.map((item) => ({
      id: item.menu_item_id, // use menu_item_id as client id
      menu_item_id: item.menu_item_id,
      name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      modifiers: (item.modifiers || []) as Array<{ group_name: string; option_name: string; price_delta: number }>,
      special_instructions: item.special_instructions || "",
      line_total: item.unit_price * item.quantity,
    }));

    // Create the order via the db package
    const orderId = await createOrder({
      customer_id: customer.id,
      restaurant_id,
      delivery_address_id: address.id,
      items: cartItems,
      tip: tip || 0,
      notes: notes || undefined,
    });

    return NextResponse.json({ id: orderId });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
