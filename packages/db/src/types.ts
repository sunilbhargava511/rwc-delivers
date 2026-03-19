export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          customer_id: string
          id: string
          is_within_zone: boolean
          label: string | null
          lat: number
          lng: number
          state: string
          street: string
          unit: string | null
          zip: string
        }
        Insert: {
          city?: string
          customer_id: string
          id?: string
          is_within_zone?: boolean
          label?: string | null
          lat: number
          lng: number
          state?: string
          street: string
          unit?: string | null
          zip: string
        }
        Update: {
          city?: string
          customer_id?: string
          id?: string
          is_within_zone?: boolean
          label?: string | null
          lat?: number
          lng?: number
          state?: string
          street?: string
          unit?: string | null
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          default_address_id: string | null
          email: string | null
          full_name: string | null
          id: string
          is_guest: boolean
          phone: string
        }
        Insert: {
          created_at?: string
          default_address_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_guest?: boolean
          phone: string
        }
        Update: {
          created_at?: string
          default_address_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_guest?: boolean
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_default_address"
            columns: ["default_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_assignments: {
        Row: {
          assigned_at: string
          delivered_at: string | null
          driver_id: string
          driver_lat: number | null
          driver_lng: number | null
          id: string
          shipday_order_id: string | null
          order_id: string
          picked_up_at: string | null
        }
        Insert: {
          assigned_at?: string
          delivered_at?: string | null
          driver_id: string
          driver_lat?: number | null
          driver_lng?: number | null
          id?: string
          shipday_order_id?: string | null
          order_id: string
          picked_up_at?: string | null
        }
        Update: {
          assigned_at?: string
          delivered_at?: string | null
          driver_id?: string
          driver_lat?: number | null
          driver_lng?: number | null
          id?: string
          shipday_order_id?: string | null
          order_id?: string
          picked_up_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          polygon: Json
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          polygon: Json
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          polygon?: Json
        }
        Relationships: []
      }
      dispatch_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          order_id: string | null
          payload: Json | null
          source: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          source: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_shifts: {
        Row: {
          driver_id: string
          end_time: string
          id: string
          shift_date: string
          start_time: string
        }
        Insert: {
          driver_id: string
          end_time: string
          id?: string
          shift_date: string
          start_time: string
        }
        Update: {
          driver_id?: string
          end_time?: string
          id?: string
          shift_date?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_shifts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          shipday_driver_id: string | null
          phone: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          shipday_driver_id?: string | null
          phone: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          shipday_driver_id?: string | null
          phone?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          description: string | null
          id: string
          is_available: boolean
          name: string
          restaurant_id: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          id?: string
          is_available?: boolean
          name: string
          restaurant_id: string
          sort_order?: number
        }
        Update: {
          description?: string | null
          id?: string
          is_available?: boolean
          name?: string
          restaurant_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category_id: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          price: number
          restaurant_id: string
          sort_order: number
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          price: number
          restaurant_id: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          price?: number
          restaurant_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      modifier_groups: {
        Row: {
          id: string
          is_required: boolean
          max_selections: number
          menu_item_id: string
          min_selections: number
          name: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_required?: boolean
          max_selections?: number
          menu_item_id: string
          min_selections?: number
          name: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_required?: boolean
          max_selections?: number
          menu_item_id?: string
          min_selections?: number
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "modifier_groups_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      modifier_options: {
        Row: {
          id: string
          is_available: boolean
          modifier_group_id: string
          name: string
          price_delta: number
          sort_order: number
        }
        Insert: {
          id?: string
          is_available?: boolean
          modifier_group_id: string
          name: string
          price_delta?: number
          sort_order?: number
        }
        Update: {
          id?: string
          is_available?: boolean
          modifier_group_id?: string
          name?: string
          price_delta?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "modifier_options_modifier_group_id_fkey"
            columns: ["modifier_group_id"]
            isOneToOne: false
            referencedRelation: "modifier_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          item_name: string
          menu_item_id: string
          modifiers: Json | null
          order_id: string
          quantity: number
          special_instructions: string | null
          unit_price: number
        }
        Insert: {
          id?: string
          item_name: string
          menu_item_id: string
          modifiers?: Json | null
          order_id: string
          quantity?: number
          special_instructions?: string | null
          unit_price: number
        }
        Update: {
          id?: string
          item_name?: string
          menu_item_id?: string
          modifiers?: Json | null
          order_id?: string
          quantity?: number
          special_instructions?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          customer_id: string
          delivered_at: string | null
          delivery_address_id: string
          delivery_fee: number
          estimated_delivery_at: string | null
          id: string
          notes: string | null
          shipday_order_id: string | null
          order_number: string
          placed_at: string
          restaurant_id: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent_id: string | null
          subtotal: number
          tip: number
          total: number
        }
        Insert: {
          customer_id: string
          delivered_at?: string | null
          delivery_address_id: string
          delivery_fee: number
          estimated_delivery_at?: string | null
          id?: string
          notes?: string | null
          shipday_order_id?: string | null
          order_number: string
          placed_at?: string
          restaurant_id: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent_id?: string | null
          subtotal: number
          tip?: number
          total: number
        }
        Update: {
          customer_id?: string
          delivered_at?: string | null
          delivery_address_id?: string
          delivery_fee?: number
          estimated_delivery_at?: string | null
          id?: string
          notes?: string | null
          shipday_order_id?: string | null
          order_number?: string
          placed_at?: string
          restaurant_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tip?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          delivery_fee: number
          id: string
          order_id: string
          status: Database["public"]["Enums"]["payment_status"]
          stripe_fee: number
          stripe_payment_intent_id: string
          tip: number
        }
        Insert: {
          amount: number
          created_at?: string
          delivery_fee: number
          id?: string
          order_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_fee?: number
          stripe_payment_intent_id: string
          tip: number
        }
        Update: {
          amount?: number
          created_at?: string
          delivery_fee?: number
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_fee?: number
          stripe_payment_intent_id?: string
          tip?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_closures: {
        Row: {
          end_date: string
          id: string
          reason: string | null
          restaurant_id: string
          start_date: string
        }
        Insert: {
          end_date: string
          id?: string
          reason?: string | null
          restaurant_id: string
          start_date: string
        }
        Update: {
          end_date?: string
          id?: string
          reason?: string | null
          restaurant_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_closures_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_hours: {
        Row: {
          close_time: string
          closes_next_day: boolean
          day_of_week: number
          id: string
          open_time: string
          restaurant_id: string
        }
        Insert: {
          close_time: string
          closes_next_day?: boolean
          day_of_week: number
          id?: string
          open_time: string
          restaurant_id: string
        }
        Update: {
          close_time?: string
          closes_next_day?: boolean
          day_of_week?: number
          id?: string
          open_time?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_hours_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_settlements: {
        Row: {
          created_at: string
          gross_food_sales: number
          id: string
          period_end: string
          period_start: string
          restaurant_id: string
          status: Database["public"]["Enums"]["settlement_status"]
          stripe_transfer_id: string | null
          total_orders: number
        }
        Insert: {
          created_at?: string
          gross_food_sales?: number
          id?: string
          period_end: string
          period_start: string
          restaurant_id: string
          status?: Database["public"]["Enums"]["settlement_status"]
          stripe_transfer_id?: string | null
          total_orders?: number
        }
        Update: {
          created_at?: string
          gross_food_sales?: number
          id?: string
          period_end?: string
          period_start?: string
          restaurant_id?: string
          status?: Database["public"]["Enums"]["settlement_status"]
          stripe_transfer_id?: string | null
          total_orders?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_settlements_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_staff: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          restaurant_id: string
          role: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          restaurant_id: string
          role?: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          restaurant_id?: string
          role?: Database["public"]["Enums"]["staff_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_staff_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string
          city: string
          created_at: string
          cuisine_tags: string[]
          default_prep_time_min: number
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          lat: number
          lng: number
          name: string
          phone: string
          price_range: string
          rating: number
          review_count: number
          slug: string
          state: string
          stripe_account_id: string | null
          zip: string
        }
        Insert: {
          address: string
          city?: string
          created_at?: string
          cuisine_tags?: string[]
          default_prep_time_min?: number
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          lat: number
          lng: number
          name: string
          phone: string
          price_range?: string
          rating?: number
          review_count?: number
          slug: string
          state?: string
          stripe_account_id?: string | null
          zip?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          cuisine_tags?: string[]
          default_prep_time_min?: number
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          lat?: number
          lng?: number
          name?: string
          phone?: string
          price_range?: string
          rating?: number
          review_count?: number
          slug?: string
          state?: string
          stripe_account_id?: string | null
          zip?: string
        }
        Relationships: []
      }
      subscription_invoices: {
        Row: {
          amount: number
          created_at: string
          id: string
          period_end: string
          period_start: string
          status: string
          stripe_invoice_id: string | null
          subscription_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          status: string
          stripe_invoice_id?: string | null
          subscription_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          restaurant_id: string
          status: string
          stripe_subscription_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          restaurant_id: string
          status?: string
          stripe_subscription_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          restaurant_id?: string
          status?: string
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      tip_records: {
        Row: {
          amount: number
          delivery_assignment_id: string
          driver_id: string
          id: string
          order_id: string
          paid_via_payroll: boolean
          shift_date: string
        }
        Insert: {
          amount: number
          delivery_assignment_id: string
          driver_id: string
          id?: string
          order_id: string
          paid_via_payroll?: boolean
          shift_date: string
        }
        Update: {
          amount?: number
          delivery_assignment_id?: string
          driver_id?: string
          id?: string
          order_id?: string
          paid_via_payroll?: boolean
          shift_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "tip_records_delivery_assignment_id_fkey"
            columns: ["delivery_assignment_id"]
            isOneToOne: false
            referencedRelation: "delivery_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tip_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tip_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      is_restaurant_open: {
        Args: { p_restaurant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "placed"
        | "confirmed"
        | "preparing"
        | "ready_for_pickup"
        | "driver_assigned"
        | "en_route"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "succeeded" | "failed" | "refunded"
      settlement_status: "pending" | "processing" | "paid"
      staff_role: "owner" | "manager" | "kitchen"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "placed",
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "driver_assigned",
        "en_route",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "succeeded", "failed", "refunded"],
      settlement_status: ["pending", "processing", "paid"],
      staff_role: ["owner", "manager", "kitchen"],
    },
  },
} as const
