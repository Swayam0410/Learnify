// components/CategorySelector.jsx
"use client";
import React from "react";

const categories = ["general", "health", "technology", "sports", "business", "science", "entertainment"];

const CategorySelector = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            selected === category
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
