"use client";

import { useState } from "react";
import { formatCurrency } from "@rwc/shared";
import { Badge, Button } from "@rwc/ui";
import { getMockActiveDeliveries } from "../../lib/mock-data";

const statusLabels: Record<string, string> = {
  awaiting_driver: "Awaiting Driver",
  driver_assigned: "Driver Assigned",
  en_route_to_pickup: "En Route to Pickup",
  at_pickup: "At Pickup",
  en_route_to_delivery: "En Route to Delivery",
};

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "error" | "brand"> = {
  awaiting_driver: "warning",
  driver_assigned: "default",
  en_route_to_pickup: "default",
  at_pickup: "default",
  en_route_to_delivery: "success",
};

type FilterStatus = "all" | "awaiting_driver" | "in_transit" | "at_pickup";

function getEtaFromDelivery(delivery: ReturnType<typeof getMockActiveDeliveries>[number]): string {
  const now = new Date("2026-03-18T12:35:00-07:00");
  const est = new Date(delivery.estimated_delivery);
  const diffMin = Math.max(0, Math.round((est.getTime() - now.getTime()) / 60000));
  return `${diffMin} min`;
}

export default function DeliveriesPage() {
  const deliveries = getMockActiveDeliveries();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const filteredDeliveries = deliveries.filter((d) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "awaiting_driver") return d.status === "awaiting_driver";
    if (activeFilter === "at_pickup") return d.status === "at_pickup";
    if (activeFilter === "in_transit")
      return (
        d.status === "driver_assigned" ||
        d.status === "en_route_to_pickup" ||
        d.status === "en_route_to_delivery"
      );
    return true;
  });

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Awaiting Driver", value: "awaiting_driver" },
    { label: "In Transit", value: "in_transit" },
    { label: "At Pickup", value: "at_pickup" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Active Deliveries</h1>
          <Badge variant="brand">{deliveries.length}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeFilter === f.value
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Order #
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Restaurant
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Customer
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Driver
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                ETA
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredDeliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {delivery.order_number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {delivery.restaurant_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {delivery.customer_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {delivery.driver_name ? (
                    delivery.driver_name
                  ) : (
                    <Button size="sm" variant="outline">
                      Assign Driver
                    </Button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={statusBadgeVariant[delivery.status]}
                    className={
                      delivery.status === "at_pickup"
                        ? "bg-purple-100 text-purple-700"
                        : ""
                    }
                  >
                    {statusLabels[delivery.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {delivery.status === "awaiting_driver"
                    ? "--"
                    : getEtaFromDelivery(delivery)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(delivery.order_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDeliveries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No deliveries matching this filter.
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredDeliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {delivery.order_number}
              </span>
              <Badge
                variant={statusBadgeVariant[delivery.status]}
                className={
                  delivery.status === "at_pickup"
                    ? "bg-purple-100 text-purple-700"
                    : ""
                }
              >
                {statusLabels[delivery.status]}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              {delivery.restaurant_name}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {delivery.customer_name}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                {delivery.driver_name ? (
                  <span>{delivery.driver_name}</span>
                ) : (
                  <Button size="sm" variant="outline">
                    Assign Driver
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">
                  ETA:{" "}
                  {delivery.status === "awaiting_driver"
                    ? "--"
                    : getEtaFromDelivery(delivery)}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(delivery.order_total)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredDeliveries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No deliveries matching this filter.
          </div>
        )}
      </div>
    </div>
  );
}
