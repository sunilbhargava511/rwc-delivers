"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createBrowserClient } from "@rwc/db";
import type { OrderWithItems, OrderStatus } from "@rwc/shared";

interface UseRealtimeOrdersOptions {
  restaurantId: string;
  onNewOrder?: () => void;
  /** Poll interval in ms when Realtime is not connected (default: 5000) */
  pollInterval?: number;
}

export function useRealtimeOrders({
  restaurantId,
  onNewOrder,
  pollInterval = 5000,
}: UseRealtimeOrdersOptions) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseRef = useRef(createBrowserClient());
  const prevOrderIdsRef = useRef<Set<string>>(new Set());

  // Fetch full order by ID (Realtime INSERT only gives us the row, not joined data)
  const fetchFullOrder = useCallback(
    async (orderId: string): Promise<OrderWithItems | null> => {
      const res = await fetch(`/api/orders?id=${orderId}`);
      if (!res.ok) return null;
      return res.json();
    },
    []
  );

  // Fetch all orders from API
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?restaurant_id=${restaurantId}`);
      if (res.ok) {
        const data: OrderWithItems[] = await res.json();
        // Check for new orders (for chime)
        const newIds = new Set(data.map((o) => o.id));
        if (prevOrderIdsRef.current.size > 0) {
          for (const id of newIds) {
            if (!prevOrderIdsRef.current.has(id)) {
              onNewOrder?.();
              break;
            }
          }
        }
        prevOrderIdsRef.current = newIds;
        setOrders(data);
        return data;
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
    return null;
  }, [restaurantId, onNewOrder]);

  // Initial load
  useEffect(() => {
    fetchOrders().finally(() => setIsLoading(false));
  }, [fetchOrders]);

  // Polling fallback when Realtime is not connected
  useEffect(() => {
    if (isConnected) return; // Realtime is working, no need to poll
    if (isLoading) return; // Don't poll during initial load

    const interval = setInterval(() => {
      fetchOrders();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [isConnected, isLoading, fetchOrders, pollInterval]);

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
            setOrders((prev) => {
              // Avoid duplicates
              if (prev.some((o) => o.id === fullOrder.id)) return prev;
              return [fullOrder, ...prev];
            });
            prevOrderIdsRef.current.add(fullOrder.id);
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

  // Optimistic update: update an order locally without waiting for Realtime
  const updateOrderLocally = useCallback(
    (orderId: string, updates: Partial<OrderWithItems>) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
      );
    },
    []
  );

  return { orders, isConnected, isLoading, updateOrderLocally };
}
