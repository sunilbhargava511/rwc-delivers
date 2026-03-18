"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@rwc/ui";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@rwc/shared";

interface Props {
  params: Promise<{ id: string }>;
}

const mockStatuses: OrderStatus[] = [
  "placed",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "driver_assigned",
  "en_route",
  "delivered",
];

export default function OrderConfirmationPage({ params }: Props) {
  const { id } = use(params);
  const currentStatus: OrderStatus = "placed";

  // Generate a readable order number from the mock ID
  const today = new Date();
  const orderNumber = `RWC-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-0001`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
        <p className="text-gray-500 mt-2">
          Order #{orderNumber}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Estimated delivery: 30-45 minutes
        </p>
      </div>

      {/* Status timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Order Status
        </h2>

        <div className="space-y-0">
          {mockStatuses.map((status, index) => {
            const currentIndex = mockStatuses.indexOf(currentStatus);
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isFuture = index > currentIndex;

            return (
              <div key={status} className="flex items-start gap-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      isCompleted
                        ? "bg-green-500"
                        : isCurrent
                          ? "bg-brand-600 ring-4 ring-brand-100"
                          : "bg-gray-200"
                    }`}
                  />
                  {index < mockStatuses.length - 1 && (
                    <div
                      className={`w-0.5 h-8 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-sm pb-6 ${
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

      {/* Map placeholder */}
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
        <p className="text-xs text-gray-400 mt-1">
          Mapbox integration coming soon
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Restaurants
          </Button>
        </Link>
      </div>
    </div>
  );
}
