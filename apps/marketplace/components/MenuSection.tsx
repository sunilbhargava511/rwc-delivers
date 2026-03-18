"use client";

import { useState } from "react";
import type {
  MenuCategoryWithItems,
  MenuItemWithModifiers,
  RestaurantWithStatus,
} from "@rwc/shared";
import { formatCurrency } from "@rwc/shared";
import { ItemDetailSheet } from "./ItemDetailSheet";

interface Props {
  category: MenuCategoryWithItems;
  restaurant: RestaurantWithStatus;
}

export function MenuSection({ category, restaurant }: Props) {
  const [selectedItem, setSelectedItem] =
    useState<MenuItemWithModifiers | null>(null);

  return (
    <section id={category.id} className="pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h2>
      <div className="h-0.5 w-12 bg-brand-500 rounded-full mb-4" />

      <div className="divide-y divide-gray-100">
        {category.items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="w-full text-left py-4 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedItem && (
        <ItemDetailSheet
          item={selectedItem}
          restaurant={restaurant}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}
