// import React, { useContext, useState, useRef, useEffect } from "react";
// import { assets } from "../assets/assets";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";

// const Navbar = () => {
//   const [visible, setVisible] = useState(false);
//   const {
//     setShowSearch,
//     getCartCount,
//     navigate,
//     token,
//     setToken,
//     setCartItems,
//   } = useContext(ShopContext);

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [showProfileMaintenance, setShowProfileMaintenance] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     setCartItems({});
//     setShowLogoutConfirm(false);
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* TOP NAVBAR */}
//       <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-[#0d0d0d] to-[#1a1a1a] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex justify-between items-center py-4 border-b border-white/10 backdrop-blur-lg shadow-[0_5px_25px_rgba(255,255,255,0.06)]">
//         <Link to="/">
//           <img
//             src={assets.logo}
//             className="w-36 invert brightness-100"
//             alt="Logo"
//           />
//         </Link>

//         {/* DESKTOP MENU */}
//         <ul className="hidden sm:flex gap-8 text-white text-[17px] font-light">
//           {[
//             { name: "Home", path: "/" },
//             { name: "Collection", path: "/collections" },
//             { name: "About", path: "/about" },
//             { name: "Contact", path: "/contact" },
//           ].map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               className="relative pb-1 group transition"
//             >
//               {({ isActive }) => (
//                 <>
//                   <span
//                     className={`${
//                       isActive ? "text-white" : "text-gray-300 hover:text-white"
//                     } transition`}
//                   >
//                     {item.name}
//                   </span>
//                   <span
//                     className={`
//                       absolute left-0 bottom-[-4px] h-[2px] bg-white rounded-full
//                       transition-all duration-200 ease-out
//                       ${
//                         isActive
//                           ? "w-full opacity-100"
//                           : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
//                       }
//                     `}
//                   ></span>
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </ul>

//         {/* RIGHT SIDE ICONS */}
//         <div className="flex items-center gap-6 text-white">
//           {/* SEARCH */}
// <div
//   onClick={() => navigate("/search", { state: { from: "/" } })}
//   className="
//     hidden sm:flex
//     items-center
//     bg-white/10
//     hover:bg-white/15
//     transition
//     rounded-full
//     px-4
//     h-10
//     w-[280px] md:w-[360px] lg:w-[420px]
//     cursor-text
//   "
// >
//   <input
//     type="text"
//     placeholder="Search for products, brands & more"
//     className="
//       bg-transparent
//       outline-none
//       text-sm
//       text-white
//       placeholder-gray-400
//       w-full
//       cursor-text
//     "
//     onFocus={() =>
//       navigate("/search", { state: { from: "/" } })
//     }
//     readOnly
//   />

//   <img
//     src={assets.search_icon}
//     className="w-4 invert opacity-70"
//     alt="search"
//   />
// </div>


//           {/* PROFILE + DROPDOWN */}
//           <div ref={dropdownRef} className="relative group">
//             <img
//               src={assets.profile_icon}
//               className="w-5 cursor-pointer invert brightness-50"
//               alt="profile"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (!token) {
//                   navigate("/login");
//                   return;
//                 }
//                 if (window.innerWidth < 640) {
//                   setDropdownOpen((prev) => !prev);
//                 }
//               }}
//             />

//             {/* DROPDOWN */}
//             <div
//               className={`absolute right-0 pt-4 z-50 ${
//                 dropdownOpen && token ? "block" : "hidden"
//               } sm:group-hover:block`}
//             >
//               <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-black text-white rounded shadow-md">
//                 {token ? (
//                   <>
//                     {/* My Profile — Now shows Maintenance UI */}
//                     <p
//                       className="cursor-pointer hover:text-gray-300"
//                       onClick={() => {
//                         setDropdownOpen(false);
//                         setShowProfileMaintenance(true); // NEW: open maintenance modal
//                       }}
//                     >
//                       My Profile
//                     </p>

//                     {/* Orders */}
//                     <p
//                       onClick={() => {
//                         navigate("/orders");
//                         setDropdownOpen(false);
//                       }}
//                       className="cursor-pointer hover:text-gray-300"
//                     >
//                       Orders
//                     </p>

//                     {/* Logout */}
//                     <p
//                       className="cursor-pointer hover:text-red-400"
//                       onClick={() => {
//                         setShowLogoutConfirm(true);
//                         setDropdownOpen(false);
//                       }}
//                     >
//                       Logout
//                     </p>
//                   </>
//                 ) : (
//                   <p
//                     className="w-40 cursor-pointer hover:text-gray-300"
//                     onClick={() => {
//                       navigate("/login");
//                       setDropdownOpen(false);
//                     }}
//                   >
//                     Log In / Sign Up
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* CART */}
//           <Link to="/cart" className="relative">
//             <img
//               src={assets.cart_icon}
//               className="w-5 min-w-5 invert brightness-50"
//               alt="Cart"
//             />
//             <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-white text-black aspect-square rounded-full text-[8px]">
//               {getCartCount()}
//             </p>
//           </Link>

//           {/* MOBILE MENU BUTTON */}
//           <img
//             onClick={() => setVisible(true)}
//             src={assets.menu_icon}
//             className="w-5 cursor-pointer invert brightness-50 sm:hidden"
//             alt="menu icon"
//           />
//         </div>
//       </div>

//       {/* 🌟🌟 FIXED FULLSCREEN MOBILE MENU (NEW) 🌟🌟 */}
//       {visible && (
//         <div
//           className="fixed inset-0 z-[999] bg-gradient-to-b from-black via-[#0c0c0c] to-[#111] text-white
//                      w-[85%] ml-auto sm:hidden transform transition-transform duration-300"
//           style={{
//             transform: visible ? "translateX(0)" : "translateX(100%)",
//           }}
//         >
//           <div className="flex flex-col h-full overflow-y-auto">
//             {/* Header */}
//             <div className="flex items-center justify-between p-5 border-b border-white/10">
//               <h2 className="text-2xl font-bold tracking-wide">Brawvly</h2>

//               <button onClick={() => setVisible(false)}>
//                 <img
//                   src={assets.cross_icon}
//                   className="h-5 rotate-180 invert"
//                 />
//               </button>
//             </div>

//             {/* Tagline */}
//             <p className="text-sm text-gray-400 px-5 mt-2">
//               Where style meets attitude 🖤
//             </p>

//             {/* MAIN MENU */}
//             <div className="flex flex-col mt-8 space-y-4 px-5">
//               {[
//                 { name: "Home", path: "/", icon: "🏠" },
//                 { name: "Collections", path: "/collections", icon: "🛍️" },
//                 { name: "About Brawvly", path: "/about", icon: "📖" },
//                 { name: "Contact Us", path: "/contact", icon: "📞" },
//               ].map((item, index) => (
//                 <NavLink
//                   key={index}
//                   to={item.path}
//                   onClick={() => setVisible(false)}
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300
//                     ${
//                       isActive
//                         ? "bg-[#1f1f1f] border border-white/10 shadow-lg scale-[1.03]"
//                         : "bg-[#121212] border border-white/10 hover:bg-[#1a1a1a]"
//                     }`
//                   }
//                 >
//                   <span>{item.icon}</span>
//                   <span className="font-medium tracking-wide">{item.name}</span>
//                 </NavLink>
//               ))}
//             </div>

//             {/* ===== LEGAL & SUPPORT ===== */}
//             <div className="mt-10 px-5">
//               <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
//                 Legal & Support
//               </h3>
//               <div className="flex flex-col mt-8 space-y-4 px-5">
//                 {[
//                   { name: "Home", path: "/", icon: "🏠" },
//                   { name: "Collections", path: "/collections", icon: "🛍️" },
//                   { name: "About Brawvly", path: "/about", icon: "📖" },
//                   { name: "Contact Us", path: "/contact", icon: "📞" },
//                 ].map((item, index) => (
//                   <NavLink
//                     key={index}
//                     to={item.path}
//                     onClick={() => setVisible(false)}
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300
//           ${
//             isActive
//               ? "bg-[#1f1f1f] border border-white/10 shadow-lg scale-[1.03]"
//               : "bg-[#121212] border border-white/10 hover:bg-[#1a1a1a]"
//           }`
//                     }
//                   >
//                     <span>{item.icon}</span>
//                     <span className="font-medium tracking-wide">
//                       {item.name}
//                     </span>
//                   </NavLink>
//                 ))}
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="mt-auto p-5 border-t border-white/10 text-center text-sm text-gray-400">
//               © {new Date().getFullYear()} Brawvly
//               <p className="text-xs mt-1">Crafted with style ✨</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {showProfileMaintenance && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
//           <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center border border-white/10">
//             <h2 className="text-xl font-semibold text-white mb-3">
//               🛠️ Page Under Maintenance
//             </h2>

//             <p className="text-gray-400 text-sm mb-6">
//               We are upgrading this section to improve your experience.
//               <br />
//               Please check back soon! ✨
//             </p>

//             <button
//               onClick={() => setShowProfileMaintenance(false)}
//               className="px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition cursor-pointer"
//             >
//               Okay
//             </button>
//           </div>
//         </div>
//       )}

//       {/* LOGOUT CONFIRMATION MODAL */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
//           <div className="bg-gray-700 p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
//             <h2 className="text-lg font-semibold text-white mb-3">
//               Are you sure you want to logout?
//             </h2>
//             <p className="text-white text-sm mb-6">
//               You will need to login again to access your account.
//             </p>

//             <div className="flex justify-center gap-6">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="px-5 py-2 border bg-black text-white rounded-md hover:bg-white hover:text-black transition cursor-pointer"
//               >
//                 No
//               </button>

//               <button
//                 onClick={logout}
//                 className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
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

// export default Navbar;

// import React, { useContext, useRef, useState, useEffect } from "react";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";

// const TRENDING = ["Shoes", "T-Shirts", "Mobiles", "Headphones", "Watches"];

// const NavbarDesktop = () => {
//   const {
//     products,
//     getCartCount,
//     navigate,
//     token,
//     setToken,
//     setCartItems,
//   } = useContext(ShopContext);

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [recent, setRecent] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(-1);

//   const dropdownRef = useRef(null);
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
//       setActiveIndex((prev) =>
//         prev < results.length - 1 ? prev + 1 : 0
//       );
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIndex((prev) =>
//         prev > 0 ? prev - 1 : results.length - 1
//       );
//     }

//     if (e.key === "Enter" && activeIndex >= 0) {
//       const item = results[activeIndex];
//       saveRecent(query);
//       setSearchOpen(false);
//       setQuery("");
//       navigate(`/product/${item._id}`);
//     }

//     if (e.key === "Escape") {
//       setSearchOpen(false);
//     }
//   };

//   /* ================= OUTSIDE CLICK ================= */
//   useEffect(() => {
//     const handler = (e) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target)
//       ) {
//         setDropdownOpen(false);
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   /* ================= LOGOUT ================= */
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     setCartItems({});
//     navigate("/login");
//   };

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-[#0d0d0d] to-[#1a1a1a] border-b border-white/10 backdrop-blur-lg">
// <div className="h-[72px] max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 flex items-center gap-6">

//         {/* LOGO */}
//         <Link to="/" className="shrink-0">
//           <img src={assets.logo} className="w-36 invert" alt="logo" />
//         </Link>

//         {/* MENU */}
//         <nav className="hidden sm:flex flex-1 justify-center">
//           <ul className="flex gap-8 text-[17px] font-light">
//             {[
//               { name: "Home", path: "/" },
//               { name: "Collection", path: "/collections" },
//               { name: "About", path: "/about" },
//               { name: "Contact", path: "/contact" },
//             ].map((item) => (
//               <NavLink key={item.name} to={item.path} className="relative pb-1 group">
//                 {({ isActive }) => (
//                   <>
//                     <span className={isActive ? "text-white" : "text-gray-300 hover:text-white"}>
//                       {item.name}
//                     </span>
//                     <span className={`absolute left-0 bottom-[-4px] h-[2px] bg-white transition-all ${
//                       isActive ? "w-full" : "w-0 group-hover:w-full"
//                     }`} />
//                   </>
//                 )}
//               </NavLink>
//             ))}
//           </ul>
//         </nav>

//         {/* RIGHT */}
//         <div className="flex items-center gap-5" ref={dropdownRef}>

//           {/* SEARCH */}
//           <div className="relative">
//             <div
//               onClick={() => {
//                 setSearchOpen(true);
//                 setTimeout(() => searchRef.current?.focus(), 0);
//               }}
//               className="hidden sm:flex items-center bg-white/10 hover:bg-white/15 rounded-full px-4 h-10 w-[clamp(220px,32vw,360px)] cursor-text"
//             >
//               <input
//                 ref={searchRef}
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Search for products, brands & more"
//                 className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-400"
//               />
//               <img src={assets.search_icon} className="w-4 invert opacity-70" />
//             </div>

//             {/* DROPDOWN */}
//             {searchOpen && (
//               <div className="absolute left-0 right-0 mt-3 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl p-4 z-50 max-h-[420px] overflow-y-auto">

//                 {!query && (
//                   <>
//                     {recent.length > 0 && (
//                       <>
//                         <p className="text-xs text-gray-400 mb-2">Recent Searches</p>
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {recent.map((r) => (
//                             <button
//                               key={r}
//                               onClick={() => setQuery(r)}
//                               className="px-3 py-1.5 rounded-full bg-white/10 text-xs hover:bg-white/20"
//                             >
//                               {r}
//                             </button>
//                           ))}
//                         </div>
//                       </>
//                     )}

//                     <p className="text-xs text-gray-400 mb-2">Trending</p>
//                     <div className="flex flex-wrap gap-2">
//                       {TRENDING.map((t) => (
//                         <button
//                           key={t}
//                           onClick={() => setQuery(t)}
//                           className="px-3 py-1.5 rounded-full bg-white/5 text-xs hover:bg-white/15"
//                         >
//                           {t}
//                         </button>
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 {query && (
//                   <>
//                     {results.map((item, idx) => (
//                       <div
//                         key={item._id}
//                         onMouseEnter={() => setActiveIndex(idx)}
//                         onClick={() => {
//                           saveRecent(query);
//                           setSearchOpen(false);
//                           setQuery("");
//                           navigate(`/product/${item._id}`);
//                         }}
//                         className={`flex items-center gap-3 py-2 px-2 rounded cursor-pointer ${
//                           idx === activeIndex
//                             ? "bg-white/10"
//                             : "hover:bg-white/5"
//                         }`}
//                       >
//                         <img
//                           src={item.image[0]}
//                           className="w-9 h-9 rounded object-cover"
//                         />
//                         <div className="min-w-0">
//                           <p className="text-sm truncate">{item.name}</p>
//                           <p className="text-xs text-gray-400 truncate">
//                             {item.category}
//                           </p>
//                         </div>
//                       </div>
//                     ))}

//                     {results.length === 0 && (
//                       <p className="text-sm text-gray-400 text-center mt-6">
//                         No products found 😔
//                       </p>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* PROFILE */}
//           <img
//             src={assets.profile_icon}
//             className="w-5 invert cursor-pointer"
//             onClick={() => (!token ? navigate("/login") : setDropdownOpen(!dropdownOpen))}
//           />

//           {/* CART */}
//           <Link to="/cart" className="relative">
//             <img src={assets.cart_icon} className="w-5 invert" />
//             <span className="absolute -right-1 -bottom-1 w-4 h-4 bg-white text-black text-[10px] rounded-full flex items-center justify-center">
//               {getCartCount()}
//             </span>
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default NavbarDesktop;

import React, { useContext, useRef, useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { FaUser, FaShoppingCart } from "react-icons/fa";

const TRENDING = ["Shoes", "T-Shirts", "Mobiles", "Headphones", "Watches"];

const NavbarDesktop = () => {
  const {
    products,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
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

  /* ================= LOGOUT ================= */
  const logout = () => {
  localStorage.removeItem("token");
  setToken(null);          // ❗ empty string nahi
  setCartItems({});
  setShowLogoutConfirm(false);
  navigate("/login");
};


  return (
   <>
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-[#0d0d0d] to-[#1a1a1a] border-b border-white/10 backdrop-blur-lg">
      <div className="h-[72px] max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 flex items-center gap-6">

        {/* LOGO */}
        <Link to="/" className="shrink-0">
          <img src={assets.logo} className="w-36 invert" alt="logo" />
        </Link>

        {/* MENU */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex gap-8 text-[16px] font-light">
            {[
              { name: "Home", path: "/" },
              { name: "Collection", path: "/collections" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <NavLink key={item.name} to={item.path} className="relative group">
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-white" : "text-gray-300 hover:text-white"}>
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
        <div ref={wrapperRef} className="flex items-center gap-3">

          {/* SEARCH */}
          <div className="relative hidden lg:block">
            <div
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchRef.current?.focus(), 0);
              }}
              className="flex items-center bg-white/10 hover:bg-white/15 rounded-full px-4 h-10 cursor-text w-[clamp(240px,30vw,360px)]"
            >
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for products, brands & more"
                className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-400"
              />
              <img src={assets.search_icon} className="w-4 invert opacity-70" />
            </div>

            {/* SEARCH DROPDOWN */}
            {searchOpen && (
              <div className="absolute left-0 right-0 mt-3 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl p-4 z-50 max-h-[420px] overflow-y-auto">
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
                          idx === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <img src={item.image[0]} className="w-9 h-9 rounded object-cover" />
                        <div className="min-w-0">
                          <p className="text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 truncate">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* USER DROPDOWN */}
          <div className="relative group cursor-pointer">
            <IconButton>
              <FaUser />
            </IconButton>

            <div className="absolute right-0 pt-3 hidden group-hover:block z-50 cursor-pointer">
              <div className="bg-black rounded-lg shadow-xl w-40 py-2 border border-white/10 cursor-pointer">
                {token ? (
                  <>
                    <DropdownItem onClick={() => navigate("/user")}>My Profile</DropdownItem>
                    <DropdownItem onClick={() => navigate("/orders")}>Orders</DropdownItem>
<DropdownItem danger onClick={() => setShowLogoutConfirm(true)}>
  Logout
</DropdownItem>
                  </>
                ) : (
                  <DropdownItem className="cursor-pointer" onClick={() => navigate("/login")}>
                    Login / Sign up
                  </DropdownItem>
                )}
              </div>
            </div>
          </div>

          {/* CART */}
          <IconButton onClick={() => navigate("/cart")} badge={getCartCount()}>
            <FaShoppingCart />
          </IconButton>
        </div>
      </div>
    </header>
    {showLogoutConfirm && (
  <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-[#111] w-[90%] max-w-sm rounded-xl border border-white/10 shadow-2xl p-6">
      
      <h3 className="text-lg font-semibold text-white">
        Confirm Logout
      </h3>

      <p className="text-sm text-gray-400 mt-2">
        Are you sure you want to logout?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowLogoutConfirm(false)}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
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
    className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition hover:scale-105 cursor-pointer"
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
      danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-white/10"
    }`}
  >
    {children}
  </button>
);

export default NavbarDesktop;
