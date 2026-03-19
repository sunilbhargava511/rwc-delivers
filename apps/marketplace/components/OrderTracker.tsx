"use client";

import dynamic from "next/dynamic";
import type { OrderWithItems, OrderStatus } from "@rwc/shared";
import { ORDER_STATUS_LABELS } from "@rwc/shared";
import { useOrderTracking } from "../hooks/useOrderTracking";
import { ETADisplay } from "./ETADisplay";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), { ssr: false });

const statusTimeline: OrderStatus[] = [
  "placed",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "driver_assigned",
  "en_route",
  "delivered",
];

interface OrderTrackerProps {
  initialOrder: OrderWithItems;
}

export function OrderTracker({ initialOrder }: OrderTrackerProps) {
  const { order, driverLocation, isConnected } = useOrderTracking(
    initialOrder.id,
    initialOrder
  );

  const currentStatus = order.status as OrderStatus;
  const currentIndex = statusTimeline.indexOf(currentStatus);

  const showMap =
    driverLocation &&
    order.restaurant &&
    currentIndex >= statusTimeline.indexOf("driver_assigned");

  return (
    <>
      {/* ETA */}
      <div className="mb-6">
        <ETADisplay
          status={currentStatus}
          prepTimeMin={order.restaurant?.default_prep_time_min}
        />
      </div>

      {/* Status timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span className="text-xs text-gray-400">
              {isConnected ? "Live" : "Updating..."}
            </span>
          </div>
        </div>

        <div className="space-y-0">
          {statusTimeline.map((status, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={status} className="flex items-start gap-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 transition-colors duration-500 ${
                      isCompleted
                        ? "bg-green-500"
                        : isCurrent
                          ? "bg-brand-600 ring-4 ring-brand-100"
                          : "bg-gray-200"
                    }`}
                  />
                  {index < statusTimeline.length - 1 && (
                    <div
                      className={`w-0.5 h-8 transition-colors duration-500 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-sm pb-6 transition-colors duration-500 ${
                    isCurrent
                      ? "font-semibold text-brand-700"
                      : isCompleted
                        ? "text-green-700"
                        : "text-gray-400"
                  }`}
                >
                  {ORDER_STATUS_LABELS[status]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      {showMap ? (
        <div className="mb-8">
          <DeliveryMap
            restaurantLocation={{
              lat: order.restaurant.lat,
              lng: order.restaurant.lng,
            }}
            customerLocation={{
              lat: order.restaurant.lat + 0.005, // TODO: use actual delivery address coords
              lng: order.restaurant.lng + 0.003,
            }}
            driverLocation={driverLocation}
          />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl border border-gray-200 p-8 text-center mb-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <p className="text-sm text-gray-500 font-medium">
            Live tracking available when driver is assigned
          </p>
        </div>
      )}
    </>
  );
}
