"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@rwc/db";
import type { OrderWithItems, OrderStatus } from "@rwc/shared";

interface DriverLocation {
  lat: number;
  lng: number;
}

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

  useEffect(() => {
    const supabase = supabaseRef.current;

    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      // Listen for order status changes
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
      // Listen for delivery assignment changes (driver location)
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
          // Update the delivery_assignment on the order
          setOrder((prev) => ({
            ...prev,
            delivery_assignment: { ...prev.delivery_assignment, ...data },
          }));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { order, driverLocation, isConnected };
}
