"use client";

import { useState, useMemo } from "react";
import type { OrderWithItems, OrderStatus } from "@rwc/shared";
import { Badge } from "@rwc/ui";
import { getMockOrders } from "../../lib/mock-data";
import { OrderCard } from "../../components/OrderCard";

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
  const [orders, setOrders] = useState<OrderWithItems[]>(() => getMockOrders());

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

  function handleAccept(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "confirmed" as OrderStatus } : o
      )
    );
  }

  function handleReject(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" as OrderStatus } : o
      )
    );
  }

  function handleMarkReady(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "ready_for_pickup" as OrderStatus }
          : o
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <Badge variant="brand">{activeCount} active</Badge>
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
