"use client";

import type { OrderWithItems } from "@rwc/shared";
import { formatCurrency, ORDER_STATUS_LABELS } from "@rwc/shared";
import { Badge, Button } from "@rwc/ui";

const CUSTOMER_NAMES: Record<string, string> = {
  "ord-001": "Maria Santos",
  "ord-002": "David Chen",
  "ord-003": "Sarah Johnson",
  "ord-004": "James Park",
  "ord-005": "Elena Rodriguez",
  "ord-006": "Kevin Nguyen",
  "ord-007": "Maria Santos",
  "ord-008": "Sarah Johnson",
};

interface OrderCardProps {
  order: OrderWithItems;
  onAccept?: () => void;
  onMarkReady?: () => void;
  onReject?: () => void;
  onSimulateDelivery?: () => void;
  isSimulating?: boolean;
}

const statusBadgeVariant: Record<
  string,
  "default" | "success" | "warning" | "error"
> = {
  placed: "warning",
  confirmed: "default",
  preparing: "default",
  ready_for_pickup: "success",
  driver_assigned: "default",
  en_route: "default",
  delivered: "success",
  cancelled: "error",
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const placed = new Date(dateString);
  const diffMs = now.getTime() - placed.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin === 1) return "1 min ago";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return "1 hr ago";
  return `${diffHours} hrs ago`;
}

export function OrderCard({
  order,
  onAccept,
  onMarkReady,
  onReject,
  onSimulateDelivery,
  isSimulating,
}: OrderCardProps) {
  const customerName = CUSTOMER_NAMES[order.id] ?? "Customer";

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900 text-sm">
            {order.order_number}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{customerName}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={statusBadgeVariant[order.status] ?? "default"}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
          <span className="text-xs text-gray-400">{timeAgo(order.placed_at)}</span>
        </div>
      </div>

      {/* Items */}
      <div className="border-t border-gray-100 pt-2 space-y-1">
        {order.items.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.item_name}{" "}
                <span className="text-gray-400">x{item.quantity}</span>
              </span>
              <span className="text-gray-500 tabular-nums">
                {formatCurrency(item.unit_price * item.quantity)}
              </span>
            </div>
            {item.special_instructions && (
              <p className="text-xs text-gray-400 italic ml-2 mt-0.5">
                {item.special_instructions}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Special Instructions */}
      {order.notes && (
        <div className="border-t border-gray-100 pt-2">
          <p className="text-xs text-gray-500 italic">
            <span className="font-medium text-gray-600 not-italic">Note:</span>{" "}
            {order.notes}
          </p>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">Total</span>
        <span className="font-bold text-gray-900">
          {formatCurrency(order.total)}
        </span>
      </div>

      {/* Actions */}
      <div className="pt-1">
        {order.status === "placed" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              className="flex-1 !bg-green-600 hover:!bg-green-700"
              onClick={onAccept}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 !text-red-600 !border-red-300 hover:!bg-red-50"
              onClick={onReject}
            >
              Reject
            </Button>
          </div>
        )}

        {(order.status === "confirmed" || order.status === "preparing") && (
          <Button
            size="sm"
            variant="primary"
            className="w-full"
            onClick={onMarkReady}
          >
            Mark Ready
          </Button>
        )}

        {order.status === "ready_for_pickup" && (
          <div className="space-y-2">
            {onSimulateDelivery && (
              <Button
                size="sm"
                variant="primary"
                className="w-full !bg-purple-600 hover:!bg-purple-700"
                onClick={onSimulateDelivery}
                disabled={isSimulating}
                loading={isSimulating}
              >
                {isSimulating ? "Simulating..." : "Simulate Delivery"}
              </Button>
            )}
            <p className="text-center text-xs text-gray-400">
              {isSimulating ? "Driver assigned, pickup, delivery in progress..." : "Awaiting driver"}
            </p>
          </div>
        )}

        {(order.status === "driver_assigned" || order.status === "en_route") && (
          <p className="text-center text-sm text-purple-500 py-1">
            {order.status === "en_route" ? "On the way" : "Driver picking up"}
          </p>
        )}
      </div>
    </div>
  );
}
