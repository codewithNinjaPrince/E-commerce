import React, { useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const Orders = () => {
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  /* 🔙 SMART BACK NAV (SKIP ADDRESS PAGE) */
  const handleBack = () => {
    const prev = location.state?.from;

    if (prev === "address") {
      navigate(-2); // skip address page
    } else {
      navigate(-1);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ================= FIXED HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          
          {/* LEFT — BACK */}
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>

          {/* CENTER — TITLE */}
          <div className="text-center">
            <h1 className="text-base sm:text-lg font-semibold">
              My Orders
            </h1>
          </div>

          {/* RIGHT — CLOSE */}
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="pt-[72px] px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, product, brand, status…"
              className="
                w-full
                bg-[#121212]
                pl-9 pr-10 py-2
                rounded-xl
                text-sm
                outline-none
                border border-white/10
                focus:border-white/30
              "
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT PLACEHOLDER ================= */}
      <div className="px-4 py-10 max-w-7xl mx-auto">
        {/* Orders list will come here later */}
      </div>
    </section>
  );
};

export default Orders;
