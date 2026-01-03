import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import SideSheet from "../components/SideSheet";
import ProductItemSkeleton from "../components/ProductItemSkeleton";
import axios from "axios";

const MerchantStore = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  // ✅ slug must match App.jsx route: /store/:slug
  const { products, search, showSearch } = useContext(ShopContext);
  const { slug } = useParams();

  const [merchant, setMerchant] = useState(null);
  const [merchantProducts, setMerchantProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // filters
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [priceRange, setPriceRange] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Mobile Drawers
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // ---------------- ONLINE / OFFLINE ----------------
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  // ---------------- FETCH MERCHANT + PRODUCTS ----------------
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/merchant/store/${slug}`
        );

        if (res.data.success) {
          setMerchant(res.data.merchant);
          setMerchantProducts(res.data.products);
          setFilterProducts(res.data.products);
        }
      } catch (err) {
        console.error("Store fetch failed", err);
      }
    };

    fetchStore();
  }, [slug]);

  // ---------------- FILTER HELPERS ----------------
  const toggleValue = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const applyFilters = () => {
    let data = [...merchantProducts];

    if (category.length) {
      data = data.filter((p) => category.includes(p.category));
    }

    if (subCategory.length) {
      data = data.filter((p) => subCategory.includes(p.subCategory));
    }

    if (priceRange.length) {
      data = data.filter((p) =>
        priceRange.some((r) => {
          if (r === "below-999") return p.discountedPrice <= 999;
          if (r === "1000-2999")
            return p.discountedPrice >= 1000 && p.discountedPrice <= 2999;
          if (r === "above-3000") return p.discountedPrice >= 3000;
          return true;
        })
      );
    }

    if (sizes.length) {
      data = data.filter((p) => p.sizes?.some((s) => sizes.includes(s)));
    }

    setFilterProducts(data);
  };

  useEffect(() => {
    applyFilters();
  }, [merchantProducts, category, subCategory, priceRange, sizes]);

  // ---------------- SORT ----------------
  useEffect(() => {
    if (sortType === "relevant") return;

    setFilterProducts((prev) =>
      [...prev].sort((a, b) =>
        sortType === "low-high"
          ? a.discountedPrice - b.discountedPrice
          : b.discountedPrice - a.discountedPrice
      )
    );
  }, [sortType]);

  // ---------------- SEO ----------------
  useEffect(() => {
    if (!merchant) return;

    document.title = `${merchant.storeName} | Brawvly Store`;

    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = `Buy products from ${merchant.storeName} on Brawvly. Trusted merchant store.`;
  }, [merchant]);

  const skeletonCount = window.innerWidth < 640 ? 10 : 16;
  const showSkeleton = !isOnline || !merchant;

  return (
    <div className="mt-2 sm:mt-3 pt-0 text-white min-h-screen">
      {/* ================= MERCHANT HERO HEADER ================= */}
      {merchant && (
        <div
          className={`relative mb-3 rounded-2xl border border-white/10
  cursor-pointer transition-all duration-300
  hover:shadow-lg hover:shadow-black/30
  overflow-hidden
  ${isCollapsed ? "max-h-[96px]" : "max-h-[420px]"}
  `}
        >
          {/* 🌈 BACKGROUND */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),transparent_60%)]" />

          {/* 🔳 CONTENT */}
          <div
            className={`relative flex flex-col sm:flex-row gap-5 items-start sm:items-center
              transition-all duration-300
              ${isCollapsed ? "p-2 lg:p-3" : "p-2 sm:p-3 lg:p-5"}
              `}
          >
            {/* 🟣 LOGO */}
            <div className="hidden md:block shrink-0">
              <div
                className={`rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#121212]
                  flex items-center justify-center font-bold shadow-md transition-all
                  ${isCollapsed ? "w-12 h-12 text-lg" : "w-16 h-16 text-2xl"}
                  `}
              >
                {merchant.storeName?.charAt(0)}
              </div>
            </div>

            {/* 🏪 STORE INFO */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <h1
                  className={`font-semibold tracking-tight transition-all
                    ${
                      isCollapsed
                        ? "text-lg"
                        : "text-xl sm:text-2xl lg:text-3xl"
                    }
                    `}
                >
                  {merchant.storeName}
                </h1>

                {merchant.isVerified && (
                  <span className="text-[11px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
                    ✔ Verified
                  </span>
                )}
              </div>

              {/* DESCRIPTION (HIDE WHEN COLLAPSED ON DESKTOP) */}
              {!isCollapsed && (
                <p
                  className="text-gray-400 mt-1.5 text-sm max-w-2xl
               block lg:block
               leading-relaxed"
                >
                  {merchant.storeDescription || "Trusted merchant on Brawvly"}
                </p>
              )}

              {/* META */}
              <div className="flex flex-wrap gap-x-4 gap-y-2.5 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  📍
                  <span className="truncate max-w-[200px]">
                    {merchant.address?.fullAddress || "India"}
                  </span>
                </span>

                <span className="flex items-center gap-1.5">
                  🛍 <span>{merchantProducts.length} Products</span>
                </span>

                <span className="flex items-center gap-1.5">
                  🕒{" "}
                  <span>
                    Since {new Date(merchant.createdAt).getFullYear()}
                  </span>
                </span>
              </div>
            </div>

            {/* ⭐ TRUST CARDS (ONLY WHEN EXPANDED) */}
            {!isCollapsed && (
              <div className="hidden lg:grid grid-cols-2 gap-2 min-w-[200px]">
                {[
                  "Quality Checked",
                  "Secure Payments",
                  "Fast Support",
                  "Trusted Seller",
                ].map((t) => (
                  <div
                    key={t}
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5
                  text-[11px] text-gray-300 text-center"
                  >
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ⬆⬇ COLLAPSE TOGGLE (DESKTOP ONLY) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed((p) => !p);
            }}
            className="flex absolute top-2 md:bottom-2 right-3 md:text-[14px]
           text-red-500 cursor-pointer hover:text-white transition"
          >
            {isCollapsed ? " View More ▼" : "Collapse ▲"}
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* ---------------- SIDEBAR ---------------- */}
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

        {/* ---------------- PRODUCTS ---------------- */}
        <div className="flex-1">
          {/* HEADER */}
          <div className="flex justify-between items-center text-2xl mb-3">
            {showSkeleton ? (
              <div className="h-8 w-56 bg-gray-700/40 rounded animate-pulse" />
            ) : (
              <>
                <h2 className="text-white/70 text-xl sm:text-2xl font-semibold tracking-tight">
                  Store <span className="font-bold">Products</span>
                </h2>

                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="hidden sm:block bg-[#1c1c1c]
                  px-3 py-2
                  text-[14px] text-gray-200
                  rounded-lg border border-white/10
                  cursor-pointer
                  hover:bg-[#222]
                  focus:outline-none focus:ring-1 focus:ring-white/10"
                >
                  <option value="relevant">Relevant</option>
                  <option value="low-high">Price: Low → High</option>
                  <option value="high-low">Price: High → Low</option>
                </select>
              </>
            )}
          </div>

          {/* PRODUCTS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {showSkeleton &&
              Array.from({
                length: skeletonCount,
              }).map((_, i) => <ProductItemSkeleton key={i} />)}

            {!showSkeleton &&
              filterProducts.map((item) => (
                <div key={item._id} className="bg-[#2a2a2a] rounded-xl p-2">
                  <ProductItem {...item} />
                </div>
              ))}

            {!showSkeleton && filterProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400">
                This store has no products yet.
              </div>
            )}
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
                            active
                              ? "bg-green-400 border-green-400"
                              : "border-white/30"
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
      </div>
    </div>
  );
};

export default MerchantStore;
