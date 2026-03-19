"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createBrowserClient } from "@rwc/db";
import type { OrderWithItems, OrderStatus } from "@rwc/shared";
import { isActive } from "@rwc/shared";

interface UseRealtimeOrdersOptions {
  restaurantId: string;
  onNewOrder?: () => void;
}

export function useRealtimeOrders({
  restaurantId,
  onNewOrder,
}: UseRealtimeOrdersOptions) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseRef = useRef(createBrowserClient());

  // Fetch full order by ID (Realtime INSERT only gives us the row, not joined data)
  const fetchFullOrder = useCallback(
    async (orderId: string): Promise<OrderWithItems | null> => {
      const res = await fetch(`/api/orders?id=${orderId}`);
      if (!res.ok) return null;
      return res.json();
    },
    []
  );

  // Initial load
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch(`/api/orders?restaurant_id=${restaurantId}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [restaurantId]);

  // Realtime subscription
  useEffect(() => {
    const supabase = supabaseRef.current;

    // When restaurantId is "all" (demo mode), subscribe to all orders
    const isAll = restaurantId === "all";
    const insertFilter = isAll ? undefined : `restaurant_id=eq.${restaurantId}`;

    const channel = supabase
      .channel(`restaurant-orders-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          ...(insertFilter ? { filter: insertFilter } : {}),
        },
        async (payload) => {
          // Fetch the full order with items
          const fullOrder = await fetchFullOrder(payload.new.id);
          if (fullOrder) {
            setOrders((prev) => [fullOrder, ...prev]);
            onNewOrder?.();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          ...(insertFilter ? { filter: insertFilter } : {}),
        },
        (payload) => {
          const updated = payload.new as any;
          setOrders((prev) =>
            prev.map((o) =>
              o.id === updated.id ? { ...o, ...updated } : o
            )
          );
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, fetchFullOrder, onNewOrder]);

  return { orders, isConnected, isLoading };
}
