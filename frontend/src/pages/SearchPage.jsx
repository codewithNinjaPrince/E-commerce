import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaChevronRight } from "react-icons/fa";
import { useLayoutEffect } from "react";

const POPULAR_KEYWORDS = [
  "Shoes",
  "T-Shirts",
  "Mobiles",
  "Headphones",
  "Watches",
];

const SearchPage = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSearching, setIsSearching] = useState(false);

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

  /* -------------------- LOAD RECENT -------------------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecent(stored);
  }, []);

  /* -------------------- SEARCH LOGIC -------------------- */
  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      const q = debouncedSearch.toLowerCase();

      const filtered = products.filter((p) =>
        [p.name, p.brandName, p.category, p.subCategory]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );

      setResults(filtered.slice(0, 15));
      setIsSearching(false);
    }, 500); // ⏳ simulate slow / real delay

    return () => clearTimeout(timer);
  }, [debouncedSearch, products]);

  /* -------------------- ANALYTICS -------------------- */
  const trackSearch = (term) => {
    if (!term) return;

    const data = JSON.parse(localStorage.getItem("searchAnalytics")) || {};

    data[term] = (data[term] || 0) + 1;

    localStorage.setItem("searchAnalytics", JSON.stringify(data));
  };

  /* -------------------- RECENT SAVE -------------------- */
  const saveRecent = (value) => {
    trackSearch(value);

    const updated = [value, ...recent.filter((r) => r !== value)].slice(0, 6);
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* -------------------- HANDLERS -------------------- */
  const onSelectProduct = (id) => {
    saveRecent(search);
    navigate(`/product/${id}`);
  };

  const onKeywordClick = (value) => {
    saveRecent(value);
    setSearch(value);
  };

  /* -------------------- AUTO CLOSE ON DESKTOP -------------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && window.history.length > 1) {
        navigate(-1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* 🔍 FLAT SEARCH HEADER */}

      <div
        className="
    flex items-center gap-5
    px-4 sm:px-6
    md:px-4
    lg:px-4
    py-5
    border-b border-white/10
  "
      >
        {/* BACK */}
        <button onClick={() => navigate(-1)} className="shrink-0 text-white/80">
          <FaArrowLeft size={18} />
        </button>

        {/* SEARCH / TEXT */}
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results.length > 0) {
                onSelectProduct(results[0]._id);
              }
            }}
            placeholder="Search for products, brands, Shop & more"
            className="
            w-full
            bg-transparent
            outline-none
            text-sm sm:text-base
            placeholder-gray-400
          "
            autoFocus
          />

          {search && (
            <button
              onClick={() => {
                setSearch("");
                setResults([]);
              }}
              className="
      absolute right-0 top-1/2
      -translate-y-1/2
      text-gray-400 hover:text-white
    "
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 md:px-8">
        {/* POPULAR + RECENT */}
        {!search && (
          <>
            <p className="text-xs text-gray-400 mt-4 mb-2">Popular Searches</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {POPULAR_KEYWORDS.map((k) => (
                <button
                  key={k}
                  onClick={() => setSearch(k)}
                  className="
                  px-3 py-1.5
                  rounded-full
                  bg-white/10
                  text-xs sm:text-sm
                "
                >
                  {k}
                </button>
              ))}
            </div>

            {recent.length > 0 && (
              <>
                <p className="text-xs text-gray-400 mb-2">Recent Searches</p>

                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => onKeywordClick(r)}
                      className="
                      px-3 py-1.5
                      rounded-full
                      bg-white/5
                      text-xs sm:text-sm
                    "
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* RESULTS */}

        {search && (
          <div className="mt-4">
            {/* ❌ OFFLINE */}
            {!isOnline && (
              <p className="text-sm text-gray-400 text-center mt-10">
                You are offline 😔
              </p>
            )}

            {/* 🦴 SKELETON */}
            {isOnline && isSearching && (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 border-b border-white/10"
                  >
                    <div className="w-10 h-10 bg-gray-700/40 rounded" />

                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-700/40 rounded w-3/4" />
                      <div className="h-3 bg-gray-700/30 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ RESULTS */}
            {!isSearching &&
              isOnline &&
              results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => onSelectProduct(item._id)}
                  className="
            flex items-center gap-3
            py-3
            border-b border-white/10
            cursor-pointer
            hover:bg-white/5
          "
                >
                  <img
                    src={item.image?.[0]}
                    className="w-10 h-10 rounded object-cover"
                    alt={item.name}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {item.category}
                    </p>
                  </div>

                  <FaChevronRight className="text-gray-400 text-[9px] shrink-0 opacity-70" />
                </div>
              ))}

            {/* 😔 EMPTY */}
            {!isSearching &&
              isOnline &&
              products.length > 0 &&
              results.length === 0 && (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No products found 😔
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
