import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import SideSheet from "../components/SideSheet";
import ProductItemSkeleton from "../components/ProductItemSkeleton";

const Collections = () => {
  const { products, search, showSearch } = useContext(ShopContext);

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

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const skeletonCount = window.innerWidth < 640 ? 10 : 15;

  const showSkeleton = !isOnline || products.length === 0;
  const showProducts =
    isOnline && products.length > 0 && filterProducts.length > 0;
  const showEmpty =
    isOnline && products.length > 0 && filterProducts.length === 0;

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
    document.title = "Shop Fashion, Electronics & More | Brawvly Collections";

    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Explore fashion, electronics, watches, shoes & more from trusted local sellers across India on Brawvly.";
  }, []);

  return (
    <div className=" mt-6 pt-3 sm:pt-5 lg:pt-6 border-t text-white min-h-screen ">
      <meta
        name="description"
        content="Explore fashion, electronics, watches, shoes & more from trusted local sellers across India on Brawvly."
      />

      <>
        {/* =================== MAIN LAYOUT =================== */}
        <div className="flex gap-6">
          {/* SIDEBAR */}

          {/* ===== SIDEBAR ===== */}
          <div className="hidden md:block min-w-60">
            {showSkeleton ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-700/30 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="hidden md:block min-w-60 bg-[#1c1c1c] p-5 rounded-xl border border-white/10">
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
            )}
          </div>
          {/* ===== RIGHT SIDE ===== */}
            <div className="flex-1">
              {/* HEADER */}
              <div className="flex justify-between items-center text-2xl mb-6">
                {showSkeleton ? (
                  <div className="h-8 w-56 bg-gray-700/40 rounded animate-pulse" />
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* PRODUCTS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {showSkeleton &&
                  Array.from({ length: skeletonCount }).map((_, i) => (
                    <ProductItemSkeleton key={i} />
                  ))}

                {!showSkeleton &&
                  filterProducts.map((item) => (
                    <div key={item._id} className="bg-[#2a2a2a] rounded-xl p-2">
                      <ProductItem {...item} />
                    </div>
                  ))}

                {showEmpty && (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    No products found. Try adjusting filters.
                  </div>
                )}
              </div>
            </div>

        {/* MOBILE FILTER / SORT BAR */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/95 border-t border-white/10 flex justify-around py-1 sm:py-2 z-50">
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
          : "text-green-400"
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
          ? "bg-white/10 text-white scale-[1.02] shadow-md"
          : "text-red-400"
      }
    `}
          >
            <span className="text-lg">⇅</span>
            <span className="font-semibold text-sm">Sort</span>
          </button>
        </div>

        {/* MOBILE FILTER DRAWER */}

        <SideSheet
          open={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          title="Filters"
        >
          {/* GENDER */}
          <div className="bg-[#151515] border border-white/10 rounded-xl p-4 mb-4">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              Gender
            </p>
            <div className="space-y-3 text-sm">
              {["Men", "Women", "Kids"].map((cat) => (
                <label key={cat} className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={category.includes(cat)}
                    onChange={() => toggleValue(setCategory, cat)}
                    className="accent-green-400"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* TYPE */}
          <div className="bg-[#151515] border border-white/10 rounded-xl p-4 mb-4">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              Type
            </p>
            <div className="space-y-3 text-sm">
              {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                <label key={sub} className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={subCategory.includes(sub)}
                    onChange={() => toggleValue(setSubCategory, sub)}
                    className="accent-green-400"
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-[#151515] border border-white/10 rounded-xl p-4 mb-4">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              Price
            </p>
            <div className="space-y-3 text-sm">
              {[
                { label: "₹999 & below", value: "below-999" },
                { label: "₹1000 – ₹2999", value: "1000-2999" },
                { label: "₹3000 & above", value: "above-3000" },
              ].map((p) => (
                <label key={p.value} className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={priceRange.includes(p.value)}
                    onChange={() => toggleValue(setPriceRange, p.value)}
                    className="accent-green-400"
                  />
                  {p.label}
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
                    className={`flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition
              ${
                active
                  ? "bg-green-400 text-black border-green-400"
                  : "border-white/20 text-gray-300"
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
        </SideSheet>

        {/* MOBILE SORT DRAWER */}
        {showMobileSort && (
          <div className="fixed inset-0 z-50">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowMobileSort(false)}
            />

            {/* SORT SHEET */}
            <div
              className="absolute bottom-0 left-0 w-full
        bg-[#111]
        border-t border-white/10
        p-5
        rounded-t-2xl
        animate-slide-up
        touch-pan-y
      "
              onTouchStart={(e) => {
                e.currentTarget.startY = e.touches[0].clientY;
              }}
              onTouchEnd={(e) => {
                const endY = e.changedTouches[0].clientY;
                const diff = endY - e.currentTarget.startY;

                // 👇 swipe down threshold
                if (diff > 80) {
                  setTimeout(() => {
                    setShowMobileSort(false);
                  }, 100); // 0.10s delay
                }
              }}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Sort By</h2>
                <button
                  onClick={() => setShowMobileSort(false)}
                  className="text-gray-400 text-xl"
                >
                  ✖
                </button>
              </div>

              {/* SORT OPTIONS */}
              <div className="space-y-3 text-sm">
                {[
                  { label: "Relevant", value: "relevant" },
                  { label: "Price: Low → High", value: "low-high" },
                  { label: "Price: High → Low", value: "high-low" },
                ].map((opt) => {
                  const active = sortType === opt.value;

                  return (
                    <label
                      key={opt.value}
                      onClick={() => {
                        setSortType(opt.value);
                        setShowMobileSort(false);
                      }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {/* CHECK */}
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center
                  ${
                    active ? "bg-green-400 border-green-400" : "border-white/30"
                  }
                `}
                      >
                        {active && (
                          <span className="text-black text-sm font-bold">
                            ✓
                          </span>
                        )}
                      </div>

                      <span className="text-gray-300">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      </div>
  );
};

export default Collections;
