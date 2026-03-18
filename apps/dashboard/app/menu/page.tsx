"use client";

import { useState } from "react";
import { getMockMenu } from "../../lib/mock-data";
import { formatCurrency } from "@rwc/shared";
import { Button, Badge } from "@rwc/ui";
import type { MenuCategoryWithItems } from "@rwc/shared";

export default function MenuEditorPage() {
  const initialMenu = getMockMenu();
  const [categories, setCategories] = useState<MenuCategoryWithItems[]>(initialMenu);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialMenu[0]?.id ?? "");

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  function toggleItemAvailability(categoryId: string, itemId: string) {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, is_available: !item.is_available };
          }),
        };
      })
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menu Editor</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage categories and items for your restaurant menu
              </p>
            </div>
            <Button variant="primary" size="md">
              <svg
                className="w-4 h-4 mr-1.5"
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
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category tabs — vertical on desktop, horizontal scroll on mobile */}
          <div className="lg:w-56 flex-shrink-0">
            {/* Mobile: horizontal scrolling tabs */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeCategoryId === cat.id
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                  <span
                    className={`ml-2 text-xs ${
                      activeCategoryId === cat.id
                        ? "text-brand-200"
                        : "text-gray-400"
                    }`}
                  >
                    {cat.items.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Desktop: vertical tabs */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Categories
                </h3>
              </div>
              <nav className="p-2 space-y-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeCategoryId === cat.id
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        activeCategoryId === cat.id
                          ? "bg-brand-100 text-brand-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.items.length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Items panel */}
          <div className="flex-1 min-w-0">
            {activeCategory ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Category header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeCategory.name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {activeCategory.items.length} item
                    {activeCategory.items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Items list */}
                <div className="divide-y divide-gray-100">
                  {activeCategory.items.map((item) => (
                    <div
                      key={item.id}
                      className={`px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-colors ${
                        !item.is_available ? "bg-gray-50/50" : ""
                      }`}
                    >
                      {/* Availability dot */}
                      <button
                        onClick={() =>
                          toggleItemAvailability(activeCategory.id, item.id)
                        }
                        className="flex-shrink-0 self-start sm:self-center group"
                        title={
                          item.is_available
                            ? "Click to mark unavailable"
                            : "Click to mark available"
                        }
                      >
                        <span
                          className={`block w-3 h-3 rounded-full transition-colors ring-4 ring-transparent group-hover:ring-gray-100 ${
                            item.is_available
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                      </button>

                      {/* Name & description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-sm ${
                              item.is_available
                                ? "text-gray-900"
                                : "text-gray-500 line-through"
                            }`}
                          >
                            {item.name}
                          </span>
                          {!item.is_available && (
                            <Badge variant="error">86&apos;d</Badge>
                          )}
                          {item.modifier_groups.length > 0 && (
                            <Badge variant="default">
                              {item.modifier_groups.length} modifier
                              {item.modifier_groups.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-0.5 truncate max-w-md">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-sm font-medium text-gray-900 sm:w-20 sm:text-right">
                        {formatCurrency(item.price)}
                      </div>

                      {/* Edit button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 self-start sm:self-center"
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Item button */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    <svg
                      className="w-4 h-4 mr-1.5"
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
                    Add Item
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">
                  Select a category to view its items
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
