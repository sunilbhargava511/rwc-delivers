"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { formatCurrency } from "@rwc/shared";
import { Badge, Button } from "@rwc/ui";
import type { ActiveDelivery } from "../../lib/mock-data";
import { useActiveDeliveries } from "../../hooks/useActiveDeliveries";

interface AvailableDriver {
  id: string;
  full_name: string;
  phone: string;
}

const statusLabels: Record<string, string> = {
  awaiting_driver: "Awaiting Driver",
  driver_assigned: "Driver Assigned",
  en_route_to_pickup: "En Route to Pickup",
  at_pickup: "At Pickup",
  en_route_to_delivery: "En Route to Delivery",
  delivered: "Delivered",
};

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "error" | "brand"> = {
  awaiting_driver: "warning",
  driver_assigned: "default",
  en_route_to_pickup: "default",
  at_pickup: "default",
  en_route_to_delivery: "success",
  delivered: "success",
};

type FilterStatus = "all" | "awaiting_driver" | "in_transit" | "at_pickup";

// Map dispatch statuses to the DB OrderStatus values and define the next step
const NEXT_STATUS: Record<string, { dbStatus: string; dispatchStatus: ActiveDelivery["status"]; label: string; color: string }> = {
  driver_assigned: {
    dbStatus: "en_route",
    dispatchStatus: "en_route_to_pickup",
    label: "Heading to Pickup",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  en_route_to_pickup: {
    dbStatus: "en_route", // still en_route in DB — we track sub-states locally
    dispatchStatus: "at_pickup",
    label: "Arrived at Restaurant",
    color: "bg-purple-600 hover:bg-purple-700",
  },
  at_pickup: {
    dbStatus: "en_route",
    dispatchStatus: "en_route_to_delivery",
    label: "Picked Up — Delivering",
    color: "bg-amber-600 hover:bg-amber-700",
  },
  en_route_to_delivery: {
    dbStatus: "delivered",
    dispatchStatus: "delivered",
    label: "Mark Delivered",
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
};

function getEtaFromDelivery(delivery: ActiveDelivery): string {
  const est = new Date(delivery.estimated_delivery);
  const diffMin = Math.max(0, Math.round((est.getTime() - Date.now()) / 60000));
  return `${diffMin} min`;
}

/* ------------------------------------------------------------------ */
/*  Driver assignment dropdown                                         */
/* ------------------------------------------------------------------ */
function AssignDriverButton({
  delivery,
  drivers,
  onAssign,
}: {
  delivery: ActiveDelivery;
  drivers: AvailableDriver[];
  onAssign: (orderId: string, driverId: string, driverName: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  async function handleSelect(driver: AvailableDriver) {
    setAssigning(true);
    try {
      const res = await fetch("/api/deliveries/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: delivery.id, driver_id: driver.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to assign");
      }
      onAssign(delivery.id, driver.id, driver.full_name);
      setOpen(false);
    } catch (err) {
      console.error("Assign failed:", err);
      alert("Failed to assign driver. Please try again.");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        size="sm"
        variant="outline"
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setOpen(!open); }}
        disabled={assigning}
      >
        {assigning ? "Assigning..." : "Assign Driver"}
      </Button>
      {open && (
        <div className="absolute z-50 mt-1 left-0 w-56 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 max-h-60 overflow-y-auto">
          {drivers.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">No drivers available</div>
          ) : (
            drivers.map((driver) => (
              <button
                key={driver.id}
                className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 transition-colors flex items-center justify-between"
                onClick={(e) => { e.stopPropagation(); handleSelect(driver); }}
              >
                <span className="font-medium">{driver.full_name}</span>
                <span className="text-xs text-gray-400">{driver.phone}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status advance button                                              */
/* ------------------------------------------------------------------ */
function StatusAdvanceButton({
  delivery,
  onAdvance,
}: {
  delivery: ActiveDelivery;
  onAdvance: (orderId: string, newStatus: ActiveDelivery["status"]) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const next = NEXT_STATUS[delivery.status];
  if (!next) return null;

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setUpdating(true);
    try {
      // Try API call for DB-backed orders
      const res = await fetch("/api/deliveries/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: delivery.id, status: next.dbStatus }),
      });
      // Even if API fails (mock data), still update locally
      if (!res.ok) {
        console.warn("API status update failed, updating locally");
      }
    } catch {
      console.warn("API not available, updating locally");
    }
    onAdvance(delivery.id, next.dispatchStatus);
    setUpdating(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={updating}
      className={`text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all shadow-sm ${next.color} disabled:opacity-50`}
    >
      {updating ? "Updating..." : `→ ${next.label}`}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
// Auto-simulation sequence with realistic delays (seconds)
const SIM_SEQUENCE: { status: ActiveDelivery["status"]; dbStatus: string; delay: number; label: string }[] = [
  { status: "en_route_to_pickup", dbStatus: "en_route", delay: 4, label: "Heading to restaurant" },
  { status: "at_pickup", dbStatus: "en_route", delay: 6, label: "Arrived at restaurant" },
  { status: "en_route_to_delivery", dbStatus: "en_route", delay: 5, label: "Picked up — delivering" },
  { status: "delivered", dbStatus: "delivered", delay: 8, label: "Delivered!" },
];

export default function DeliveriesPage() {
  const { deliveries, isConnected, useMock } = useActiveDeliveries();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [drivers, setDrivers] = useState<AvailableDriver[]>([]);
  const [localDeliveries, setLocalDeliveries] = useState<ActiveDelivery[]>([]);
  const [autoSim, setAutoSim] = useState(true);
  const [simulating, setSimulating] = useState<Record<string, string>>({}); // orderId → current step label
  const simTimers = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({});

  useEffect(() => {
    setLocalDeliveries(deliveries);
  }, [deliveries]);

  useEffect(() => {
    async function loadDrivers() {
      try {
        const res = await fetch("/api/drivers");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDrivers(data);
            return;
          }
        }
      } catch { /* fall through */ }
      setDrivers([
        { id: "drv_01", full_name: "Marcus Chen", phone: "(650) 555-0111" },
        { id: "drv_02", full_name: "Sofia Ramirez", phone: "(650) 555-0122" },
        { id: "drv_03", full_name: "Tyler Washington", phone: "(650) 555-0133" },
        { id: "drv_04", full_name: "Priya Patel", phone: "(650) 555-0144" },
        { id: "drv_05", full_name: "Jordan Kim", phone: "(650) 555-0155" },
      ]);
    }
    loadDrivers();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(simTimers.current).forEach((timers) =>
        timers.forEach(clearTimeout)
      );
    };
  }, []);

  const runAutoSim = useCallback((orderId: string) => {
    // Clear any existing timers for this order
    if (simTimers.current[orderId]) {
      simTimers.current[orderId].forEach(clearTimeout);
    }
    simTimers.current[orderId] = [];

    let cumulativeDelay = 0;
    SIM_SEQUENCE.forEach((step, i) => {
      cumulativeDelay += step.delay * 1000;

      const timer = setTimeout(async () => {
        // Update sim label
        setSimulating((prev) => ({ ...prev, [orderId]: step.label }));

        // Try API call
        try {
          await fetch("/api/deliveries/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId, status: step.dbStatus }),
          });
        } catch { /* local-only fallback */ }

        // Update local status
        if (step.status === "delivered") {
          setLocalDeliveries((prev) =>
            prev.map((d) => d.id === orderId ? { ...d, status: step.status } : d)
          );
          // Remove after fade
          setTimeout(() => {
            setLocalDeliveries((prev) => prev.filter((d) => d.id !== orderId));
            setSimulating((prev) => {
              const next = { ...prev };
              delete next[orderId];
              return next;
            });
          }, 2000);
        } else {
          setLocalDeliveries((prev) =>
            prev.map((d) => d.id === orderId ? { ...d, status: step.status } : d)
          );
        }

        // Clear sim label after last step
        if (i === SIM_SEQUENCE.length - 1) {
          // handled above in delivered branch
        }
      }, cumulativeDelay);

      simTimers.current[orderId].push(timer);
    });
  }, []);

  function handleAssign(orderId: string, driverId: string, driverName: string) {
    setLocalDeliveries((prev) =>
      prev.map((d) =>
        d.id === orderId
          ? { ...d, driver_name: driverName, driver_id: driverId, status: "driver_assigned" as const }
          : d
      )
    );

    // If auto-sim is on, start the delivery simulation
    if (autoSim) {
      setSimulating((prev) => ({ ...prev, [orderId]: "Driver assigned — starting route..." }));
      runAutoSim(orderId);
    }
  }

  function handleAdvance(orderId: string, newStatus: ActiveDelivery["status"]) {
    if (newStatus === "delivered") {
      setTimeout(() => {
        setLocalDeliveries((prev) => prev.filter((d) => d.id !== orderId));
      }, 1500);
    }
    setLocalDeliveries((prev) =>
      prev.map((d) =>
        d.id === orderId ? { ...d, status: newStatus } : d
      )
    );
  }

  const filteredDeliveries = localDeliveries.filter((d) => {
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
          <Badge variant="brand">{localDeliveries.length}</Badge>
          <div className="flex items-center gap-1.5 ml-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : useMock ? "bg-yellow-400" : "bg-red-500"}`} />
            <span className="text-xs text-gray-400">{isConnected ? "Live" : useMock ? "Demo" : "Connecting..."}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          <div className="ml-2 pl-2 border-l border-gray-200">
            <button
              onClick={() => setAutoSim(!autoSim)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                autoSim
                  ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoSim ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              Auto-Simulate
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Order #</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Restaurant</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Driver</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredDeliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                  delivery.status === "delivered" ? "opacity-50" : ""
                }`}
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
                    <AssignDriverButton
                      delivery={delivery}
                      drivers={drivers}
                      onAssign={handleAssign}
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={statusBadgeVariant[delivery.status] || "default"}
                      className={
                        delivery.status === "at_pickup"
                          ? "bg-purple-100 text-purple-700"
                          : delivery.status === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : ""
                      }
                    >
                      {statusLabels[delivery.status] || delivery.status}
                    </Badge>
                    {simulating[delivery.id] && (
                      <span className="text-[10px] text-emerald-600 font-medium animate-pulse">
                        {simulating[delivery.id]}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {!simulating[delivery.id] && (
                    <StatusAdvanceButton delivery={delivery} onAdvance={handleAdvance} />
                  )}
                  {simulating[delivery.id] && (
                    <span className="text-[10px] text-gray-400 italic">simulating...</span>
                  )}
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
            className={`bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4 ${
              delivery.status === "delivered" ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {delivery.order_number}
              </span>
              <Badge
                variant={statusBadgeVariant[delivery.status] || "default"}
                className={
                  delivery.status === "at_pickup"
                    ? "bg-purple-100 text-purple-700"
                    : delivery.status === "delivered"
                      ? "bg-emerald-100 text-emerald-700"
                      : ""
                }
              >
                {statusLabels[delivery.status] || delivery.status}
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
                  <AssignDriverButton
                    delivery={delivery}
                    drivers={drivers}
                    onAssign={handleAssign}
                  />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(delivery.order_total)}
              </span>
            </div>
            {delivery.status !== "awaiting_driver" && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <StatusAdvanceButton delivery={delivery} onAdvance={handleAdvance} />
              </div>
            )}
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
