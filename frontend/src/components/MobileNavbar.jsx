// components/MobileNavbar.jsx
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const MobileNavbar = () => {
  const { getCartCount, navigate, token } = useContext(ShopContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  return (
    <>
      {/* TOP BAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur border-b border-white/10 h-[64px] px-4 flex items-center justify-between md:hidden">
        <button onClick={() => navigate("/")}>
          <FaHome />
        </button>

        <h1 className="font-bold">Brawvly</h1>

        <div className="flex items-center gap-3">
          <button onClick={() => (token ? navigate("/user") : navigate("/login"))}>
            <FaUser />
          </button>

          <button onClick={() => navigate("/cart")} className="relative">
            <FaShoppingCart />
            {getCartCount() > 0 && (
              <span className="absolute -right-2 -top-2 text-[10px] bg-white text-black rounded-full px-1">
                {getCartCount()}
              </span>
            )}
          </button>

          <button onClick={() => setOpen(true)}>
            <FaBars />
          </button>
        </div>
      </header>

      {/* DRAWER */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed right-0 top-0 h-full w-[80%] bg-[#111] z-50 p-5">
            <div className="flex justify-between mb-6">
              <p className="text-sm">Menu</p>
              <button onClick={() => setOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {[
                { name: "Home", path: "/" },
                { name: "Collections", path: "/collections" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((i) => (
                <NavLink
                  key={i.name}
                  to={i.path}
                  onClick={() => setOpen(false)}
                  className="py-3 px-4 bg-[#151515] rounded-xl"
                >
                  {i.name}
                </NavLink>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default MobileNavbar;
