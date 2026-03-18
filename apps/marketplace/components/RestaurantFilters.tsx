"use client";

import { useState, useMemo } from "react";
import type { RestaurantWithStatus } from "@rwc/shared";
import { RestaurantCard } from "./RestaurantCard";

interface Props {
  restaurants: RestaurantWithStatus[];
}

export function RestaurantFilters({ restaurants }: Props) {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [openOnly, setOpenOnly] = useState(false);

  const allCuisines = useMemo(() => {
    const tags = new Set<string>();
    restaurants.forEach((r) => r.cuisine_tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [restaurants]);

  const filtered = useMemo(() => {
    let result = restaurants;
    if (selectedCuisine) {
      result = result.filter((r) => r.cuisine_tags.includes(selectedCuisine));
    }
    if (openOnly) {
      result = result.filter((r) => r.is_open);
    }
    // Sort: open restaurants first
    result = [...result].sort((a, b) => {
      if (a.is_open && !b.is_open) return -1;
      if (!a.is_open && b.is_open) return 1;
      return 0;
    });
    return result;
  }, [restaurants, selectedCuisine, openOnly]);

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => setOpenOnly(!openOnly)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            openOnly
              ? "bg-green-50 border-green-300 text-green-700"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Open Now
        </button>
        <div className="w-px h-6 bg-gray-200 shrink-0" />
        <button
          onClick={() => setSelectedCuisine(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !selectedCuisine
              ? "bg-brand-50 border-brand-300 text-brand-700"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {allCuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() =>
              setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine)
            }
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedCuisine === cuisine
                ? "bg-brand-50 border-brand-300 text-brand-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No restaurants match your filters</p>
          <p className="text-sm mt-1">Try adjusting your selection</p>
        </div>
      )}
    </>
  );
}
