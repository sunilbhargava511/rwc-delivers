"use client";

import Link from "next/link";
import { useCartStore } from "../stores/cart";
import { formatCurrency } from "@rwc/shared";
import { TIP_DEFAULTS } from "@rwc/shared";
import { Button } from "@rwc/ui";

export function CartDrawer() {
  const {
    items,
    restaurantName,
    tip,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    setTip,
    getSubtotal,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
            <button
              onClick={closeCart}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add items from a restaurant to get started</p>
            </div>
          ) : (
            <>
              {/* Restaurant name */}
              <p className="text-sm text-gray-500 mb-4">
                From <span className="font-medium text-gray-900">{restaurantName}</span>
              </p>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {item.quantity}x
                          </span>
                          <span className="text-sm text-gray-900">
                            {item.name}
                          </span>
                        </div>
                        {item.modifiers.length > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5 ml-6">
                            {item.modifiers
                              .map((m) => m.option_name)
                              .join(", ")}
                          </p>
                        )}
                        {item.special_instructions && (
                          <p className="text-xs text-gray-400 mt-0.5 ml-6 italic">
                            {item.special_instructions}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.line_total)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-400 text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs text-gray-600 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-400 text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Driver Tip
                </p>
                <div className="flex gap-2">
                  {TIP_DEFAULTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTip(amount)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        tip === amount
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const custom = prompt("Enter custom tip amount ($):");
                      if (custom) {
                        const cents = Math.round(parseFloat(custom) * 100);
                        if (!isNaN(cents) && cents >= 0) setTip(cents);
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      !(TIP_DEFAULTS as readonly number[]).includes(tip)
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-900">
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tip</span>
                  <span className="text-gray-900">{formatCurrency(tip)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  No hidden fees. No surge pricing.
                </p>
              </div>

              {/* Checkout button */}
              <div className="mt-6">
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout &middot; {formatCurrency(total)}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
