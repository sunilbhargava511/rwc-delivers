"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { OrderWithItems, OrderStatus } from "@rwc/shared";
import { Badge } from "@rwc/ui";
import { OrderCard } from "../../components/OrderCard";
import { useRealtimeOrders } from "../../hooks/useRealtimeOrders";
import { useOrderChime } from "../../hooks/useOrderChime";

interface KanbanColumn {
  key: string;
  title: string;
  statuses: OrderStatus[];
  headerColor: string;
  dotColor: string;
}

const COLUMNS: KanbanColumn[] = [
  {
    key: "new",
    title: "New",
    statuses: ["placed"],
    headerColor: "bg-yellow-50 border-yellow-200",
    dotColor: "bg-yellow-400",
  },
  {
    key: "preparing",
    title: "Preparing",
    statuses: ["confirmed", "preparing"],
    headerColor: "bg-blue-50 border-blue-200",
    dotColor: "bg-blue-400",
  },
  {
    key: "ready",
    title: "Ready",
    statuses: ["ready_for_pickup"],
    headerColor: "bg-green-50 border-green-200",
    dotColor: "bg-green-400",
  },
  {
    key: "out",
    title: "Out for Delivery",
    statuses: ["driver_assigned", "en_route"],
    headerColor: "bg-purple-50 border-purple-200",
    dotColor: "bg-purple-400",
  },
];

export default function OrdersPage() {
  const [restaurantId, setRestaurantId] = useState<string>("all");
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [contextLoading, setContextLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/latest-restaurant")
      .then((res) => res.json())
      .then((data) => {
        if (data.restaurant_id) {
          setRestaurantId(data.restaurant_id);
          setRestaurantName(data.restaurant_name);
        }
      })
      .catch(() => {})
      .finally(() => setContextLoading(false));
  }, []);

  const { playChime } = useOrderChime();
  const onNewOrder = useCallback(() => {
    playChime();
  }, [playChime]);

  const {
    orders,
    isConnected,
    isLoading,
    updateOrderLocally,
  } = useRealtimeOrders({
    restaurantId,
    onNewOrder,
  });

  const columnOrders = useMemo(() => {
    const map: Record<string, OrderWithItems[]> = {};
    for (const col of COLUMNS) {
      map[col.key] = orders
        .filter((o) => col.statuses.includes(o.status))
        .sort(
          (a, b) =>
            new Date(a.placed_at).getTime() - new Date(b.placed_at).getTime()
        );
    }
    return map;
  }, [orders]);

  const activeCount = orders.filter(
    (o) =>
      o.status !== "delivered" &&
      o.status !== "cancelled"
  ).length;

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    // Optimistic update — move the card immediately
    updateOrderLocally(orderId, { status: newStatus });

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error("Status update failed:", data.error);
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  }

  function handleAccept(orderId: string) {
    handleStatusChange(orderId, "confirmed");
  }

  function handleReject(orderId: string) {
    handleStatusChange(orderId, "cancelled");
  }

  function handleStartPreparing(orderId: string) {
    handleStatusChange(orderId, "preparing");
  }

  function handleMarkReady(orderId: string) {
    handleStatusChange(orderId, "ready_for_pickup");
  }

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading restaurant...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {restaurantName ? `${restaurantName} — Orders` : "Orders"}
          </h1>
          <Badge variant="brand">{activeCount} active</Badge>
          {/* Connection status indicator */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-yellow-400"
              }`}
            />
            <span className="text-xs text-gray-400">
              {isConnected ? "Live" : "Polling"}
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {COLUMNS.map((col) => {
            const colOrders = columnOrders[col.key] ?? [];
            return (
              <div key={col.key} className="flex flex-col min-h-0">
                {/* Column Header */}
                <div
                  className={`rounded-t-xl border px-4 py-3 flex items-center justify-between ${col.headerColor}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}
                    />
                    <span className="font-semibold text-gray-800 text-sm">
                      {col.title}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-white/80 rounded-full px-2 py-0.5">
                    {colOrders.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="flex-1 bg-gray-100/50 rounded-b-xl border border-t-0 border-gray-200 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-180px)]">
                  {colOrders.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">
                      No orders
                    </p>
                  )}
                  {colOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onAccept={() => handleAccept(order.id)}
                      onReject={() => handleReject(order.id)}
                      onStartPreparing={() => handleStartPreparing(order.id)}
                      onMarkReady={() => handleMarkReady(order.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
