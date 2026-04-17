"use client";

import { useState } from "react";

export default function SortableGrid({
  items,
  sortOptions,
  defaultSortBy,
  defaultSortOrder = "desc",
  renderItem,
  emptyMessage = "No items found.",
}) {
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  const sortedItems = [...items].sort((a, b) => {
    const option = sortOptions.find((opt) => opt.value === sortBy);
    if (!option) return 0;

    return option.compareFn(a, b, sortOrder);
  });

  return (
    <>
      {/* Sorting controls */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label className="font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="px-4 py-2 bg-primary-main text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {sortOrder === "desc" ? "↓ Descending" : "↑ Ascending"}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((item, index) => renderItem(item, index))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-gray-600 dark:text-gray-400">
          {emptyMessage}
        </div>
      )}
    </>
  );
}
