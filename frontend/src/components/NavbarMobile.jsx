import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = ({ showNavbar }) => {
  const { getCartCount, navigate, token } = useContext(ShopContext);
  const [open, setOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Friend";

  /* 🔒 Lock scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          bg-black/80 backdrop-blur-xl
          border-b border-white/10
          h-[64px] px-4 sm:px-[5vw]
          flex items-center justify-between
          transition-transform duration-300
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* LEFT */}
        <div className="flex items-center gap-4 cursor-pointer">
          <IconButton onClick={() => navigate("/")}>
            <FaHome />
          </IconButton>

          <Link
            to="/"
            className="text-lg sm:text-xl font-bold
              bg-gradient-to-r from-white to-gray-400
              bg-clip-text text-transparent"
          >
            Brawvly
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <IconButton
            onClick={() => (token ? navigate("/user") : navigate("/login"))}
          >
            <FaUser />
          </IconButton>

          <IconButton onClick={() => navigate("/cart")} badge={getCartCount()}>
            <FaShoppingCart />
          </IconButton>

          {/* HAMBURGER */}
          <IconButton onClick={() => setOpen(true)}>
            <FaBars />
          </IconButton>
        </div>
      </header>

      {/* ================= BACKDROP ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= DRAWER ================= */}
      <aside
        className={`
          fixed top-0 right-0 h-full z-50
          w-[85%] sm:w-[60%]
          bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#111]
          transform transition-transform duration-500 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="h-[64px] px-5 flex items-center justify-between border-b border-white/10">
          <p className="text-sm text-gray-300">
            Hey {token ? userName : "Guest"} 👋
          </p>

          <button
            onClick={() => setOpen(false)}
            className="
              w-9 h-9 rounded-full
              bg-white/10 hover:bg-white/20
              flex items-center justify-center
              transition
            "
          >
            <FaTimes className="text-white text-sm" />
          </button>
        </div>

        {/* NAV */}
        <nav className="px-5 py-8 flex flex-col gap-4">
          {[
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                  py-3 px-4 rounded-xl font-medium
                  transition
                  ${
                    isActive
                      ? "bg-white text-black"
                      : "bg-[#151515] hover:bg-[#1f1f1f]"
                  }
                `
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

/* ================= ICON BUTTON ================= */
const IconButton = ({ children, onClick, badge }) => (
  <button
    onClick={onClick}
    className="
      relative w-9 h-9 rounded-full
      flex items-center justify-center
      bg-white/10 hover:bg-white/20
      transition hover:scale-105
    "
  >
    <span className="text-white text-sm">{children}</span>
    {badge > 0 && (
      <span className="absolute -right-1 -bottom-1 w-4 h-4 text-[10px] bg-white text-black rounded-full flex items-center justify-center font-semibold">
        {badge}
      </span>
    )}
  </button>
);

export default Navbar;



