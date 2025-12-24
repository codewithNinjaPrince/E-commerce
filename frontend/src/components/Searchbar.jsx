import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Searchbar = ({ showNavbar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 common box style (same for both)
  const boxStyle = `
    h-[48px]
    flex items-center
    bg-[#151515]
    border border-white/10
    rounded-xl
    px-4
    transition
    hover:border-white/30
    hover:bg-[#1a1a1a]
    active:scale-[0.98]
  `;

  return (
    <div
      className={`
        fixed w-full z-40
        bg-black/90 backdrop-blur-md
        border-b border-white/10
        px-2 py-2
        transition-all duration-300
        ${showNavbar ? "top-[64px]" : "top-0"}
      `}
    >
      <div className="mx-auto flex items-center gap-2 sm:gap-3 lg:px-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className={`${boxStyle} justify-center w-[48px] text-gray-300 hover:text-white`}
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
          className={`${boxStyle} flex-1 cursor-text`}
        >
          <p className="text-sm text-gray-400">
            Search products, brands and more...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
