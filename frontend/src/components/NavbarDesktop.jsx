// import React, { useContext, useRef, useState, useEffect } from "react";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa";

// const TRENDING = ["Shoes", "T-Shirts", "Mobiles", "Headphones", "Watches"];

// const NavbarDesktop = () => {
//   const { products, getCartCount, navigate, token, setToken, setCartItems } =
//     useContext(ShopContext);

//   const [searchOpen, setSearchOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [recent, setRecent] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(-1);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   const wrapperRef = useRef(null);
//   const searchRef = useRef(null);

//   /* ================= LOAD RECENT ================= */
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
//     setRecent(stored);
//   }, []);

//   /* ================= SEARCH LOGIC ================= */
//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       setActiveIndex(-1);
//       return;
//     }

//     const q = query.toLowerCase();
//     const filtered = products.filter((p) =>
//       [p.name, p.brandName, p.category, p.subCategory]
//         .join(" ")
//         .toLowerCase()
//         .includes(q)
//     );

//     setResults(filtered.slice(0, 6));
//     setActiveIndex(-1);
//   }, [query, products]);

//   /* ================= SAVE RECENT ================= */
//   const saveRecent = (value) => {
//     if (!value.trim()) return;
//     const updated = [value, ...recent.filter((r) => r !== value)].slice(0, 6);
//     localStorage.setItem("recentSearches", JSON.stringify(updated));
//     setRecent(updated);
//   };

//   /* ================= KEYBOARD NAV ================= */
//   const handleKeyDown = (e) => {
//     if (!searchOpen) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setActiveIndex((p) => (p < results.length - 1 ? p + 1 : 0));
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIndex((p) => (p > 0 ? p - 1 : results.length - 1));
//     }

//     if (e.key === "Enter" && activeIndex >= 0) {
//       const item = results[activeIndex];
//       saveRecent(query);
//       setSearchOpen(false);
//       setQuery("");
//       navigate(`/product/${item._id}`);
//     }

//     if (e.key === "Escape") setSearchOpen(false);
//   };

//   /* ================= OUTSIDE CLICK ================= */
//   useEffect(() => {
//     const handler = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   /* ================= LOGOUT ================= */
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null); // ❗ empty string nahi
//     setCartItems({});
//     setShowLogoutConfirm(false);
//     navigate("/login");
//   };

//   return (
//     <>
//       <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-[#0d0d0d] to-[#1a1a1a] border-b border-white/10 backdrop-blur-lg">
//   <div className="h-[64px] max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center gap-6">
//           {/* LOGO */}
//     <Link to="/" className="shrink-0 mr-2">
//       <img src={assets.logo} className="w-28 invert" alt="logo" />
//     </Link>

//           {/* CENTER MENU */}
//           <nav className="hidden lg:flex flex-1 justify-center">
//             <ul className="flex gap-8 text-[15px] font-light">
//               {[
//                 { name: "Home", path: "/" },
//                 { name: "Collection", path: "/collections" },
//                 { name: "About", path: "/about" },
//                 { name: "Contact", path: "/contact" },
//               ].map((item) => (
//                 <NavLink
//                   key={item.name}
//                   to={item.path}
//                   className="relative group"
//                 >
//                   {({ isActive }) => (
//                     <>
//                       <span
//                         className={`transition ${
//                           isActive
//                             ? "text-white font-medium"
//                             : "text-gray-300 hover:text-white"
//                         }`}
//                       >
//                         {item.name}
//                       </span>
//                       <span
//                         className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all ${
//                           isActive ? "w-full" : "w-0 group-hover:w-full"
//                         }`}
//                       />
//                     </>
//                   )}
//                 </NavLink>
//               ))}
//             </ul>
//           </nav>

//           {/* RIGHT SECTION */}
//           <div ref={wrapperRef} className="hidden lg:flex items-center gap-4">
//             {/* SEARCH */}
//             <div className="relative">
//               <div
//                 onClick={() => {
//                   setSearchOpen(true);
//                   setTimeout(() => searchRef.current?.focus(), 0);
//                 }}
//                 className="flex items-center bg-white/10 hover:bg-white/15 rounded-full px-4 h-9 cursor-text w-[clamp(220px,26vw,320px)]"
//               >
//                 <input
//                   ref={searchRef}
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Search for products, brands & more"
//                   className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-400"
//                 />
//                 <img
//                   src={assets.search_icon}
//                   className="w-4 invert opacity-70"
//                 />
//               </div>

//               {/* SEARCH DROPDOWN */}
//               {searchOpen && (
//                 <div className="absolute left-0 right-0 mt-3 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl p-4 z-50 max-h-[420px] overflow-y-auto cursor-pointer">
//                   {!query ? (
//                     <>
//                       {recent.length > 0 && (
//                         <>
//                           <p className="text-xs text-gray-400 mb-2">Recent</p>
//                           <div className="flex flex-wrap gap-2 mb-4 cursor-pointer">
//                             {recent.map((r) => (
//                               <button
//                                 key={r}
//                                 onClick={() => setQuery(r)}
//                                 className="px-3 py-1.5 rounded-full bg-white/10 text-xs hover:bg-white/20 cursor-pointer"
//                               >
//                                 {r}
//                               </button>
//                             ))}
//                           </div>
//                         </>
//                       )}
//                       <p className="text-xs text-gray-400 mb-2">Trending</p>
//                       <div className="flex flex-wrap gap-2">
//                         {TRENDING.map((t) => (
//                           <button
//                             key={t}
//                             onClick={() => setQuery(t)}
//                             className="px-3 py-1.5 rounded-full bg-white/5 text-xs hover:bg-white/15 cursor-pointer"
//                           >
//                             {t}
//                           </button>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       {results.map((item, idx) => (
//                         <div
//                           key={item._id}
//                           onMouseEnter={() => setActiveIndex(idx)}
//                           onClick={() => {
//                             saveRecent(query);
//                             setSearchOpen(false);
//                             setQuery("");
//                             navigate(`/product/${item._id}`);
//                           }}
//                           className={`flex items-center gap-3 py-2 px-2 rounded cursor-pointer ${
//                             idx === activeIndex
//                               ? "bg-white/10"
//                               : "hover:bg-white/5"
//                           }`}
//                         >
//                           <img
//                             src={item.image[0]}
//                             className="w-9 h-9 rounded object-cover"
//                           />
//                           <div className="min-w-0">
//                             <p className="text-sm truncate">{item.name}</p>
//                             <p className="text-xs text-gray-400 truncate">
//                               {item.category}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* ICON GROUP */}
//             <div className="flex items-center gap-3 pl-3 border-l border-white/10">
//               {/* FAVORITES */}
//               <IconButton onClick={() => navigate("/favorites")}>
//                 <FaHeart className="text-[14px]" />
//               </IconButton>

//               {/* USER DROPDOWN */}
//               <div className="relative group cursor-pointer">
//                 <IconButton>
//                   <FaUser />
//                 </IconButton>

//                 <div className="absolute right-0 pt-3 hidden group-hover:block z-50 cursor-pointer">
//                   <div className="bg-black rounded-lg shadow-xl w-40 py-2 border border-white/10 cursor-pointer">
//                     {token ? (
//                       <>
//                         <DropdownItem onClick={() => navigate("/user")}>
//                           My Profile
//                         </DropdownItem>
//                         <DropdownItem onClick={() => navigate("/orders")}>
//                           Orders
//                         </DropdownItem>
//                         <DropdownItem
//                           danger
//                           onClick={() => setShowLogoutConfirm(true)}
//                         >
//                           Logout
//                         </DropdownItem>
//                       </>
//                     ) : (
//                       <DropdownItem
//                         className="cursor-pointer"
//                         onClick={() => navigate("/login")}
//                       >
//                         Login / Sign up
//                       </DropdownItem>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* CART */}
//               <IconButton
//                 onClick={() => navigate("/cart")}
//                 badge={getCartCount()}
//               >
//                 <FaShoppingCart className="text-[14px]" />
//               </IconButton>
//             </div>
//           </div>
//         </div>
//       </header>
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
//           <div className="bg-[#111] w-[90%] max-w-sm rounded-xl border border-white/10 shadow-2xl p-6">
//             <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>

//             <p className="text-sm text-gray-400 mt-2">
//               Are you sure you want to logout?
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={logout}
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
//               >
//                 Yes, Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// /* ================= UI HELPERS ================= */

// const IconButton = ({ children, onClick, badge }) => (
//   <button
//     onClick={onClick}
//     className="relative w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition hover:scale-105 cursor-pointer"
//   >
//     <span className="text-white text-sm">{children}</span>
//     {badge > 0 && (
//       <span className="absolute -right-1 -bottom-1 w-4 h-4 text-[10px] bg-white text-black rounded-full flex items-center justify-center font-semibold">
//         {badge}
//       </span>
//     )}
//   </button>
// );

// const DropdownItem = ({ children, onClick, danger }) => (
//   <button
//     onClick={onClick}
//     className={`w-full text-left px-4 py-2 text-sm transition cursor-pointer ${
//       danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-white/10"
//     }`}
//   >
//     {children}
//   </button>
// );

// export default NavbarDesktop;

import React, { useContext, useRef, useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa";

const TRENDING = ["Shoes", "T-Shirts", "Mobiles", "Headphones", "Watches"];

const NavbarDesktop = () => {
  const {
    products,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    setFavorites,
    getFavoriteCount,
  } = useContext(ShopContext);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  /* ================= LOAD RECENT ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecent(stored);
  }, []);

  /* ================= SEARCH LOGIC ================= */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const q = query.toLowerCase();
    const filtered = products.filter((p) =>
      [p.name, p.brandName, p.category, p.subCategory]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

    setResults(filtered.slice(0, 6));
    setActiveIndex(-1);
  }, [query, products]);

  /* ================= SAVE RECENT ================= */
  const saveRecent = (value) => {
    if (!value.trim()) return;
    const updated = [value, ...recent.filter((r) => r !== value)].slice(0, 6);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecent(updated);
  };

  /* ================= KEYBOARD NAV ================= */
  const handleKeyDown = (e) => {
    if (!searchOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => (p < results.length - 1 ? p + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => (p > 0 ? p - 1 : results.length - 1));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      const item = results[activeIndex];
      saveRecent(query);
      setSearchOpen(false);
      setQuery("");
      navigate(`/product/${item._id}`);
    }

    if (e.key === "Escape") setSearchOpen(false);
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!token) {
      setShowLogoutConfirm(false);
    }
  }, [token]);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setShowLogoutConfirm(false);
    setToken("");
    setCartItems({});
    setFavorites([]);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-[#0d0d0d] to-[#1a1a1a] border-b border-white/10 backdrop-blur-lg">
        <div className="h-[64px] max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center gap-8">
          {/* LOGO */}
          <Link to="/" className="shrink-0">
            <img src={assets.logo} className="w-28 invert" alt="logo" />
          </Link>

          {/* CENTER MENU */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-8 text-[15px] font-light">
              {[
                { name: "Home", path: "/" },
                { name: "Collection", path: "/collections" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="relative group"
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`transition ${
                          isActive
                            ? "text-white font-medium"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </ul>
          </nav>

          {/* RIGHT SECTION */}
          <div ref={wrapperRef} className="hidden lg:flex items-center gap-6">
            {/* SEARCH */}
            <div className="relative">
              <div
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchRef.current?.focus(), 0);
                }}
                className="flex items-center bg-white/10 hover:bg-white/15 rounded-full px-4 h-9 cursor-text
                           w-[clamp(260px,32vw,460px)]"
              >
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products, brands & more"
                  className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-400"
                />
                <img
                  src={assets.search_icon}
                  className="w-4 invert opacity-70"
                />
              </div>

              {/* SEARCH DROPDOWN */}
              {searchOpen && (
                <div className="absolute left-0 right-0 mt-3 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl p-4 z-50 max-h-[420px] overflow-y-auto z-">
                  {!query ? (
                    <>
                      {recent.length > 0 && (
                        <>
                          <p className="text-xs text-gray-400 mb-2">Recent</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {recent.map((r) => (
                              <button
                                key={r}
                                onClick={() => setQuery(r)}
                                className="px-3 py-1.5 rounded-full bg-white/10 text-xs hover:bg-white/20"
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      <p className="text-xs text-gray-400 mb-2">Trending</p>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING.map((t) => (
                          <button
                            key={t}
                            onClick={() => setQuery(t)}
                            className="px-3 py-1.5 rounded-full bg-white/5 text-xs hover:bg-white/15"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {results.map((item, idx) => (
                        <div
                          key={item._id}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => {
                            saveRecent(query);
                            setSearchOpen(false);
                            setQuery("");
                            navigate(`/product/${item._id}`);
                          }}
                          className={`flex items-center gap-3 py-2 px-2 rounded cursor-pointer ${
                            idx === activeIndex
                              ? "bg-white/10"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <img
                            src={item.image[0]}
                            className="w-9 h-9 rounded object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-sm truncate">{item.name}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ICON GROUP */}
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <IconButton
                onClick={() => navigate("/favorites")}
                badge={token ? getFavoriteCount() : 0}
              >
                <FaHeart />
              </IconButton>

              <div className="relative group">
                <IconButton>
                  <FaUser />
                </IconButton>

                <div className="absolute right-0 pt-3 hidden group-hover:block z-50 cursor-pointer">
                  <div className="bg-black rounded-lg shadow-xl w-40 py-2 border border-white/10 cursor-pointer">
                    {token ? (
                      <>
                        <DropdownItem onClick={() => navigate("/user")}>
                          My Profile
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate("/orders")}>
                          Orders
                        </DropdownItem>
                        <DropdownItem
                          danger
                          onClick={() => setShowLogoutConfirm(true)}
                        >
                          Logout
                        </DropdownItem>
                      </>
                    ) : (
                      <DropdownItem onClick={() => navigate("/login")}>
                        Login / Sign up
                      </DropdownItem>
                    )}
                  </div>
                </div>
              </div>

              <IconButton
                onClick={() => navigate("/cart")}
                badge={getCartCount()}
              >
                <FaShoppingCart className="text-[14px]" />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111] w-[90%] max-w-sm rounded-xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
            <p className="text-sm text-gray-400 mt-2">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
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

/* ================= UI HELPERS ================= */

const IconButton = ({ children, onClick, badge }) => (
  <button
    onClick={onClick}
    className="relative w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition hover:scale-105 cursor-pointer"
  >
    <span className="text-white text-sm">{children}</span>
    {badge > 0 && (
      <span className="absolute -right-1 -bottom-1 w-4 h-4 text-[10px] bg-white text-black rounded-full flex items-center justify-center font-semibold">
        {badge}
      </span>
    )}
  </button>
);

const DropdownItem = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm transition cursor-pointer ${
      danger
        ? "text-red-400 hover:bg-red-500/10 cursor-pointer"
        : "hover:bg-white/10 cursor-pointer"
    }`}
  >
    {children}
  </button>
);

export default NavbarDesktop;
