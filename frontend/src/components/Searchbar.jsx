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
        px-2 py-2
        transition-all duration-300
        ${showNavbar ? "top-[64px]" : "top-0"}
      `}
    >
      <div className="max-w-3xl mx-auto">
        <div
          onClick={() =>
            navigate("/search", {
              state: { from: location.pathname },
            })
          }
          className="
      flex items-center gap-3
      bg-[#151515] border border-white/10
      rounded-xl px-4 py-3
      cursor-text
    "
        >
          <p className="text-sm text-gray-400">
            Search products, brands, categories...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
