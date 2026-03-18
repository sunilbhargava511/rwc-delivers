"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, SelectedModifier } from "@rwc/shared";
import { DELIVERY_FEE, TIP_DEFAULTS } from "@rwc/shared";

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string;
  restaurantSlug: string;
  tip: number;
  isOpen: boolean;

  addItem: (item: Omit<CartItem, "id" | "line_total">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (id: string, name: string, slug: string) => void;
  setTip: (amount: number) => void;
  toggleCart: () => void;
  closeCart: () => void;

  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

function computeLineTotal(item: Omit<CartItem, "id" | "line_total">): number {
  const modifierTotal = (item.modifiers || []).reduce(
    (sum, m) => sum + m.price_delta,
    0
  );
  return (item.unit_price + modifierTotal) * item.quantity;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: "",
      restaurantSlug: "",
      tip: TIP_DEFAULTS[1], // $5 default
      isOpen: false,

      addItem: (item) => {
        const id = crypto.randomUUID();
        const lineTotal = computeLineTotal(item);
        set((state) => ({
          items: [...state.items, { ...item, id, line_total: lineTotal }],
          isOpen: true,
        }));
      },

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          return {
            items: newItems,
            ...(newItems.length === 0
              ? { restaurantId: null, restaurantName: "", restaurantSlug: "" }
              : {}),
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((i) => i.id !== id);
            return {
              items: newItems,
              ...(newItems.length === 0
                ? { restaurantId: null, restaurantName: "", restaurantSlug: "" }
                : {}),
            };
          }
          return {
            items: state.items.map((i) =>
              i.id === id
                ? {
                    ...i,
                    quantity,
                    line_total:
                      (i.unit_price +
                        (i.modifiers || []).reduce(
                          (s, m) => s + m.price_delta,
                          0
                        )) *
                      quantity,
                  }
                : i
            ),
          };
        }),

      clearCart: () =>
        set({
          items: [],
          restaurantId: null,
          restaurantName: "",
          restaurantSlug: "",
          tip: TIP_DEFAULTS[1],
        }),

      setRestaurant: (id, name, slug) =>
        set({ restaurantId: id, restaurantName: name, restaurantSlug: slug }),

      setTip: (amount) => set({ tip: amount }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.line_total, 0),

      getDeliveryFee: () => (get().items.length > 0 ? DELIVERY_FEE : 0),

      getTotal: () => {
        const state = get();
        return state.getSubtotal() + state.getDeliveryFee() + state.tip;
      },
    }),
    {
      name: "rwc-cart",
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        restaurantSlug: state.restaurantSlug,
        tip: state.tip,
      }),
    }
  )
);
