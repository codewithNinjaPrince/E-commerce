import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FILTER_TYPES = [
  "Gender",
  "Price",
  "Brand",
  "Size",
  "Color",
  "Category",
  "Subcategory",
];

const FilterPage = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("Gender");
  const [selectedFilters, setSelectedFilters] = useState({
    Gender: [],
    Price: [],
    Brand: [],
    Size: [],
    Color: [],
    Category: [],
    Subcategory: [],
  });

  const totalProducts = 128; // dynamic later

  return (
    <div className="min-h-screen bg-black text-white">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-black border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* LEFT 40% */}
        <div className="w-[40%] border-r border-white/10">
          {FILTER_TYPES.map((type) => (
            <div
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-4 cursor-pointer flex justify-between items-center
                ${activeFilter === type
                  ? "bg-[#1c1c1c] text-white"
                  : "text-gray-400"
                }`}
            >
              <span>{type}</span>
              {selectedFilters[type].length > 0 && (
                <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full">
                  {selectedFilters[type].length}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT 60% */}
        <div className="w-[60%] p-4 overflow-y-auto">
          <h3 className="font-medium mb-4">{activeFilter}</h3>

          {/* OPTIONS */}
          {["Option 1", "Option 2", "Option 3"].map((opt) => {
            const isSelected = selectedFilters[activeFilter].includes(opt);

            return (
              <div
                key={opt}
                onClick={() => {
                  setSelectedFilters((prev) => {
                    const exists = prev[activeFilter].includes(opt);
                    return {
                      ...prev,
                      [activeFilter]: exists
                        ? prev[activeFilter].filter((o) => o !== opt)
                        : [...prev[activeFilter], opt],
                    };
                  });
                }}
                className="flex items-center justify-between py-3 border-b border-white/10 cursor-pointer"
              >
                <span>{opt}</span>
                {isSelected && <span className="text-green-400">✔</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-black border-t border-white/10 px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {totalProducts} products
        </span>

        <div className="flex gap-4">
          <button
            onClick={() =>
              setSelectedFilters({
                Gender: [],
                Price: [],
                Brand: [],
                Size: [],
                Color: [],
                Category: [],
                Subcategory: [],
              })
            }
            className="text-sm text-gray-400"
          >
            Clear
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
