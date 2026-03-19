"use client";

import type { OrderStatus } from "@rwc/shared";

interface ETADisplayProps {
  status: OrderStatus;
  prepTimeMin?: number;
}

const STATUS_ESTIMATES: Record<string, string> = {
  placed: "Waiting for restaurant",
  confirmed: "~25-35 min",
  preparing: "~20-30 min",
  ready_for_pickup: "~10-15 min",
  driver_assigned: "~10-15 min",
  en_route: "~5-10 min",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function ETADisplay({ status, prepTimeMin }: ETADisplayProps) {
  if (status === "delivered" || status === "cancelled") {
    return null;
  }

  const estimate = STATUS_ESTIMATES[status] || "";

  return (
    <div className="flex items-center gap-2 text-sm">
      <svg
        className="w-4 h-4 text-brand-600 animate-pulse"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-gray-600">
        Estimated delivery: <span className="font-medium text-gray-900">{estimate}</span>
      </span>
    </div>
  );
}
