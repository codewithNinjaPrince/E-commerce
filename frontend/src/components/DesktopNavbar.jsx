// components/DesktopNavbar.jsx
import React, { useContext } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const DesktopNavbar = () => {
  const { getCartCount, token } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="hidden md:block fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-[#0d0d0d] to-[#1a1a1a] border-b border-white/10 backdrop-blur">
      <div className="h-[72px] px-[7vw] flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          Brawvly
        </Link>

        <ul className="flex gap-8">
          {["/", "/collections", "/about", "/contact"].map((path, i) => (
            <NavLink key={i} to={path}>
              {({ isActive }) => (
                <span className={isActive ? "text-white" : "text-gray-400"}>
                  {path === "/" ? "Home" : path.replace("/", "")}
                </span>
              )}
            </NavLink>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          {/* SEARCH */}
          <div
            onClick={() =>
              navigate("/search", { state: { from: location.pathname } })
            }
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full cursor-pointer"
          >
            <img src={assets.search_icon} className="w-4 invert" />
            <span className="text-sm text-gray-300">Search</span>
          </div>

          <Link to="/cart" className="relative">
            🛒
            {getCartCount() > 0 && (
              <span className="absolute -right-2 -top-2 bg-white text-black text-xs rounded-full px-1">
                {getCartCount()}
              </span>
            )}
          </Link>

          <button onClick={() => navigate(token ? "/user" : "/login")}>
            👤
          </button>
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
