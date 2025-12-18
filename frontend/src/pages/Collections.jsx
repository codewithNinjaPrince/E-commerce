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

  // Mobile Drawers
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // ========== HANDLERS ==========

  const toggleCategory = (e) => {
    const val = e.target.value;
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  const toggleSubCategory = (e) => {
    const val = e.target.value;
    setSubCategory((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  // ========== FILTER FUNCTION ==========
  const applyFilters = () => {
    let data = [...products];

    // Search filter
    if (showSearch && search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category.length > 0) {
      data = data.filter((p) => category.includes(p.category));
    }

    // Subcategory filter
    if (subCategory.length > 0) {
      data = data.filter((p) => subCategory.includes(p.subCategory));
    }

    setFilterProducts(data);
  };

  // ========== SORT FUNCTION ==========
  const sortProducts = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case "low-high":
        sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;

      case "high-low":
        sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;

      default:
        applyFilters();
        return;
    }

    setFilterProducts(sorted);
  };

  // Apply filters when data changes
  useEffect(() => {
    applyFilters();
  }, [products, search, showSearch, category, subCategory]);

  // Apply sorting when sortType changes
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  // ================= FIRST TIME LOADER =================
  useEffect(() => {
    if (products.length > 0) {
      setTimeout(() => setLoading(false), 400); // only ONCE
    }
  }, [products]);

  useEffect(() => {
  document.title =
    "Shop Fashion, Electronics & More | Brawvly Collections";
}, []);

<meta
  name="description"
  content="Explore fashion, electronics, watches, shoes & more from trusted local sellers across India on Brawvly."
/>


  return (
    <div className="pt-10 border-t text-white min-h-screen">
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

              {/* Categories */}
              <div className="mb-6">
                <p className="font-medium mb-2">Categories</p>
                <div className="space-y-2 text-sm cursor-pointer">
                  {["Men", "Women", "Kids"].map((cat) => (
                    <label key={cat} className="flex gap-2">
                      <input
                        type="checkbox"
                        value={cat}
                        onChange={toggleCategory}
                        className="accent-white cursor-pointer"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sub-category */}
              <div className="mb-6">
                <p className="font-medium mb-2">Type</p>
                <div className="space-y-2 text-sm cursor-pointer">
                  {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                    <label key={sub} className="flex gap-2">
                      <input
                        type="checkbox"
                        value={sub}
                        onChange={toggleSubCategory}
                        className="accent-white cursor-pointer"
                      />
                      {sub}
                    </label>
                  ))}
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

          {/* MOBILE FILTER/SORT BUTTONS */}
          <div className="sm:hidden fixed bottom-0 left-0 w-full bg-black/90 border-t border-white/10 flex justify-around py-3 z-50">
            <button
              onClick={() => {
                setShowMobileFilter(true);
                setShowMobileSort(false);
              }}
              className="text-white font-semibold cursor-pointer"
            >
              🔍 Filter
            </button>

            <button
              onClick={() => {
                setShowMobileSort(true);
                setShowMobileFilter(false);
              }}
              className="text-white font-semibold cursor-pointer"
            >
              ⇅ Sort
            </button>
          </div>

          {/* MOBILE FILTER DRAWER */}
          {showMobileFilter && (
            <div className="fixed bottom-0 left-0 w-full bg-[#111] border-t border-white/10 p-5 rounded-t-2xl z-50 animate-slide-up">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowMobileFilter(false)}>✖</button>
              </div>

              {/* Category */}
              <p className="font-medium mb-2">Categories</p>
              <div className="space-y-2 mb-4 cursor-pointer">
                {["Men", "Women", "Kids"].map((cat) => (
                  <label key={cat} className="flex gap-2">
                    <input
                      type="checkbox"
                      value={cat}
                      onChange={toggleCategory}
                      className="accent-white"
                    />
                    {cat}
                  </label>
                ))}
              </div>

              {/* SubCategory */}
              <p className="font-medium mb-2">Type</p>
              <div className="space-y-2 cursor-pointer">
                {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                  <label key={sub} className="flex gap-2">
                    <input
                      type="checkbox"
                      value={sub}
                      onChange={toggleSubCategory}
                      className="accent-white"
                    />
                    {sub}
                  </label>
                ))}
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
