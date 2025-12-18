import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collections = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [loading, setLoading] = useState(true); // 🔥 loader only first time
  const [filterProducts, setFilterProducts] = useState([]);

  // Desktop Filters
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [priceRange, setPriceRange] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Mobile Drawers
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // COMMON TOGGLER
  const toggleValue = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // FILTER LOGIC
  const applyFilters = () => {
    let data = [...products];

    if (showSearch && search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      data = data.filter((p) => category.includes(p.category));
    }

    if (subCategory.length > 0) {
      data = data.filter((p) => subCategory.includes(p.subCategory));
    }

    if (priceRange.length > 0) {
      data = data.filter((p) =>
        priceRange.some((range) => {
          if (range === "below-999") return p.discountedPrice <= 999;
          if (range === "1000-2999")
            return p.discountedPrice >= 1000 && p.discountedPrice <= 2999;
          if (range === "above-3000") return p.discountedPrice >= 3000;
          return true;
        })
      );
    }

    if (sizes.length > 0) {
      data = data.filter((p) => p.sizes?.some((s) => sizes.includes(s)));
    }

    setFilterProducts(data);
  };

  useEffect(() => {
    let sorted = [...filterProducts];
    if (sortType === "low-high")
      sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
    else if (sortType === "high-low")
      sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
    else return;

    setFilterProducts(sorted);
  }, [sortType]);

  // APPLY FILTERS
  useEffect(() => {
    applyFilters();
  }, [products, search, showSearch, category, subCategory, priceRange, sizes]);

  useEffect(() => {
    if (products.length) setTimeout(() => setLoading(false), 400);
  }, [products]);

  useEffect(() => {
    document.title = "Shop Fashion, Electronics & More | Brawvly Collections";
  }, []);

  <meta
    name="description"
    content="Explore fashion, electronics, watches, shoes & more from trusted local sellers across India on Brawvly."
  />;

  return (
<div className="pt-10 border-t text-white min-h-screen pb-24 sm:pb-0">
      {/* =================== SHOW LOADER ONLY FIRST TIME =================== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-gray-300 mt-4 text-sm">Loading collections…</p>
        </div>
      ) : (
        <>
          {/* =================== MAIN LAYOUT =================== */}
          <div className="flex gap-6">
            {/* DESKTOP SIDEBAR */}
            <div className="hidden sm:block min-w-60 bg-[#1c1c1c] p-5 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              {/* FILTER SECTIONS */}
              <div className="space-y-6">
                {/* GENDER */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Gender
                  </p>
                  <div className="space-y-3 text-sm">
                    {["Men", "Women", "Kids"].map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 cursor-pointer hover:text-white transition"
                      >
                        <input
                          type="checkbox"
                          checked={category.includes(cat)}
                          onChange={() => toggleValue(setCategory, cat)}
                          className="accent-green-400 cursor-pointer"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* TYPE */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Type
                  </p>
                  <div className="space-y-3 text-sm">
                    {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                      <label
                        key={sub}
                        className="flex items-center gap-3 cursor-pointer hover:text-white transition"
                      >
                        <input
                          type="checkbox"
                          checked={subCategory.includes(sub)}
                          onChange={() => toggleValue(setSubCategory, sub)}
                          className="accent-green-400 cursor-pointer"
                        />
                        <span>{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PRICE */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Price
                  </p>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "₹999 & below", value: "below-999" },
                      { label: "₹1000 – ₹2999", value: "1000-2999" },
                      { label: "₹3000 & above", value: "above-3000" },
                    ].map((p) => (
                      <label
                        key={p.value}
                        className="flex items-center gap-3 cursor-pointer hover:text-white transition"
                      >
                        <input
                          type="checkbox"
                          checked={priceRange.includes(p.value)}
                          onChange={() => toggleValue(setPriceRange, p.value)}
                          className="accent-green-400 cursor-pointer"
                        />
                        <span>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SIZE */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Size
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {["S", "M", "L", "XL", "XXL", "XXXL"].map((s) => {
                      const active = sizes.includes(s);
                      return (
                        <label
                          key={s}
                          className={`flex items-center justify-center rounded-lg border px-2 py-1.5 cursor-pointer transition
              ${
                active
                  ? "bg-green-400 text-black border-green-400"
                  : "border-white/20 text-gray-300 hover:border-white/40"
              }
            `}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleValue(setSizes, s)}
                            className="hidden"
                          />
                          {s}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* =================== RIGHT SIDE =================== */}
            <div className="flex-1">
              <div className="flex justify-between items-center text-2xl">
                <Title text1="All" text2="Collections" />

                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="hidden sm:block bg-[#1c1c1c] px-3 py-2 rounded-lg border border-white/10 cursor-pointer"
                >
                  <option value="relevant">Sort by: Relevant</option>
                  <option value="low-high">Low → High</option>
                  <option value="high-low">High → Low</option>
                </select>
              </div>

              {/* PRODUCTS */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fadeIn">
                {filterProducts.length === 0 ? (
                  <p className="text-gray-400 text-center col-span-full py-20">
                    No products found.
                  </p>
                ) : (
                  filterProducts.map((item) => (
                    <ProductItem
                      key={item._id}
                      _id={item._id}
                      name={item.name}
                      brandName={item.brandName}
                      image={item.image}
                      discountedPrice={item.discountedPrice}
                      actualPrice={item.actualPrice}
                      review={item.review}
                      noOfPeopleReviewed={item.noOfPeopleReviewed}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* MOBILE FILTER / SORT BAR */}
          <div className="sm:hidden fixed bottom-0 left-0 w-full bg-black/95 border-t border-white/10 flex justify-around py-3 z-50">
            {/* FILTER BUTTON */}
            <button
              onClick={() => {
                setShowMobileFilter(true);
                setShowMobileSort(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
      ${
        showMobileFilter
          ? "bg-white/10 text-green-400 scale-[1.02] shadow-md"
          : "text-white"
      }
    `}
            >
              {/* SLIDER / FILTER ICON */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>

              <span className="font-semibold text-sm">Filter</span>
            </button>

            {/* SORT BUTTON */}
            <button
              onClick={() => {
                setShowMobileSort(true);
                setShowMobileFilter(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
      ${
        showMobileSort
          ? "bg-white/10 text-green-400 scale-[1.02] shadow-md"
          : "text-white"
      }
    `}
            >
              <span className="text-lg">⇅</span>
              <span className="font-semibold text-sm">Sort</span>
            </button>
          </div>

          {/* MOBILE FILTER DRAWER */}
          {showMobileFilter && (
            <div className="fixed bottom-0 left-0 w-full bg-[#111] border-t border-white/10 p-5 rounded-t-2xl z-50 animate-slide-up">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowMobileFilter(false)}>✖</button>
              </div>

              <div className="space-y-6">
                {/* GENDER */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Gender
                  </p>
                  <div className="space-y-3 text-sm">
                    {["Men", "Women", "Kids"].map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 cursor-pointer hover:text-white transition"
                      >
                        <input
                          type="checkbox"
                          checked={category.includes(cat)}
                          onChange={() => toggleValue(setCategory, cat)}
                          className="accent-green-400 cursor-pointer"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* TYPE */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Type
                  </p>
                  <div className="space-y-3 text-sm">
                    {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                      <label
                        key={sub}
                        className="flex items-center gap-3 cursor-pointer hover:text-white transition"
                      >
                        <input
                          type="checkbox"
                          checked={subCategory.includes(sub)}
                          onChange={() => toggleValue(setSubCategory, sub)}
                          className="accent-green-400 cursor-pointer"
                        />
                        <span>{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PRICE */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Price
                  </p>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "₹999 & below", value: "below-999" },
                      { label: "₹1000 – ₹2999", value: "1000-2999" },
                      { label: "₹3000 & above", value: "above-3000" },
                    ].map((p) => (
                      <label
                        key={p.value}
                        className="flex items-center gap-3 cursor-pointer hover:text-white transition"
                      >
                        <input
                          type="checkbox"
                          checked={priceRange.includes(p.value)}
                          onChange={() => toggleValue(setPriceRange, p.value)}
                          className="accent-green-400 cursor-pointer"
                        />
                        <span>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SIZE */}
                <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                    Size
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {["S", "M", "L", "XL", "XXL", "XXXL"].map((s) => {
                      const active = sizes.includes(s);
                      return (
                        <label
                          key={s}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition
              ${
                active
                  ? "bg-green-400 text-black border-green-400"
                  : "border-white/20 hover:border-white/40 text-gray-300"
              }
            `}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleValue(setSizes, s)}
                            className="hidden"
                          />
                          {s}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE SORT DRAWER */}
          {showMobileSort && (
            <div className="fixed bottom-0 left-0 w-full bg-[#111] border-t border-white/10 p-5 rounded-t-2xl z-50 animate-slide-up">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Sort By</h2>
                <button onClick={() => setShowMobileSort(false)}>✖</button>
              </div>

              <div className="space-y-3 cursor-pointer">
                <p onClick={() => setSortType("relevant")}>Relevant</p>
                <p onClick={() => setSortType("low-high")}>Price: Low → High</p>
                <p onClick={() => setSortType("high-low")}>Price: High → Low</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Collections;
