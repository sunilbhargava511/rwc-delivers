import Link from "next/link";
import { Button } from "@rwc/ui";
import { formatCurrency } from "@rwc/shared";
import { getOrder } from "@rwc/db";
import { OrderTracker } from "../../../components/OrderTracker";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-500 mb-8">
          We couldn&apos;t find an order with that ID.
        </p>
        <Link href="/">
          <Button>Browse Restaurants</Button>
        </Link>
      </div>
    );
  }

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
          Order #{order.order_number}
        </p>
        {order.restaurant && (
          <p className="text-sm text-gray-500 mt-1">
            From {order.restaurant.name}
          </p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          Total: {formatCurrency(order.total)}
        </p>
      </div>

      {/* Live order tracking (client component with Realtime) */}
      <OrderTracker initialOrder={order} />

      {/* Order items */}
      {order.items.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity}x {item.item_name}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span>{formatCurrency(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tip</span>
              <span>{formatCurrency(order.tip)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      )}

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
