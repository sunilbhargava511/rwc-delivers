"use client";

import { useState } from "react";
import Image from "next/image";
import type {
  MenuItemWithModifiers,
  RestaurantWithStatus,
  SelectedModifier,
} from "@rwc/shared";
import { formatCurrency } from "@rwc/shared";
import { Button } from "@rwc/ui";
import { useCartStore } from "../stores/cart";

interface Props {
  item: MenuItemWithModifiers;
  restaurant: RestaurantWithStatus;
  onClose: () => void;
}

export function ItemDetailSheet({ item, restaurant, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<
    SelectedModifier[]
  >([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const { addItem, setRestaurant, restaurantId, clearCart } = useCartStore();

  const modifierTotal = selectedModifiers.reduce(
    (sum, m) => sum + m.price_delta,
    0
  );
  const lineTotal = (item.price + modifierTotal) * quantity;

  function handleModifierChange(
    groupName: string,
    optionName: string,
    priceDelta: number,
    isRequired: boolean,
    maxSelections: number
  ) {
    setSelectedModifiers((prev) => {
      const withoutGroup = prev.filter((m) => m.group_name !== groupName);
      const existing = prev.find(
        (m) => m.group_name === groupName && m.option_name === optionName
      );

      if (existing) {
        // Deselect (only if not required or there are other selections)
        if (!isRequired || prev.filter((m) => m.group_name === groupName).length > 1) {
          return prev.filter(
            (m) =>
              !(m.group_name === groupName && m.option_name === optionName)
          );
        }
        return prev;
      }

      if (maxSelections === 1) {
        // Radio behavior: replace
        return [
          ...withoutGroup,
          { group_name: groupName, option_name: optionName, price_delta: priceDelta },
        ];
      }

      // Checkbox behavior: add if under max
      const currentCount = prev.filter(
        (m) => m.group_name === groupName
      ).length;
      if (currentCount < maxSelections) {
        return [
          ...prev,
          { group_name: groupName, option_name: optionName, price_delta: priceDelta },
        ];
      }
      return prev;
    });
  }

  function handleAdd() {
    // Check if switching restaurants
    if (restaurantId && restaurantId !== restaurant.id) {
      const confirmed = window.confirm(
        `This will clear your current cart. Start a new order from ${restaurant.name}?`
      );
      if (!confirmed) return;
      clearCart();
    }

    setRestaurant(restaurant.id, restaurant.name, restaurant.slug);

    addItem({
      menu_item_id: item.id,
      name: item.name,
      quantity,
      unit_price: item.price,
      modifiers: selectedModifiers,
      special_instructions: specialInstructions,
    });

    onClose();
  }

  // Check if required modifiers are satisfied
  const requiredGroups = item.modifier_groups.filter((g) => g.is_required);
  const allRequiredMet = requiredGroups.every((g) =>
    selectedModifiers.some((m) => m.group_name === g.name)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[85vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 z-10"
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

        {item.image_url && (
          <div className="relative w-full h-48 sm:h-56">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          </div>
        )}

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 pr-8">{item.name}</h2>
          {item.description && (
            <p className="text-gray-500 mt-2">{item.description}</p>
          )}
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {formatCurrency(item.price)}
          </p>

          {/* Modifier Groups */}
          {item.modifier_groups.map((group) => (
            <div key={group.id} className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium text-gray-900">{group.name}</h3>
                {group.is_required && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    Required
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {group.options.map((option) => {
                  const isSelected = selectedModifiers.some(
                    (m) =>
                      m.group_name === group.name &&
                      m.option_name === option.name
                  );
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleModifierChange(
                          group.name,
                          option.name,
                          option.price_delta,
                          group.is_required,
                          group.max_selections
                        )
                      }
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm text-gray-900">
                        {option.name}
                      </span>
                      {option.price_delta > 0 && (
                        <span className="text-sm text-gray-500">
                          +{formatCurrency(option.price_delta)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Instructions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Allergies, preferences, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                -
              </button>
              <span className="px-3 py-2 font-medium text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                +
              </button>
            </div>

            <Button
              onClick={handleAdd}
              disabled={!allRequiredMet}
              className="flex-1"
              size="lg"
            >
              Add to Cart &middot; {formatCurrency(lineTotal)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
