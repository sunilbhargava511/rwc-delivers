"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@rwc/db";
import type { OrderStatus } from "@rwc/shared";
import { isActive } from "@rwc/shared";

interface LiveOrder {
  id: string;
  order_number: string;
  restaurant_id: string;
  status: OrderStatus;
  total: number;
  placed_at: string;
  estimated_delivery_at: string | null;
}

interface LiveAssignment {
  id: string;
  order_id: string;
  driver_id: string;
  driver_lat: number | null;
  driver_lng: number | null;
  assigned_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
}

export function useRealtimeDeliveries() {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [assignments, setAssignments] = useState<LiveAssignment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const supabaseRef = useRef(createBrowserClient());

  // Initial load
  useEffect(() => {
    const supabase = supabaseRef.current;

    async function load() {
      const { data: activeOrders } = await supabase
        .from("orders")
        .select("id, order_number, restaurant_id, status, total, placed_at, estimated_delivery_at")
        .in("status", [
          "placed",
          "confirmed",
          "preparing",
          "ready_for_pickup",
          "driver_assigned",
          "en_route",
        ])
        .order("placed_at", { ascending: false });

      if (activeOrders) {
        setOrders(activeOrders as LiveOrder[]);

        const orderIds = activeOrders.map((o) => o.id);
        if (orderIds.length > 0) {
          const { data: activeAssignments } = await supabase
            .from("delivery_assignments")
            .select("id, order_id, driver_id, driver_lat, driver_lng, assigned_at, picked_up_at, delivered_at")
            .in("order_id", orderIds);

          if (activeAssignments) {
            setAssignments(activeAssignments as LiveAssignment[]);
          }
        }
      }
    }

    load();
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    const supabase = supabaseRef.current;

    const channel = supabase
      .channel("dispatch-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const data = payload.new as any;
          if (payload.eventType === "INSERT") {
            if (isActive(data.status)) {
              setOrders((prev) => [data as LiveOrder, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            if (!isActive(data.status)) {
              // Remove completed/cancelled orders
              setOrders((prev) => prev.filter((o) => o.id !== data.id));
            } else {
              setOrders((prev) =>
                prev.map((o) => (o.id === data.id ? { ...o, ...data } : o))
              );
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "delivery_assignments" },
        (payload) => {
          const data = payload.new as any;
          if (payload.eventType === "INSERT") {
            setAssignments((prev) => [...prev, data as LiveAssignment]);
          } else if (payload.eventType === "UPDATE") {
            setAssignments((prev) =>
              prev.map((a) => (a.id === data.id ? { ...a, ...data } : a))
            );
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders, assignments, isConnected };
}
