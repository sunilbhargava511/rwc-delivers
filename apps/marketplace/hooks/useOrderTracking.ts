"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@rwc/db";
import type { OrderWithItems, OrderStatus } from "@rwc/shared";

interface DriverLocation {
  lat: number;
  lng: number;
}

const POLL_INTERVAL = 3000; // 3 seconds

export function useOrderTracking(orderId: string, initialOrder: OrderWithItems) {
  const [order, setOrder] = useState<OrderWithItems>(initialOrder);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(
    initialOrder.delivery_assignment?.driver_lat &&
      initialOrder.delivery_assignment?.driver_lng
      ? {
          lat: initialOrder.delivery_assignment.driver_lat,
          lng: initialOrder.delivery_assignment.driver_lng,
        }
      : null
  );
  const [isConnected, setIsConnected] = useState(false);
  const supabaseRef = useRef(createBrowserClient());
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Polling fallback — always runs to guarantee updates
  const pollOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?id=${orderId}`);
      if (!res.ok) return;
      const data: OrderWithItems = await res.json();

      setOrder((prev) => {
        // Only update if status actually changed
        if (data.status !== prev.status || JSON.stringify(data.delivery_assignment) !== JSON.stringify(prev.delivery_assignment)) {
          return data;
        }
        return prev;
      });

      // Update driver location if available
      if (data.delivery_assignment?.driver_lat && data.delivery_assignment?.driver_lng) {
        setDriverLocation({
          lat: data.delivery_assignment.driver_lat,
          lng: data.delivery_assignment.driver_lng,
        });
      }
    } catch {
      // silently ignore poll errors
    }
  }, [orderId]);

  useEffect(() => {
    const supabase = supabaseRef.current;

    // Start Realtime subscription
    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          setOrder((prev) => ({ ...prev, ...updated }));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "delivery_assignments",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const data = payload.new as any;
          if (data.driver_lat != null && data.driver_lng != null) {
            setDriverLocation({ lat: data.driver_lat, lng: data.driver_lng });
          }
          setOrder((prev) => ({
            ...prev,
            delivery_assignment: { ...prev.delivery_assignment, ...data },
          }));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    // Always poll as fallback (Realtime can be unreliable on Railway)
    pollRef.current = setInterval(pollOrder, POLL_INTERVAL);

    return () => {
      supabase.removeChannel(channel);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, pollOrder]);

  return { order, driverLocation, isConnected };
}
