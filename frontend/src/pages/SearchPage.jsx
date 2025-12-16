import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaChevronRight } from "react-icons/fa";

const POPULAR_KEYWORDS = [
  "Shoes",
  "T-Shirts",
  "Mobiles",
  "Headphones",
  "Watches",
];

const SearchPage = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);

  /* Load recent searches */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecent(stored);
  }, []);

  /* Search logic */
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const q = search.toLowerCase();

    const filtered = products.filter((p) =>
      [p.name, p.brandName, p.category, p.subCategory]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

    setResults(filtered);
  }, [search, products]);

  /* Save recent */
  const saveRecent = (value) => {
    let updated = [value, ...recent.filter((r) => r !== value)];
    updated = updated.slice(0, 6);
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const onSelectProduct = (id) => {
    saveRecent(search);
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    const handleResize = () => {
      // lg breakpoint (Tailwind = 1024px)
      if (window.innerWidth >= 1024) {
        navigate(-1); // go back to previous page
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
        className="flex items-center gap-5 px-4 sm:px-6 md:px-8 lg:px-12
 py-5 border-b border-white/10"
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
              onClick={() => setSearch("")}
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
                      onClick={() => setSearch(r)}
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
            {results.map((item) => (
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
                  src={item.image[0]}
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

            {results.length === 0 && (
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
