import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = ({ showNavbar }) => {
  const navigate = useNavigate();
  const { getCartCount, token, getFavoriteCount } = useContext(ShopContext);
  const { logout } = useContext(ShopContext);

  const [open, setOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Friend";

  const Section = ({ title, children }) => (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
        {title}
      </p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchEndX - touchStartX > 80) {
      setOpen(false); // 👉 swipe right → close
    }
  };

  const DrawerLink = ({ to, label, setOpen }) => {
    const navigate = useNavigate();

    return (
      <button
        onClick={() => {
          navigate(to); // page open
          setOpen(false); // 🔥 hamburger close
        }}
        className="
        w-full text-left
        py-2 px-3
        rounded-lg
        text-sm
        text-gray-300
        hover:bg-[#1f1f1f]
        hover:text-white
        transition
        cursor-pointer
      "
      >
        {label}
      </button>
    );
  };

  /* 🔒 Lock scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  useEffect(() => {
    if (!token) {
      setOpen(false);
    }
  }, [token]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          bg-black/80 backdrop-blur-xl
          border-b border-white/10
          h-[64px]
          px-2
          flex items-center justify-between
          transition-transform duration-300
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <IconButton onClick={() => navigate("/")}>
            <FaHome />
          </IconButton>

          <Link
            to="/"
            className="text-lg font-semibold tracking-wide
              bg-gradient-to-r from-white to-gray-400
              bg-clip-text text-transparent"
          >
            Brawvly
          </Link>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => (token ? navigate("/user") : navigate("/login"))}
          >
            <FaUser />
          </IconButton>

          <IconButton
            onClick={() =>
              token ? navigate("/favorites") : navigate("/login")
            }
            badge={token ? getFavoriteCount() : 0}
          >
            <FaHeart />
          </IconButton>

          <IconButton
            onClick={() => navigate("/cart")}
            badge={token ? getCartCount() : 0}
          >
            <FaShoppingCart />
          </IconButton>

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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          fixed top-0 right-0 h-full z-999
          w-[85%] sm:w-[60%]
          bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#111]
          transform transition-transform duration-500 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* DRAWER HEADER */}
        <div className="h-[64px] px-5 flex items-center justify-between border-b border-white/10">
          <p className="text-sm text-gray-300">
            Hey {token ? userName : "Guest"} 👋
          </p>

          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <FaTimes className="text-white text-sm" />
          </button>
        </div>

        {/* NAV ITEMS */}
        <nav className="flex flex-col h-[calc(100vh-64px)] z-100">
          {/* 🔹 MAIN */}
          <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-4">
            <Section title="Explore">
              <DrawerLink to="/" label="Home" setOpen={setOpen} />
              <DrawerLink
                to="/collections"
                label="Collections"
                setOpen={setOpen}
              />
              <DrawerLink to="/favorites" label="Favorites" setOpen={setOpen} />
              <DrawerLink to="/cart" label="Cart" setOpen={setOpen} />
            </Section>

            {/* 🔹 ACCOUNT */}
            {token && (
              <Section title="My Account">
                <DrawerLink to="/user" label="My Profile" setOpen={setOpen} />
                <DrawerLink to="/orders" label="My Orders" setOpen={setOpen} />
              </Section>
            )}

            {/* 🔹 SUPPORT */}
            <Section title="Support">
              <DrawerLink to="/about" label="About Us" setOpen={setOpen} />
              <DrawerLink to="/contact" label="Contact Us" setOpen={setOpen} />
              <DrawerLink
                to="/sell-with-us"
                label="Sell With Us"
                setOpen={setOpen}
              />
            </Section>

            {/* 🔹 LEGAL */}
            <Section title="Legal">
              <DrawerLink
                to="/privacy-policy"
                label="Privacy Policy"
                setOpen={setOpen}
              />
              <DrawerLink
                to="/terms-conditions"
                label="Terms & Conditions"
                setOpen={setOpen}
              />
              <DrawerLink
                to="/refund-return"
                label="Refund & Return Policy"
                setOpen={setOpen}
              />
              <DrawerLink
                to="/shipping-delivery"
                label="Shipping & Delivery"
                setOpen={setOpen}
              />
            </Section>

            {/* FIXED BOTTOM ACTION */}
            <div className="px-2 py-2 border-t border-white/10 bg-[#111]">
              {token ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-300 transition"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
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

// import React, { useContext, useEffect, useState } from "react";
// import { NavLink, Link } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import {
//   FaHome,
//   FaUser,
//   FaShoppingCart,
//   FaHeart,
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

//           {/* FAVORITES */}
//           <IconButton onClick={() => navigate("/favorites")}>
//             <FaHeart className="text-[15px]" />
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
//             { name: "Favorites", path: "/favorites" },
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
