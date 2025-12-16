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
//           <img
//             onClick={() => {
//               setShowSearch(true);
//               navigate("/collections");
//             }}
//             src={assets.search_icon}
//             className="w-5 invert brightness-50 cursor-pointer"
//             alt="Search icon"
//           />

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

// import React, { useContext, useState, useEffect } from "react";
// import { assets } from "../assets/assets";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";

// const Navbar = () => {
//   const { getCartCount, navigate, token } = useContext(ShopContext);
//   const [open, setOpen] = useState(false);

//   const userName = localStorage.getItem("userName") || "Friend";

//   // 🔒 Lock body scroll when drawer is open
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "auto";
//     return () => (document.body.style.overflow = "auto");
//   }, [open]);

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <header
//         className="
//           fixed top-0 left-0 w-full z-50
//           bg-black/90 backdrop-blur-md
//           border-b border-white/10
//           px-4 sm:px-[5vw]
//           h-[64px]
//           flex items-center justify-between
//         "
//       >
//         {/* BRAND */}
//         <Link
//           to="/"
//           className="text-lg sm:text-xl font-bold tracking-wide select-none"
//         >
//           Brawvly
//         </Link>

//         {/* RIGHT ICONS */}
//         <div className="flex items-center gap-5">
//           {/* USER ICON (NO NAVIGATION) */}
//           <img
//             src={assets.profile_icon}
//             className="w-5 invert opacity-70 cursor-pointer"
//             alt="user"
//             onClick={() => {
//               if (token) {
//                 navigate("/user");
//               } else {
//                 navigate("/login");
//               }
//             }}
//           />

//           {/* CART */}
//           <Link to="/cart" className="relative">
//             <img
//               src={assets.cart_icon}
//               className="w-5 invert opacity-70"
//               alt="cart"
//             />
//             <span
//               className="
//                 absolute -right-2 -bottom-2
//                 w-4 h-4 text-[10px]
//                 bg-white text-black
//                 rounded-full
//                 flex items-center justify-center
//               "
//             >
//               {getCartCount()}
//             </span>
//           </Link>

//           {/* HAMBURGER */}
//           <img
//             src={assets.menu_icon}
//             className="w-5 invert cursor-pointer"
//             onClick={() => setOpen(true)}
//             alt="menu"
//           />
//         </div>
//       </header>

//       {/* ================= BACKDROP ================= */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* ================= SIDE DRAWER ================= */}
//       <aside
//         className={`
//           fixed top-0 right-0 h-full z-50
//           bg-gradient-to-b from-black via-[#0c0c0c] to-[#111]
//           w-[80%] sm:w-[60%]
//           transform transition-transform duration-500 ease-out
//           ${open ? "translate-x-0" : "translate-x-full"}
//         `}
//       >
//         {/* DRAWER HEADER */}
//         <div className="flex items-center justify-between px-5 h-[64px] border-b border-white/10">
//           <p className="text-sm text-gray-300">
//             Hey {token ? userName : "Guest"} 👋
//           </p>
//           <img
//             src={assets.cross_icon}
//             className="w-4 invert cursor-pointer"
//             alt="close"
//             onClick={() => setOpen(false)}
//           />
//         </div>

//         {/* MAIN NAV LINKS */}
//         <nav className="px-5 py-6 flex flex-col gap-4">
//           {[
//             { name: "Home", path: "/" },
//             { name: "Collections", path: "/collections" },
//             { name: "About Us", path: "/about" },
//             { name: "Contact Us", path: "/contact" },
//           ].map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `
//                   py-3 px-4 rounded-xl transition
//                   ${
//                     isActive
//                       ? "bg-white text-black"
//                       : "bg-[#151515] hover:bg-[#1f1f1f]"
//                   }
//                 `
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </nav>

//         {/* LEGAL LINKS */}
//         <div className="px-5 mt-6">
//           <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
//             Legal
//           </p>

//           <div className="flex flex-col gap-3 text-sm text-gray-300">
//             <p
//               onClick={() => {
//                 navigate("/privacy-policy");
//                 setOpen(false);
//               }}
//               className="cursor-pointer hover:text-white"
//             >
//               Privacy Policy
//             </p>

//             <p
//               onClick={() => {
//                 navigate("/refund-return");
//                 setOpen(false);
//               }}
//               className="cursor-pointer hover:text-white"
//             >
//               Refund & Return
//             </p>

//             <p
//               onClick={() => {
//                 navigate("/shipping-delivery");
//                 setOpen(false);
//               }}
//               className="cursor-pointer hover:text-white"
//             >
//               Shipping & Delivery
//             </p>

//             <p
//               onClick={() => {
//                 navigate("/terms-conditions");
//                 setOpen(false);
//               }}
//               className="cursor-pointer hover:text-white"
//             >
//               Terms & Conditions
//             </p>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Navbar;

// import React, { useContext, useState, useEffect } from "react";
// import { assets } from "../assets/assets";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import { FaHome } from "react-icons/fa";

// const Navbar = () => {
//   const { getCartCount, navigate, token } = useContext(ShopContext);
//   const [open, setOpen] = useState(false);

//   const userName = localStorage.getItem("userName") || "Friend";

//   // 🔒 Lock body scroll when drawer is open
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "auto";
//     return () => (document.body.style.overflow = "auto");
//   }, [open]);

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <header
//         className="
//           fixed top-0 left-0 w-full z-50
//           bg-black/80 backdrop-blur-xl
//           border-b border-white/10
//           px-4 sm:px-[5vw]
//           h-[64px]
//           flex items-center justify-between
//           shadow-lg
//         "
//       >
//         {/* LEFT : HOME + BRAND */}
//         <div className="flex items-center gap-4">
//           {/* HOME ICON */}
//           <button
//             onClick={() => navigate("/")}
//             className="
//               w-9 h-9 rounded-full
//               flex items-center justify-center
//               bg-white/10 hover:bg-white/20
//               transition
//             "
//           >
//             <FaHome className="text-white text-sm" />
//           </button>

//           {/* BRAND */}
//           <Link
//             to="/"
//             className="
//               text-lg sm:text-xl font-bold tracking-wide
//               bg-gradient-to-r from-white to-gray-400
//               bg-clip-text text-transparent
//               select-none
//             "
//           >
//             Brawvly
//           </Link>
//         </div>

//         {/* RIGHT ICONS */}
//         <div className="flex items-center gap-5">
//           {/* USER */}
//           <img
//             src={assets.profile_icon}
//             className="w-5 invert opacity-80 cursor-pointer hover:opacity-100 transition"
//             alt="user"
//             onClick={() => {
//               token ? navigate("/user") : navigate("/login");
//             }}
//           />

//           {/* CART */}
//           <Link to="/cart" className="relative">
//             <img
//               src={assets.cart_icon}
//               className="w-5 invert opacity-80 hover:opacity-100 transition"
//               alt="cart"
//             />
//             <span
//               className="
//                 absolute -right-2 -bottom-2
//                 w-4 h-4 text-[10px]
//                 bg-white text-black
//                 rounded-full
//                 flex items-center justify-center
//                 font-semibold
//               "
//             >
//               {getCartCount()}
//             </span>
//           </Link>

//           {/* MENU */}
//           <img
//             src={assets.menu_icon}
//             className="w-5 invert cursor-pointer hover:scale-110 transition"
//             onClick={() => setOpen(true)}
//             alt="menu"
//           />
//         </div>
//       </header>

//       {/* ================= BACKDROP ================= */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* ================= SIDE DRAWER ================= */}
//       <aside
//         className={`
//           fixed top-0 right-0 h-full z-50
//           bg-gradient-to-b from-black via-[#0c0c0c] to-[#111]
//           w-[80%] sm:w-[60%]
//           transform transition-transform duration-500 ease-out
//           ${open ? "translate-x-0" : "translate-x-full"}
//         `}
//       >
//         {/* DRAWER HEADER */}
//         <div className="flex items-center justify-between px-5 h-[64px] border-b border-white/10">
//           <p className="text-sm text-gray-300">
//             Hey {token ? userName : "Guest"} 👋
//           </p>
//           <img
//             src={assets.cross_icon}
//             className="w-4 invert cursor-pointer hover:rotate-90 transition"
//             alt="close"
//             onClick={() => setOpen(false)}
//           />
//         </div>

//         {/* MAIN NAV LINKS */}
//         <nav className="px-5 py-6 flex flex-col gap-4">
//           {[
//             { name: "Home", path: "/" },
//             { name: "Collections", path: "/collections" },
//             { name: "About Us", path: "/about" },
//             { name: "Contact Us", path: "/contact" },
//           ].map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `
//                   py-3 px-4 rounded-xl transition font-medium
//                   ${
//                     isActive
//                       ? "bg-white text-black"
//                       : "bg-[#151515] hover:bg-[#1f1f1f]"
//                   }
//                 `
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </nav>

//         {/* LEGAL */}
//         <div className="px-5 mt-6">
//           <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
//             Legal
//           </p>

//           <div className="flex flex-col gap-3 text-sm text-gray-300">
//             {[
//               { label: "Privacy Policy", path: "/privacy-policy" },
//               { label: "Refund & Return", path: "/refund-return" },
//               { label: "Shipping & Delivery", path: "/shipping-delivery" },
//               { label: "Terms & Conditions", path: "/terms-conditions" },
//             ].map((item) => (
//               <p
//                 key={item.label}
//                 onClick={() => {
//                   navigate(item.path);
//                   setOpen(false);
//                 }}
//                 className="cursor-pointer hover:text-white transition"
//               >
//                 {item.label}
//               </p>
//             ))}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Navbar;

// import React, { useContext, useState, useEffect, useRef } from "react";
// import { assets } from "../assets/assets";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import { FaHome, FaUser, FaShoppingCart } from "react-icons/fa";

// const Navbar = () => {
//   const { getCartCount, navigate, token } = useContext(ShopContext);
//   const [open, setOpen] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);

//   const lastScrollY = useRef(0);

//   const userName = localStorage.getItem("userName") || "Friend";

//   // 🔒 Lock body scroll when drawer is open
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "auto";
//     return () => (document.body.style.overflow = "auto");
//   }, [open]);

//   // 👀 Hide / Show navbar on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
//         // scrolling down
//         setShowNavbar(false);
//       } else {
//         // scrolling up
//         setShowNavbar(true);
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <header
//         className={`
//           fixed top-0 left-0 w-full z-50
//           bg-black/80 backdrop-blur-xl
//           border-b border-white/10
//           px-4 sm:px-[5vw]
//           h-[64px]
//           flex items-center justify-between
//           shadow-lg
//           transition-transform duration-300 ease-in-out
//           ${showNavbar ? "translate-y-0" : "-translate-y-full"}
//         `}
//       >
//         {/* LEFT : HOME + BRAND */}
//         <div className="flex items-center gap-4">
//           {/* HOME ICON */}
//           <button
//             onClick={() => navigate("/")}
//             className="
//               w-9 h-9 rounded-full
//               flex items-center justify-center
//               bg-white/10 hover:bg-white/20
//               transition
//             "
//           >
//             <FaHome className="text-white text-sm" />
//           </button>

//           {/* BRAND */}
//           <Link
//             to="/"
//             className="
//               text-lg sm:text-xl font-bold tracking-wide
//               bg-gradient-to-r from-white to-gray-400
//               bg-clip-text text-transparent
//               select-none
//             "
//           >
//             Brawvly
//           </Link>
//         </div>

//         {/* RIGHT ICONS */}
//         <div className="flex items-center gap-4">
//           {/* USER ICON */}
//           <button
//             onClick={() => (token ? navigate("/user") : navigate("/login"))}
//             className="
//               w-9 h-9 rounded-full
//               flex items-center justify-center
//               bg-white/10 hover:bg-white/20
//               transition
//             "
//           >
//             <FaUser className="text-white text-sm" />
//           </button>

//           {/* CART ICON */}
//           <button
//             onClick={() => navigate("/cart")}
//             className="
//               relative
//               w-9 h-9 rounded-full
//               flex items-center justify-center
//               bg-white/10 hover:bg-white/20
//               transition
//             "
//           >
//             <FaShoppingCart className="text-white text-sm" />
//             {getCartCount() > 0 && (
//               <span
//                 className="
//                   absolute -right-1 -bottom-1
//                   w-4 h-4 text-[10px]
//                   bg-white text-black
//                   rounded-full
//                   flex items-center justify-center
//                   font-semibold
//                 "
//               >
//                 {getCartCount()}
//               </span>
//             )}
//           </button>

//           {/* MENU */}
//           <img
//             src={assets.menu_icon}
//             className="w-5 invert cursor-pointer hover:scale-110 transition"
//             onClick={() => setOpen(true)}
//             alt="menu"
//           />
//         </div>
//       </header>

//       {/* ================= BACKDROP ================= */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* ================= SIDE DRAWER ================= */}
//       <aside
//         className={`
//           fixed top-0 right-0 h-full z-50
//           bg-gradient-to-b from-black via-[#0c0c0c] to-[#111]
//           w-[80%] sm:w-[60%]
//           transform transition-transform duration-500 ease-out
//           ${open ? "translate-x-0" : "translate-x-full"}
//         `}
//       >
//         {/* DRAWER HEADER */}
//         <div className="flex items-center justify-between px-5 h-[64px] border-b border-white/10">
//           <p className="text-sm text-gray-300">
//             Hey {token ? userName : "Guest"} 👋
//           </p>
//           <img
//             src={assets.cross_icon}
//             className="w-4 invert cursor-pointer hover:rotate-90 transition"
//             alt="close"
//             onClick={() => setOpen(false)}
//           />
//         </div>

//         {/* NAV LINKS */}
//         <nav className="px-5 py-6 flex flex-col gap-4">
//           {[
//             { name: "Home", path: "/" },
//             { name: "Collections", path: "/collections" },
//             { name: "About Us", path: "/about" },
//             { name: "Contact Us", path: "/contact" },
//           ].map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `
//                   py-3 px-4 rounded-xl transition font-medium
//                   ${
//                     isActive
//                       ? "bg-white text-black"
//                       : "bg-[#151515] hover:bg-[#1f1f1f]"
//                   }
//                 `
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Navbar;

// import React, { useContext, useEffect, useState } from "react";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import {
//   FaHome,
//   FaUser,
//   FaShoppingCart,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";

// const Navbar = ({ showNavbar }) => {
//   const { getCartCount, navigate, token } = useContext(ShopContext);
//   const [open, setOpen] = useState(false);

//   const userName = localStorage.getItem("userName") || "Friend";

//   /* 🔒 Lock scroll when drawer open */
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "auto";
//     return () => (document.body.style.overflow = "auto");
//   }, [open]);

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <header
//         className={`
//           fixed top-0 left-0 w-full z-50
//           bg-black/80 backdrop-blur-xl
//           border-b border-white/10
//           h-[64px] px-4 sm:px-[5vw]
//           flex items-center justify-between
//           transition-transform duration-300
//           ${showNavbar ? "translate-y-0" : "-translate-y-full"}
//         `}
//       >
//         {/* LEFT */}
//         <div className="flex items-center gap-4 cursor-pointer">
//           <IconButton onClick={() => navigate("/")}>
//             <FaHome />
//           </IconButton>

//           <Link
//             to="/"
//             className="text-lg sm:text-xl font-bold
//               bg-gradient-to-r from-white to-gray-400
//               bg-clip-text text-transparent"
//           >
//             Brawvly
//           </Link>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">
//           <IconButton
//             onClick={() => (token ? navigate("/user") : navigate("/login"))}
//           >
//             <FaUser />
//           </IconButton>

//           <IconButton onClick={() => navigate("/cart")} badge={getCartCount()}>
//             <FaShoppingCart />
//           </IconButton>

//           {/* HAMBURGER */}
//           <IconButton onClick={() => setOpen(true)}>
//             <FaBars />
//           </IconButton>
//         </div>
//       </header>

//       {/* ================= BACKDROP ================= */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/60 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* ================= DRAWER ================= */}
//       <aside
//         className={`
//           fixed top-0 right-0 h-full z-50
//           w-[85%] sm:w-[60%]
//           bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#111]
//           transform transition-transform duration-500 ease-out
//           ${open ? "translate-x-0" : "translate-x-full"}
//         `}
//       >
//         {/* HEADER */}
//         <div className="h-[64px] px-5 flex items-center justify-between border-b border-white/10">
//           <p className="text-sm text-gray-300">
//             Hey {token ? userName : "Guest"} 👋
//           </p>

//           <button
//             onClick={() => setOpen(false)}
//             className="
//               w-9 h-9 rounded-full
//               bg-white/10 hover:bg-white/20
//               flex items-center justify-center
//               transition
//             "
//           >
//             <FaTimes className="text-white text-sm" />
//           </button>
//         </div>

//         {/* NAV */}
//         <nav className="px-5 py-8 flex flex-col gap-4">
//           {[
//             { name: "Home", path: "/" },
//             { name: "Collections", path: "/collections" },
//             { name: "About Us", path: "/about" },
//             { name: "Contact Us", path: "/contact" },
//           ].map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `
//                   py-3 px-4 rounded-xl font-medium
//                   transition
//                   ${
//                     isActive
//                       ? "bg-white text-black"
//                       : "bg-[#151515] hover:bg-[#1f1f1f]"
//                   }
//                 `
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// /* ================= ICON BUTTON ================= */
// const IconButton = ({ children, onClick, badge }) => (
//   <button
//     onClick={onClick}
//     className="
//       relative w-9 h-9 rounded-full
//       flex items-center justify-center
//       bg-white/10 hover:bg-white/20
//       transition hover:scale-105
//     "
//   >
//     <span className="text-white text-sm">{children}</span>
//     {badge > 0 && (
//       <span className="absolute -right-1 -bottom-1 w-4 h-4 text-[10px] bg-white text-black rounded-full flex items-center justify-center font-semibold">
//         {badge}
//       </span>
//     )}
//   </button>
// );

// export default Navbar;

// components/Navbar.jsx
import React, { useEffect, useState } from "react";
import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";

const Navbar = ({ showNavbar }) => {
  // sm + md → Mobile Navbar
  // lg + xl → Desktop Navbar
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
    window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobileOrTablet ? (
        <NavbarMobile showNavbar={showNavbar} />
      ) : (
        <NavbarDesktop />
      )}
    </>
  );
};

export default Navbar;




