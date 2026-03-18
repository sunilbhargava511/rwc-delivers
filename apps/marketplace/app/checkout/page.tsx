"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../stores/cart";
import { formatCurrency, TIP_DEFAULTS } from "@rwc/shared";
import { Button } from "@rwc/ui";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    restaurantName,
    tip,
    setTip,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    clearCart,
  } = useCartStore();

  const [form, setForm] = useState({
    phone: "",
    street: "",
    unit: "",
    city: "Redwood City",
    zip: "94063",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8">
          Add items from a restaurant to get started.
        </p>
        <Button onClick={() => router.push("/")}>Browse Restaurants</Button>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  async function handlePlaceOrder() {
    if (!form.phone || !form.street) return;

    setLoading(true);
    try {
      // In production: POST to /api/orders with Stripe PaymentIntent
      // For dev mode: simulate order creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock order ID
      const orderId = `mock-${Date.now()}`;
      clearCart();
      router.push(`/orders/${orderId}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-sm text-gray-500 mb-8">
        Order from{" "}
        <span className="font-medium text-gray-900">{restaurantName}</span>
      </p>

      <div className="space-y-8">
        {/* Delivery Address */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Address
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(650) 555-1234"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="123 Main St"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit/Apt
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="Apt 4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP
                </label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Instructions */}
        <section>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Instructions
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Gate code, leave at door, etc."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            rows={2}
          />
        </section>

        {/* Tip */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Driver Tip
          </h2>
          <div className="flex gap-2">
            {TIP_DEFAULTS.map((amount) => (
              <button
                key={amount}
                onClick={() => setTip(amount)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
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
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                !TIP_DEFAULTS.includes(tip as any)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Custom
            </button>
          </div>
        </section>

        {/* Payment (placeholder) */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment</h2>
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
            <p className="text-sm font-medium">Stripe Payment Form</p>
            <p className="text-xs mt-1">
              Card, Apple Pay, Google Pay — coming when Stripe is connected
            </p>
            <p className="text-xs mt-2 text-brand-600 font-medium">
              Dev mode: orders will be created without payment
            </p>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-gray-50 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Order Summary
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity}x {item.name}
                  {item.modifiers.length > 0 && (
                    <span className="text-gray-400">
                      {" "}
                      ({item.modifiers.map((m) => m.option_name).join(", ")})
                    </span>
                  )}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(item.line_total)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tip</span>
              <span>{formatCurrency(tip)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </section>

        {/* Place Order */}
        <Button
          onClick={handlePlaceOrder}
          loading={loading}
          disabled={!form.phone || !form.street}
          className="w-full"
          size="lg"
        >
          Place Order &middot; {formatCurrency(total)}
        </Button>
      </div>
    </div>
  );
}
