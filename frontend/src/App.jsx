import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import PreLoader from "./components/PreLoader";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Verify from "./pages/Verify";
import User from "./pages/User";
import SellWithUs from "./pages/SellWithUs";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundReturnPolicy from "./pages/RefundReturnPolicy";
import ShippingDelivery from "./pages/ShippingDelivery";
import TermsConditions from "./pages/TermsConditions";
import SearchPage from "./pages/SearchPage";
import Favorites from "./pages/Favorites";

import { ShopContext } from "./context/ShopContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 🔒 SEARCH ROUTE GUARD */
const SearchRouteGuard = ({ children }) => {
  const location = useLocation();
  const from = location.state?.from;

  if (from !== "/" && from !== "/collections") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { products } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
    window.innerWidth < 1024
  );

  const location = useLocation();
  const pathname = location.pathname;

  /* ================= PAGE FLAGS ================= */
  const isSearchPage = pathname === "/search";
  const isUserPage = pathname === "/user";

const showSearchBar =
  pathname === "/" ||
  pathname === "/collections" ||
  pathname.startsWith("/product") ||
  pathname === "/favorites";

  /* 🔥 HIDE FOOTER ON THESE ROUTES */
  const hideFooterRoutes = ["/search", "/user", "/cart", "/placeorder"];

  const showFooter = !hideFooterRoutes.some((route) =>
    pathname.startsWith(route)
  );

  /* ================= STOP LOADER ================= */
  useEffect(() => {
    if (products !== undefined) {
      setLoading(false);
    }
  }, [products]);

  /* ================= NAVBAR HIDE ON SCROLL ================= */
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* ================= LOADER ================= */}
      <PreLoader isLoading={loading} />

      {/* ================= TOAST ================= */}
      <ToastContainer theme="dark" />

      {/* ================= NAVBAR ================= */}
      {!isSearchPage && <Navbar showNavbar={showNavbar} />}

      {/* ================= SEARCHBAR ================= */}
      {showSearchBar && !isSearchPage && isMobileOrTablet && (
        <Searchbar showNavbar={showNavbar} />
      )}

      {/* ================= ROUTES ================= */}
      <Routes>
        {/* 🔍 SEARCH (FULL SCREEN) */}
        <Route
          path="/search"
          element={
            <SearchRouteGuard>
              <SearchPage />
            </SearchRouteGuard>
          }
        />

        {/* 🏠 NORMAL PAGES */}
        <Route
          path="*"
          element={
            <div
              className={`
    ${isSearchPage ? "no-navbar-offset" : "page-wrapper"}
    page-container
    page-max
  `}
            >
              {!loading && (
                <>
                  <Routes>
                    {/* MAIN */}
                    <Route path="/" element={<Home />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/product/:productId" element={<Product />} />

                    {/* AUTH */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />

                    {/* USER */}
                    <Route path="/user" element={<User />} />

                    {/* SHOP */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/placeorder" element={<PlaceOrder />} />

                    {/* INFO */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/sell-with-us" element={<SellWithUs />} />

                    {/* LEGAL */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route
                      path="/refund-return"
                      element={<RefundReturnPolicy />}
                    />
                    <Route
                      path="/shipping-delivery"
                      element={<ShippingDelivery />}
                    />
                    <Route
                      path="/terms-conditions"
                      element={<TermsConditions />}
                    />
                  </Routes>

                  <ScrollToTop />
                </>
              )}
            </div>
          }
        />
      </Routes>

      {/* ================= FOOTER ================= */}
      {showFooter && <Footer />}
    </div>
  );
};

export default App;
