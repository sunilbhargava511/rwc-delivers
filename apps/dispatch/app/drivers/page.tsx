"use client";

import { useState } from "react";
import { Badge, Button } from "@rwc/ui";
import { getMockDrivers } from "../../lib/mock-data";

const statusColors: Record<string, string> = {
  on_duty: "bg-green-500",
  on_delivery: "bg-blue-500",
  returning: "bg-yellow-500",
  off_duty: "bg-gray-400",
};

const statusLabels: Record<string, string> = {
  on_duty: "On Duty",
  on_delivery: "On Delivery",
  returning: "Returning",
  off_duty: "Off Duty",
};

const initialColors: Record<string, string> = {
  on_duty: "bg-green-100 text-green-700",
  on_delivery: "bg-blue-100 text-blue-700",
  returning: "bg-yellow-100 text-yellow-700",
  off_duty: "bg-gray-100 text-gray-500",
};

type DriverFilter = "all" | "city_driver" | "courier_partner";

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="w-3.5 h-3.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  }
  return stars;
}

export default function DriversPage() {
  const drivers = getMockDrivers();
  const [filter, setFilter] = useState<DriverFilter>("all");

  const filteredDrivers = drivers.filter((d) => {
    if (filter === "all") return true;
    return d.type === filter;
  });

  const tabs: { label: string; value: DriverFilter }[] = [
    { label: "All Drivers", value: "all" },
    { label: "City Drivers", value: "city_driver" },
    { label: "Courier Partners", value: "courier_partner" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Roster</h1>
        <Button variant="primary">Add Driver</Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-5"
          >
            {/* Top section: avatar + name + type */}
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${initialColors[driver.status]}`}
              >
                {driver.photo_initial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {driver.name}
                </h3>
                <Badge
                  variant={driver.type === "city_driver" ? "brand" : "default"}
                  className="mt-1"
                >
                  {driver.type === "city_driver" ? "City Driver" : "Courier"}
                </Badge>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`w-2 h-2 rounded-full ${statusColors[driver.status]}`}
              />
              <span className="text-sm text-gray-600">
                {statusLabels[driver.status]}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>{driver.deliveries_today} deliveries today</span>
              <span className="text-gray-300">|</span>
              <span>avg {driver.avg_delivery_time} min</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5">
                {renderStars(driver.rating)}
              </div>
              <span className="text-xs text-gray-500">{driver.rating}</span>
            </div>

            {/* Contact info */}
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              <p className="text-xs text-gray-500 truncate">{driver.phone}</p>
              <p className="text-xs text-gray-500 truncate">{driver.email}</p>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-600">
                {driver.is_active ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={driver.is_active}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  driver.is_active ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    driver.is_active ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
