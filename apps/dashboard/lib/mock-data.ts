import type {
  RestaurantWithStatus,
  RestaurantHours,
  OrderWithItems,
  OrderItem,
  MenuCategoryWithItems,
  Restaurant,
  OrderStatus,
} from "@rwc/shared";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TODAY = "2026-03-18";

function todayAt(hours: number, minutes = 0): string {
  const d = new Date(`${TODAY}T00:00:00`);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function daysAgo(n: number): string {
  const d = new Date(`${TODAY}T12:00:00`);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// 1. CURRENT_RESTAURANT
// ---------------------------------------------------------------------------

const laVigaHours: RestaurantHours[] = [0, 1, 2, 3, 4, 5, 6].map((d) => ({
  id: `hours-${d}`,
  restaurant_id: "r1",
  day_of_week: d,
  open_time: "11:00",
  close_time: "21:00",
  closes_next_day: false,
}));

const laVigaBase: Restaurant = {
  id: "r1",
  slug: "la-viga",
  name: "La Viga Seafood & Cocina Mexicana",
  description:
    "Named after La Viga, Mexico City's massive seafood market. Coastal Mexican flavors with modern California touches.",
  cuisine_tags: ["Mexican", "Seafood"],
  address: "1772 Broadway",
  city: "Redwood City",
  state: "CA",
  zip: "94063",
  phone: "(650) 679-8141",
  lat: 37.4863,
  lng: -122.2275,
  rating: 4.2,
  review_count: 2008,
  price_range: "$$",
  is_active: true,
  default_prep_time_min: 30,
  stripe_account_id: null,
  image_url: null,
  created_at: "2025-06-01T00:00:00Z",
};

export const CURRENT_RESTAURANT: RestaurantWithStatus = {
  ...laVigaBase,
  is_open: true,
  hours: laVigaHours,
};

// ---------------------------------------------------------------------------
// 2. getMockOrders()
// ---------------------------------------------------------------------------

interface OrderInput {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  placed_at: string;
  subtotal: number;
  delivery_fee: number;
  tip: number;
  items: OrderItem[];
  notes: string | null;
  delivered_at?: string;
  estimated_delivery_at?: string;
  delivery_assignment?: OrderWithItems["delivery_assignment"];
}

function makeOrder(input: OrderInput): OrderWithItems {
  return {
    id: input.id,
    order_number: input.order_number,
    customer_id: input.customer_id,
    restaurant_id: "r1",
    status: input.status,
    delivery_address_id: `addr-${input.customer_id}`,
    subtotal: input.subtotal,
    delivery_fee: input.delivery_fee,
    tip: input.tip,
    total: input.subtotal + input.delivery_fee + input.tip,
    stripe_payment_intent_id: `pi_mock_${input.id}`,
    onfleet_task_id: null,
    estimated_delivery_at: input.estimated_delivery_at ?? null,
    placed_at: input.placed_at,
    delivered_at: input.delivered_at ?? null,
    notes: input.notes,
    items: input.items,
    restaurant: laVigaBase,
    delivery_assignment: input.delivery_assignment ?? null,
  };
}

function makeItem(
  id: string,
  orderId: string,
  menuItemId: string,
  name: string,
  quantity: number,
  unitPrice: number,
  modifiers?: { group_name: string; option_name: string; price_delta: number }[],
  specialInstructions?: string,
): OrderItem {
  return {
    id,
    order_id: orderId,
    menu_item_id: menuItemId,
    item_name: name,
    quantity,
    unit_price: unitPrice,
    modifiers: modifiers ?? null,
    special_instructions: specialInstructions ?? null,
  };
}

export function getMockOrders(): OrderWithItems[] {
  return [
    // ---- 2 x placed (new, waiting to be accepted) ----
    makeOrder({
      id: "ord-001",
      order_number: "RWC-20260318-0001",
      customer_id: "c1",
      status: "placed",
      placed_at: todayAt(11, 42),
      subtotal: 4700,
      delivery_fee: 499,
      tip: 700,
      items: [
        makeItem("oi-001", "ord-001", "i1", "Guacamole", 1, 800),
        makeItem("oi-002", "ord-001", "i4", "Tacos (3)", 2, 1500, [
          { group_name: "Choose Protein", option_name: "Asada", price_delta: 0 },
        ]),
        makeItem("oi-003", "ord-001", "i5", "Veggie Enchiladas", 1, 1800),
      ],
      notes: "Extra salsa on the side please",
    }),
    makeOrder({
      id: "ord-002",
      order_number: "RWC-20260318-0002",
      customer_id: "c2",
      status: "placed",
      placed_at: todayAt(11, 48),
      subtotal: 7400,
      delivery_fee: 499,
      tip: 1000,
      items: [
        makeItem("oi-004", "ord-002", "i2", "Sampler Platter", 1, 1900),
        makeItem("oi-005", "ord-002", "i9", "Grilled Skirt Steak", 1, 3000),
        makeItem("oi-006", "ord-002", "i1", "Guacamole", 1, 800),
        makeItem("oi-007", "ord-002", "i4", "Tacos (3)", 1, 1700, [
          { group_name: "Choose Protein", option_name: "Camaron", price_delta: 200 },
        ]),
      ],
      notes: null,
    }),

    // ---- 1 confirmed, 1 preparing ----
    makeOrder({
      id: "ord-003",
      order_number: "RWC-20260318-0003",
      customer_id: "c3",
      status: "confirmed",
      placed_at: todayAt(11, 25),
      subtotal: 3300,
      delivery_fee: 499,
      tip: 500,
      items: [
        makeItem("oi-008", "ord-003", "i4", "Tacos (3)", 1, 1500, [
          { group_name: "Choose Protein", option_name: "Pollo", price_delta: 0 },
        ]),
        makeItem("oi-009", "ord-003", "i5", "Veggie Enchiladas", 1, 1800),
      ],
      notes: "No onions",
    }),
    makeOrder({
      id: "ord-004",
      order_number: "RWC-20260318-0004",
      customer_id: "c4",
      status: "preparing",
      placed_at: todayAt(11, 15),
      subtotal: 6400,
      delivery_fee: 499,
      tip: 800,
      items: [
        makeItem("oi-010", "ord-004", "i10", "Blackened Atlantic Salmon", 1, 2900),
        makeItem("oi-011", "ord-004", "i7", "Shrimp Enchiladas", 1, 2700),
        makeItem("oi-012", "ord-004", "i1", "Guacamole", 1, 800),
      ],
      notes: null,
    }),

    // ---- 1 ready_for_pickup ----
    makeOrder({
      id: "ord-005",
      order_number: "RWC-20260318-0005",
      customer_id: "c5",
      status: "ready_for_pickup",
      placed_at: todayAt(11, 2),
      subtotal: 6000,
      delivery_fee: 499,
      tip: 900,
      items: [
        makeItem("oi-013", "ord-005", "i9", "Grilled Skirt Steak", 2, 3000),
      ],
      notes: "Ring doorbell twice",
    }),

    // ---- 1 en_route (driver assigned) ----
    makeOrder({
      id: "ord-006",
      order_number: "RWC-20260318-0006",
      customer_id: "c6",
      status: "en_route",
      placed_at: todayAt(10, 45),
      subtotal: 4400,
      delivery_fee: 499,
      tip: 600,
      estimated_delivery_at: todayAt(11, 55),
      delivery_assignment: {
        id: "da-001",
        order_id: "ord-006",
        driver_id: "d1",
        onfleet_task_id: null,
        assigned_at: todayAt(11, 18),
        picked_up_at: todayAt(11, 30),
        delivered_at: null,
        driver_lat: 37.485,
        driver_lng: -122.229,
      },
      items: [
        makeItem("oi-014", "ord-006", "i4", "Tacos (3)", 2, 1900, [
          { group_name: "Choose Protein", option_name: "Salmon", price_delta: 400 },
        ]),
        makeItem("oi-015", "ord-006", "i3", "Sauteed Octopus", 1, 1200),
      ],
      notes: null,
    }),

    // ---- 2 delivered (completed today) ----
    makeOrder({
      id: "ord-007",
      order_number: "RWC-20260318-0007",
      customer_id: "c1",
      status: "delivered",
      placed_at: todayAt(9, 30),
      delivered_at: todayAt(10, 15),
      subtotal: 2300,
      delivery_fee: 499,
      tip: 400,
      items: [
        makeItem("oi-016", "ord-007", "i1", "Guacamole", 1, 800),
        makeItem("oi-017", "ord-007", "i4", "Tacos (3)", 1, 1500, [
          { group_name: "Choose Protein", option_name: "Cochinita", price_delta: 0 },
        ]),
      ],
      notes: null,
    }),
    makeOrder({
      id: "ord-008",
      order_number: "RWC-20260318-0008",
      customer_id: "c3",
      status: "delivered",
      placed_at: todayAt(9, 0),
      delivered_at: todayAt(9, 50),
      subtotal: 4900,
      delivery_fee: 499,
      tip: 750,
      items: [
        makeItem("oi-018", "ord-008", "i2", "Sampler Platter", 1, 1900),
        makeItem("oi-019", "ord-008", "i11", "Grilled Wild Mahi-Mahi", 1, 3000),
      ],
      notes: "Leave at door",
    }),
  ];
}

// ---------------------------------------------------------------------------
// 3. getMockMenu()
// ---------------------------------------------------------------------------

export function getMockMenu(): MenuCategoryWithItems[] {
  return [
    {
      id: "cat1",
      restaurant_id: "r1",
      name: "Appetizers",
      description: null,
      sort_order: 0,
      is_available: true,
      items: [
        {
          id: "i1",
          restaurant_id: "r1",
          category_id: "cat1",
          name: "Guacamole",
          description:
            "Ripe avocado, onions, cilantro, serrano, tomato, lime juice, queso fresco, totopos & chile de arbol sauce",
          price: 800,
          image_url: null,
          is_available: true,
          sort_order: 0,
          modifier_groups: [],
        },
        {
          id: "i2",
          restaurant_id: "r1",
          category_id: "cat1",
          name: "Sampler Platter",
          description:
            "Empanada de mariscos, crispy coconut prawn, side of fried calamari",
          price: 1900,
          image_url: null,
          is_available: true,
          sort_order: 1,
          modifier_groups: [],
        },
        {
          id: "i3",
          restaurant_id: "r1",
          category_id: "cat1",
          name: "Sauteed Octopus",
          description:
            "Octopus, calamari, chorizo, fennel with chile arbol sauce, served over toasted bread and black bean spread",
          price: 1200,
          image_url: null,
          is_available: true,
          sort_order: 2,
          modifier_groups: [],
        },
      ],
    },
    {
      id: "cat2",
      restaurant_id: "r1",
      name: "Tacos",
      description: null,
      sort_order: 1,
      is_available: true,
      items: [
        {
          id: "i4",
          restaurant_id: "r1",
          category_id: "cat2",
          name: "Tacos (3)",
          description: "Homemade corn tortillas with your choice of protein",
          price: 1500,
          image_url: null,
          is_available: true,
          sort_order: 0,
          modifier_groups: [
            {
              id: "mg1",
              menu_item_id: "i4",
              name: "Choose Protein",
              is_required: true,
              min_selections: 1,
              max_selections: 1,
              sort_order: 0,
              options: [
                { id: "mo1", modifier_group_id: "mg1", name: "Asada", price_delta: 0, is_available: true, sort_order: 0 },
                { id: "mo2", modifier_group_id: "mg1", name: "Cochinita", price_delta: 0, is_available: true, sort_order: 1 },
                { id: "mo3", modifier_group_id: "mg1", name: "Pollo", price_delta: 0, is_available: true, sort_order: 2 },
                { id: "mo4", modifier_group_id: "mg1", name: "Camaron", price_delta: 200, is_available: true, sort_order: 3 },
                { id: "mo5", modifier_group_id: "mg1", name: "Pescado", price_delta: 200, is_available: true, sort_order: 4 },
                { id: "mo6", modifier_group_id: "mg1", name: "Salmon", price_delta: 400, is_available: true, sort_order: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "cat3",
      restaurant_id: "r1",
      name: "Enchiladas",
      description: null,
      sort_order: 2,
      is_available: true,
      items: [
        {
          id: "i5",
          restaurant_id: "r1",
          category_id: "cat3",
          name: "Veggie Enchiladas",
          description:
            "2 homemade tortillas, guajillo enchilada sauce, queso fresco, cream, cheese, rice & black bean puree",
          price: 1800,
          image_url: null,
          is_available: true,
          sort_order: 0,
          modifier_groups: [],
        },
        {
          id: "i6",
          restaurant_id: "r1",
          category_id: "cat3",
          name: "Steak Enchiladas",
          description: "Same preparation with steak",
          price: 2500,
          image_url: null,
          is_available: true,
          sort_order: 1,
          modifier_groups: [],
        },
        {
          id: "i7",
          restaurant_id: "r1",
          category_id: "cat3",
          name: "Shrimp Enchiladas",
          description: "Same preparation with shrimp",
          price: 2700,
          image_url: null,
          is_available: true,
          sort_order: 2,
          modifier_groups: [],
        },
        {
          id: "i8",
          restaurant_id: "r1",
          category_id: "cat3",
          name: "Seafood Enchiladas",
          description: "Same preparation with mixed seafood",
          price: 2900,
          image_url: null,
          is_available: true,
          sort_order: 3,
          modifier_groups: [],
        },
      ],
    },
    {
      id: "cat4",
      restaurant_id: "r1",
      name: "Entrees",
      description: null,
      sort_order: 3,
      is_available: true,
      items: [
        {
          id: "i9",
          restaurant_id: "r1",
          category_id: "cat4",
          name: "Grilled Skirt Steak",
          description:
            "With poblano garlic mashed potatoes, brussels sprouts, chimichurri sauce",
          price: 3000,
          image_url: null,
          is_available: true,
          sort_order: 0,
          modifier_groups: [],
        },
        {
          id: "i10",
          restaurant_id: "r1",
          category_id: "cat4",
          name: "Blackened Atlantic Salmon",
          description: "Salmon filet with butternut squash",
          price: 2900,
          image_url: null,
          is_available: true,
          sort_order: 1,
          modifier_groups: [],
        },
        {
          id: "i11",
          restaurant_id: "r1",
          category_id: "cat4",
          name: "Grilled Wild Mahi-Mahi",
          description: "Mahi-mahi fillet",
          price: 3000,
          image_url: null,
          is_available: true,
          sort_order: 2,
          modifier_groups: [],
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// 4. getMockEarnings()
// ---------------------------------------------------------------------------

export function getMockEarnings() {
  return {
    today: {
      orders: 8,
      revenue: 37300, // $373.00
      tips: 4650, // $46.50
    },
    thisWeek: {
      orders: 47,
      revenue: 211500, // $2,115.00
      tips: 28200, // $282.00
    },
    thisMonth: {
      orders: 189,
      revenue: 853200, // $8,532.00
      tips: 112500, // $1,125.00
    },
    dailyData: Array.from({ length: 14 }, (_, i) => {
      const dayOffset = 13 - i;
      const dateStr = daysAgo(dayOffset);
      const dayOfWeek = new Date(`${dateStr}T12:00:00`).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseOrders = isWeekend ? 18 : 12;
      const orders = baseOrders + Math.floor(Math.abs(Math.sin(i * 3.7)) * 6);
      const avgTicket = 4500; // $45 average
      return {
        date: dateStr,
        orders,
        revenue: orders * avgTicket,
      };
    }),
    topItems: [
      { name: "Tacos (3)", quantity: 87, revenue: 87 * 1500 },
      { name: "Guacamole", quantity: 64, revenue: 64 * 800 },
      { name: "Grilled Skirt Steak", quantity: 42, revenue: 42 * 3000 },
      { name: "Shrimp Enchiladas", quantity: 38, revenue: 38 * 2700 },
      { name: "Sampler Platter", quantity: 31, revenue: 31 * 1900 },
    ],
    doordashComparison: {
      rwcFees: 85320, // ~10% platform fee on $8,532 monthly revenue
      doordashFees: 255960, // 30% of same revenue
      saved: 170640, // ~$1,706.40 saved per month
    },
  };
}

// ---------------------------------------------------------------------------
// 5. getMockCustomers()
// ---------------------------------------------------------------------------

export function getMockCustomers() {
  return [
    {
      id: "c1",
      name: "Maria Santos",
      email: "maria.santos@gmail.com",
      phone: "(650) 555-0101",
      orderCount: 12,
      totalSpent: 54800,
      lastOrderDate: TODAY,
    },
    {
      id: "c2",
      name: "David Chen",
      email: "david.chen@outlook.com",
      phone: "(650) 555-0102",
      orderCount: 8,
      totalSpent: 38200,
      lastOrderDate: TODAY,
    },
    {
      id: "c3",
      name: "Sarah Johnson",
      email: "sarah.j@yahoo.com",
      phone: "(650) 555-0103",
      orderCount: 15,
      totalSpent: 72500,
      lastOrderDate: TODAY,
    },
    {
      id: "c4",
      name: "James Park",
      email: "jpark92@gmail.com",
      phone: "(650) 555-0104",
      orderCount: 5,
      totalSpent: 24100,
      lastOrderDate: daysAgo(2),
    },
    {
      id: "c5",
      name: "Elena Rodriguez",
      email: "elena.r@icloud.com",
      phone: "(650) 555-0105",
      orderCount: 22,
      totalSpent: 98700,
      lastOrderDate: TODAY,
    },
    {
      id: "c6",
      name: "Kevin Nguyen",
      email: "kevin.nguyen@gmail.com",
      phone: "(650) 555-0106",
      orderCount: 3,
      totalSpent: 13500,
      lastOrderDate: daysAgo(5),
    },
  ];
}
