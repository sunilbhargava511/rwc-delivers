"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { getMockDrivers, getMockAlerts } from "../../lib/mock-data";
import type { Driver, Alert } from "../../lib/mock-data";
import { formatCurrency } from "@rwc/shared";
import { Badge, Button } from "@rwc/ui";
import { useActiveDeliveries } from "../../hooks/useActiveDeliveries";

const LiveMapComponent = dynamic(() => import("../../components/LiveMap"), { ssr: false });

const STATUS_BADGE_CONFIG: Record<string, { label: string; variant: "default" | "success" | "warning" | "error" | "brand" }> = {
  awaiting_driver: { label: "Awaiting Driver", variant: "warning" },
  driver_assigned: { label: "Driver Assigned", variant: "brand" },
  en_route_to_pickup: { label: "En Route to Pickup", variant: "brand" },
  at_pickup: { label: "At Pickup", variant: "default" },
  en_route_to_delivery: { label: "En Route", variant: "success" },
};

const DRIVER_DOT_POSITIONS: { top: string; left: string }[] = [
  { top: "22%", left: "35%" },
  { top: "38%", left: "62%" },
  { top: "55%", left: "28%" },
  { top: "30%", left: "78%" },
  { top: "65%", left: "50%" },
  { top: "45%", left: "18%" },
  { top: "72%", left: "72%" },
  { top: "18%", left: "55%" },
];

const DRIVER_STATUS_COLORS: Record<string, string> = {
  on_duty: "bg-green-400 shadow-green-400/50",
  on_delivery: "bg-blue-400 shadow-blue-400/50",
  returning: "bg-yellow-400 shadow-yellow-400/50",
};

function getDriverInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatEta(minutesRemaining: number): string {
  if (minutesRemaining <= 0) return "Arriving";
  if (minutesRemaining < 60) return `${minutesRemaining}m`;
  const h = Math.floor(minutesRemaining / 60);
  const m = minutesRemaining % 60;
  return `${h}h ${m}m`;
}

export default function LiveMapPage() {
  const { deliveries, isConnected: realtimeConnected, useMock } = useActiveDeliveries();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const hasMapbox = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Build driver markers from delivery pickup/delivery locations
  const mapDriverMarkers = useMemo(() => {
    return deliveries
      .filter((d) => d.driver_id && d.delivery_location)
      .map((d) => ({
        id: d.driver_id!,
        lat: d.delivery_location.lat,
        lng: d.delivery_location.lng,
      }));
  }, [deliveries]);

  useEffect(() => {
    setDrivers(getMockDrivers());
    setAlerts(getMockAlerts());
  }, []);

  const activeDrivers = drivers.filter((d) => d.status !== "off_duty");
  const inProgressDeliveries = deliveries.filter((d) => d.status !== "delivered");
  const unresolvedAlerts = alerts.filter((a) => !a.resolved && a.severity === "high");

  const driversByStatus = {
    on_duty: activeDrivers.filter((d) => d.status === "on_duty"),
    on_delivery: activeDrivers.filter((d) => d.status === "on_delivery"),
    returning: activeDrivers.filter((d) => d.status === "returning"),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Map</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time delivery tracking for Redwood City
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <span className={`block w-2 h-2 rounded-full ${realtimeConnected ? "bg-green-500 animate-pulse" : useMock ? "bg-yellow-400" : "bg-red-400"}`} />
            {realtimeConnected ? "Live" : useMock ? "Demo" : "Connecting..."}
          </span>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content: Map + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Map Area (60%) */}
        <div className="w-full lg:w-[60%]">
          {hasMapbox ? (
            /* Real Mapbox map when token is configured */
            <div className="relative">
              <LiveMapComponent drivers={mapDriverMarkers} />
              {/* Stats overlay */}
              <div className="absolute top-4 right-14 z-10 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <span className="block text-white font-semibold text-lg leading-tight">
                      {activeDrivers.length}
                    </span>
                    <span className="text-white/50 text-[11px]">Drivers Active</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <span className="block text-white font-semibold text-lg leading-tight">
                      {inProgressDeliveries.length}
                    </span>
                    <span className="text-white/50 text-[11px]">In Progress</span>
                  </div>
                </div>
              </div>
              {/* Connection indicator */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <span className={`w-2 h-2 rounded-full ${realtimeConnected ? "bg-green-400" : "bg-yellow-400"}`} />
                <span className="text-white/60 text-xs">{realtimeConnected ? "Live" : "Connecting..."}</span>
              </div>
            </div>
          ) : (
            /* Fallback mock map when no Mapbox token */
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 shadow-sm ring-1 ring-gray-200/60"
                 style={{ minHeight: "520px" }}>
              {/* Grid overlay for map feel */}
              <div className="absolute inset-0 opacity-[0.06]"
                   style={{
                     backgroundImage:
                       "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                     backgroundSize: "40px 40px",
                   }}
              />

              {/* Faint "road" lines */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="10" y1="30" x2="90" y2="30" stroke="white" strokeWidth="0.5" />
                <line x1="10" y1="60" x2="90" y2="60" stroke="white" strokeWidth="0.5" />
                <line x1="30" y1="10" x2="30" y2="90" stroke="white" strokeWidth="0.5" />
                <line x1="65" y1="10" x2="65" y2="90" stroke="white" strokeWidth="0.5" />
                <line x1="15" y1="45" x2="80" y2="45" stroke="white" strokeWidth="0.3" />
                <line x1="48" y1="15" x2="48" y2="85" stroke="white" strokeWidth="0.3" />
              </svg>

              {/* Title overlay */}
              <div className="absolute top-4 left-4 z-10">
                <h2 className="text-white/90 text-lg font-semibold tracking-tight">
                  Redwood City — Live View
                </h2>
                <p className="text-white/40 text-xs mt-0.5">Downtown &middot; Woodside &middot; Emerald Hills</p>
              </div>

              {/* Stats overlay (top-right) */}
              <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <span className="block text-white font-semibold text-lg leading-tight">
                      {activeDrivers.length}
                    </span>
                    <span className="text-white/50 text-[11px]">Drivers Active</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <span className="block text-white font-semibold text-lg leading-tight">
                      {inProgressDeliveries.length}
                    </span>
                    <span className="text-white/50 text-[11px]">In Progress</span>
                  </div>
                </div>
              </div>

              {/* Driver dots */}
              {activeDrivers.map((driver, i) => {
                const pos = DRIVER_DOT_POSITIONS[i % DRIVER_DOT_POSITIONS.length];
                const colorClass = DRIVER_STATUS_COLORS[driver.status] || "bg-gray-400";
                const showLabel = i < 5;
                return (
                  <div
                    key={driver.id}
                    className="absolute z-10 group"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <span
                      className={`absolute -inset-1.5 rounded-full opacity-40 animate-ping ${colorClass.split(" ")[0]}`}
                      style={{ animationDuration: `${2 + i * 0.5}s` }}
                    />
                    <span
                      className={`relative block w-3.5 h-3.5 rounded-full border-2 border-white/80 shadow-lg ${colorClass}`}
                    />
                    {showLabel && (
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap">
                        {getDriverInitials(driver.name)}
                      </span>
                    )}
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-white/10 shadow-xl z-20">
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-white/60 capitalize">{driver.status.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-14 left-4 z-10 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="block w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-white/50 text-[11px]">Available ({driversByStatus.on_duty.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="block w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-white/50 text-[11px]">Delivering ({driversByStatus.on_delivery.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="block w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="text-white/50 text-[11px]">Returning ({driversByStatus.returning.length})</span>
                </div>
              </div>

              {/* Coming soon banner */}
              <div className="absolute bottom-0 inset-x-0 z-10 bg-black/30 backdrop-blur-sm border-t border-white/10 px-4 py-2.5 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <span className="text-white/50 text-xs">
                  Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the live map
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active Deliveries Sidebar (40%) */}
        <div className="w-full lg:w-[40%] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-semibold text-gray-900">Active Deliveries</h2>
              <Badge variant="brand">{inProgressDeliveries.length}</Badge>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          {/* Alert Banner */}
          {unresolvedAlerts.length > 0 && (
            <button
              type="button"
              className="w-full mb-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-left hover:bg-red-100 transition-colors"
            >
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800">
                  {unresolvedAlerts.length} unresolved alert{unresolvedAlerts.length > 1 ? "s" : ""} requiring attention
                </p>
                <p className="text-xs text-red-600 mt-0.5 truncate">
                  {unresolvedAlerts[0].message}
                </p>
              </div>
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Delivery Cards List */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[460px] pr-1 -mr-1">
            {inProgressDeliveries.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No active deliveries right now</p>
              </div>
            )}

            {inProgressDeliveries.map((delivery) => {
              const statusConfig = STATUS_BADGE_CONFIG[delivery.status] || {
                label: delivery.status.replace(/_/g, " "),
                variant: "default" as const,
              };

              return (
                <div
                  key={delivery.id}
                  className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Top row: Order number + status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-900">
                      {delivery.order_number}
                    </span>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </div>

                  {/* Route: Restaurant -> Customer */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                    <span className="truncate">{delivery.restaurant_name}</span>
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="truncate">{delivery.customer_name}</span>
                  </div>

                  {/* Driver + ETA */}
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      {delivery.driver_name ? (
                        <span className="text-gray-700">{delivery.driver_name}</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Awaiting driver</span>
                      )}
                    </div>
                    {delivery.estimated_delivery && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        ETA {formatEta(Math.max(0, Math.round((new Date(delivery.estimated_delivery).getTime() - Date.now()) / 60000)))}
                      </span>
                    )}
                  </div>

                  {/* Items + Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 truncate max-w-[60%]">
                      {delivery.items_summary}
                    </p>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(delivery.order_total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeDrivers.length}</p>
              <p className="text-xs text-gray-500">Active Drivers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{inProgressDeliveries.length}</p>
              <p className="text-xs text-gray-500">In-Progress Deliveries</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">24m</p>
              <p className="text-xs text-gray-500">Avg Delivery Time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-xs text-gray-500">On-Time Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
