// Database types - manually defined to match Supabase schema
// Replace with `supabase gen types typescript` once Supabase project is set up

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          email: string | null;
          phone: string;
          full_name: string | null;
          is_guest: boolean;
          default_address_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          street: string;
          unit: string | null;
          city: string;
          state: string;
          zip: string;
          lat: number;
          lng: number;
          label: string | null;
          is_within_zone: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["addresses"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };
      restaurants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          cuisine_tags: string[];
          address: string;
          city: string;
          state: string;
          zip: string;
          phone: string;
          lat: number;
          lng: number;
          rating: number;
          review_count: number;
          price_range: string;
          is_active: boolean;
          default_prep_time_min: number;
          stripe_account_id: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["restaurants"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Insert"]>;
      };
      restaurant_hours: {
        Row: {
          id: string;
          restaurant_id: string;
          day_of_week: number;
          open_time: string;
          close_time: string;
          closes_next_day: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["restaurant_hours"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["restaurant_hours"]["Insert"]>;
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_available: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["menu_categories"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["menu_categories"]["Insert"]>;
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["menu_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Insert"]>;
      };
      modifier_groups: {
        Row: {
          id: string;
          menu_item_id: string;
          name: string;
          is_required: boolean;
          min_selections: number;
          max_selections: number;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["modifier_groups"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["modifier_groups"]["Insert"]>;
      };
      modifier_options: {
        Row: {
          id: string;
          modifier_group_id: string;
          name: string;
          price_delta: number;
          is_available: boolean;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["modifier_options"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["modifier_options"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          restaurant_id: string;
          status: string;
          delivery_address_id: string;
          subtotal: number;
          delivery_fee: number;
          tip: number;
          total: number;
          stripe_payment_intent_id: string | null;
          onfleet_task_id: string | null;
          estimated_delivery_at: string | null;
          placed_at: string;
          delivered_at: string | null;
          notes: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "placed_at"> & {
          id?: string;
          placed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          item_name: string;
          quantity: number;
          unit_price: number;
          modifiers: unknown;
          special_instructions: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      delivery_zones: {
        Row: {
          id: string;
          name: string;
          polygon: unknown;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["delivery_zones"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["delivery_zones"]["Insert"]>;
      };
    };
  };
}
