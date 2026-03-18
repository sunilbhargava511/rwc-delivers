"use client";

import { useState } from "react";
import { getMockDeliveryHistory } from "../../lib/mock-data";
import { formatCurrency } from "@rwc/shared";
import { Badge } from "@rwc/ui";

const allDeliveries = getMockDeliveryHistory();

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = allDeliveries.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      d.order_number.toLowerCase().includes(q) ||
      d.restaurant_name.toLowerCase().includes(q) ||
      d.customer_name.toLowerCase().includes(q) ||
      d.driver_name.toLowerCase().includes(q);
    const matchesDate =
      !dateFilter || d.placed_at.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  const totalDeliveries = filtered.length;
  const avgTime =
    totalDeliveries > 0
      ? Math.round(
          filtered.reduce((sum, d) => sum + d.delivery_time, 0) /
            totalDeliveries
        )
      : 0;
  const totalTips = filtered.reduce((sum, d) => sum + d.tip, 0);
  const cityCount = filtered.filter(
    (d) => d.driver_type === "city_driver"
  ).length;
  const courierCount = filtered.filter(
    (d) => d.driver_type === "courier_partner"
  ).length;

  return (
    <div>
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Delivery History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse and search past deliveries.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search orders, restaurants, drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 w-64"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/80">
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3 text-right">Duration</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Tip</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {d.order_number}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {d.restaurant_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {d.customer_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {d.driver_name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          d.driver_type === "city_driver" ? "brand" : "warning"
                        }
                      >
                        {d.driver_type === "city_driver" ? "City" : "Courier"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatTime(d.placed_at)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {d.delivery_time} min
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(d.order_total)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatCurrency(d.tip)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={
                          d.status === "delivered" ? "success" : "error"
                        }
                      >
                        {d.status === "delivered" ? "Delivered" : "Failed"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-gray-400">
              No deliveries match your search.
            </div>
          )}
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3 mb-6">
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 text-center text-sm text-gray-400">
              No deliveries match your search.
            </div>
          )}
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {d.order_number}
                </span>
                <Badge
                  variant={d.status === "delivered" ? "success" : "error"}
                >
                  {d.status === "delivered" ? "Delivered" : "Failed"}
                </Badge>
              </div>
              <p className="text-sm text-gray-700">{d.restaurant_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {d.customer_name} &middot; {d.driver_name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={
                    d.driver_type === "city_driver" ? "brand" : "warning"
                  }
                >
                  {d.driver_type === "city_driver" ? "City" : "Courier"}
                </Badge>
                <span className="text-xs text-gray-400">
                  {d.delivery_time} min
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {formatTime(d.placed_at)}
                </span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(d.order_total)}
                  </span>
                  <span className="text-gray-400">
                    +{formatCurrency(d.tip)} tip
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {totalDeliveries}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Deliveries</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{avgTime} min</p>
            <p className="text-xs text-gray-500 mt-1">Avg Time</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalTips)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Tips</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {cityCount}
              <span className="text-sm font-normal text-gray-400"> / </span>
              {courierCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">City / Courier</p>
          </div>
        </div>
    </div>
  );
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
