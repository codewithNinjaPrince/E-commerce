import React from "react";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const Searchbar = ({ showNavbar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`
        fixed w-full z-40
        bg-black/90 backdrop-blur-md
        border-b border-white/10
        px-1 py-1
        transition-all duration-300
        ${showNavbar ? "top-[64px]" : "top-0"}
      `}
    >
      <div className="mx-auto flex items-center gap-2 sm:gap-3 md:gap-4 sm:px-2 md:px-3 lg:px-8">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="
            flex items-center justify-center
            w-10 h-10
            rounded-lg
            bg-[#151515]
            border border-white/10
            text-white
            hover:bg-white hover:text-black
            transition
            cursor-pointer
          "
          aria-label="Go back"
        >
          ←
        </button>

        {/* SEARCH BAR */}
        <div
          onClick={() =>
            navigate("/search", {
              state: { from: location.pathname },
            })
          }
          className="
            flex-1
            flex items-center gap-3
            bg-[#151515]
            border border-white/10
            rounded-xl px-4 py-3
            cursor-text
            hover:border-white/30
            transition
          "
        >
          <p className="text-sm text-gray-400">
            Search products, brands, categories and more...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
