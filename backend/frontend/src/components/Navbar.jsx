import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if click happens outside of dropdownRef
  useEffect(() => {
    const handleClickOutside = (e) => {
      // if dropdownRef is present and click target is outside -> close
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const logout = () => {
    // perform logout actions
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex justify-between py-5 font-medium">
        <Link to="/">
          <img src={assets.logo} className="w-36" alt="Logo" />
        </Link>

        <ul className="hidden sm:flex gap-5 text-lg text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>Home</p>
          </NavLink>
          <NavLink
            to="/collections"
            className="flex flex-col items-center gap-1"
          >
            <p>Collection</p>
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>About</p>
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>Contact</p>
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <img
            onClick={() => {
              setShowSearch(true);
              navigate("/collections");
            }}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search icon"
          />

          {/* PROFILE + DROPDOWN (MODIFIED LOGIC) */}
          <div
            ref={dropdownRef}
            className="relative group" /* <- important: enables sm:group-hover */
          >
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt="profile"
              onClick={(e) => {
                e.stopPropagation(); // prevent document click from immediately closing dropdown

                // If not logged in, clicking GOES TO LOGIN immediately (regardless of screen size)
                if (!token) {
                  navigate("/login");
                  return;
                }

                // If logged in:
                // Mobile behaviour: toggle dropdown on small screens
                if (window.innerWidth < 640) {
                  setDropdownOpen((prev) => !prev);
                }
                // On desktop, clicking the icon does nothing (hover controls it, or already navigated)
              }}
            />

            {/* Dropdown - Renders always. Visibility is controlled by CSS/State */}
            <div
              className={`absolute right-0 pt-4 z-30 ${
                // Mobile click dropdownOpen is only relevant when logged in
                dropdownOpen && token ? "block" : "hidden"
              } sm:group-hover:block`}
            >
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow-md">
                {token ? (
                  // === LOGGED IN STATE ===
                  <>
                    <p
                      className="cursor-pointer hover:text-black"
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => {
                        navigate("/orders");
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer hover:text-black"
                    >
                      Orders
                    </p>
                    <p
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Logout
                    </p>
                  </>
                ) : (
                  // === LOGGED OUT STATE (Desktop Hover or Mobile Click) ===
                  <>
                    <p
                      className="w-40 cursor-pointer text-base font-semibold hover:text-black"
                      onClick={() => {
                        navigate("/login");
                        setDropdownOpen(false);
                      }}
                    >
                      Log In / Sign Up
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="menu icon"
          />
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed top-0 right-0 h-full z-40 bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white transform transition-transform duration-300 ${
            visible ? "translate-x-0" : "translate-x-full"
          } w-[85%] sm:hidden`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-2xl font-bold tracking-wide">
                Brawvly<span className="text-blue-400">.</span>
              </h2>

              <button onClick={() => setVisible(false)}>
                <img
                  src={assets.cross_icon}
                  className="h-5 rotate-180 invert"
                />
              </button>
            </div>

            {/* Tagline */}
            <p className="text-sm text-gray-400 px-5 mt-2">
              Where style meets attitude 🖤
            </p>

            {/* ===== MAIN MENU ===== */}
            <div className="flex flex-col mt-8 space-y-4 px-5">
              {[
                { name: "Home", path: "/", icon: "🏠" },
                { name: "Collections", path: "/collections", icon: "🛍️" },
                { name: "About Brawvly", path: "/about", icon: "📖" },
                { name: "Contact Us", path: "/contact", icon: "📞" },
              ].map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={() => setVisible(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-md ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-pink-500/20 border border-white/20 shadow-lg scale-[1.03]"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span className="font-medium tracking-wide">{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* ===== LEGAL & SUPPORT ===== */}
            <div className="mt-10 px-5">
              <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
                Legal & Support
              </h3>

              <div className="flex flex-col space-y-3">
                {[
                  {
                    name: "Privacy Policy",
                    path: "/privacy-policy",
                    icon: "🔐",
                  },
                  {
                    name: "Terms & Conditions",
                    path: "/terms-conditions",
                    icon: "📜",
                  },
                  {
                    name: "Shipping & Delivery",
                    path: "/shipping-delivery",
                    icon: "🚚",
                  },
                  {
                    name: "Refund & Return",
                    path: "/refund-return",
                    icon: "🔁",
                  },
                ].map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={() => setVisible(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-md ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-pink-500/20 border border-white/20 shadow-md scale-[1.02]"
                          : "border border-white/10 text-gray-300 hover:bg-white/10"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto p-5 border-t border-white/10 text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Brawvly
              <p className="text-xs mt-1">Crafted with style ✨</p>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Are you sure you want to logout?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You will need to login again to access your account.
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2 border rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                No
              </button>

              <button
                onClick={logout}
                className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
