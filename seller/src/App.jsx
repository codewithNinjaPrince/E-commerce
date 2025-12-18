import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import MobileNavbar from "./components/MobileNavbar";
import MerchantAuth from "./components/MerchantAuth";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Kyc from "./pages/Kyc";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Notification from "./pages/Notification";
import UpdateKycPage from "./pages/UpdateKycPage";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Legal from "./pages/Legal";

import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const navigate = useNavigate();

  // ⭐ Default TRUE = smooth UX, no flicker, no white screen
  const [kycVerified, setKycVerified] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);
  const [token, setToken] = useState(
    localStorage.getItem("merchantToken") || ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  const location = useLocation();

  const isLegalPage = [
    "/terms",
    "/privacy-policy",
    "/refund-policy",
    "/shipping-policy",
    "/legal",
  ].includes(location.pathname);

  const handleBack = () => {
    if (token) {
      navigate("/kyc");
    } else {
      navigate("/");
    }
  };

  /* -------------------------------------------
     AUTO UPDATE TOKEN
  ------------------------------------------- */
  useEffect(() => {
    const storedToken = localStorage.getItem("merchantToken");
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]);

  /* -------------------------------------------
     FETCH UNREAD NOTIFICATIONS COUNT
  ------------------------------------------- */
  const fetchUnreadCount = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${backendUrl}/api/merchant/notifications`, {
        headers: { token },
      });

      if (res.data.success) {
        const notifications = res.data.notifications;
        const count = notifications.filter((n) => !n.read).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.log("Unread notification fetch error:", err);
    }
  };

  /* -------------------------------------------
     AUTO REFRESH EVERY 10 SECONDS
  ------------------------------------------- */
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [token]);

  /* -------------------------------------------
     FETCH KYC STATUS (Runs only ONCE per login)
     ⭐ Does NOT block UI → Smooth start
  ------------------------------------------- */
  useEffect(() => {
    if (!token) return;

    const fetchMerchantStatus = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
          headers: { token },
        });

        if (res.data.success) {
          setKycVerified(res.data.merchant.isVerified); // instantly lock if false
        }
      } catch (err) {
        console.log("KYC status fetch error:", err);
      }
    };

    fetchMerchantStatus();
  }, [token]);

  /* -------------------------------------------
     AUTH PAGE
  ------------------------------------------- */
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {isLegalPage && (
          <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10 px-4 py-3 flex justify-end">
            <button
              onClick={handleBack}
              className="
        flex items-center gap-2
        px-4 py-2 rounded-lg
        text-gray-300 bg-white/5
        hover:text-white hover:bg-white/10
        transition-all duration-300 ease-out
        hover:-translate-x-1
        animate-slide-in-right
        cursor-pointer
      "
            >
             ← Back
            </button>
          </div>
        )}

        <Routes>
          {/* AUTH */}
          <Route
            path="/"
            element={<MerchantAuth setMerchantToken={setToken} />}
          />

          {/* PUBLIC LEGAL PAGES */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/legal" element={<Legal />} />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<MerchantAuth setMerchantToken={setToken} />}
          />
        </Routes>
      </div>
    );
  }

  /* -------------------------------------------
     LOCKED PAGE
  ------------------------------------------- */
  const LockedPage = () => (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-bold mb-3 text-red-400">KYC Not Verified</h2>
      <p className="text-gray-300 max-w-md mb-6">
        Your KYC is not active. Complete your KYC to unlock all merchant
        features.
      </p>

      <a
        href="/kyc"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold cursor-pointer"
      >
        Go to KYC Page
      </a>
    </div>
  );

  /* -------------------------------------------
     PROTECTION FUNCTION
     ⭐ Only lock when explicitly false
     ⭐ Default true means smooth UX
  ------------------------------------------- */
  const protect = (page) => (kycVerified === false ? <LockedPage /> : page);

  /* -------------------------------------------
     APP LAYOUT
  ------------------------------------------- */
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
      <ToastContainer />

      <MobileNavbar setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setMerchantToken={setToken}
        unreadCount={unreadCount}
      />

      <div className="flex-1 pt-[70px] lg:pt-0 p-4 sm:p-6 text-white lg:pl-[260px]">
        <Routes>
          <Route path="/" element={protect(<Dashboard />)} />
          <Route path="/dashboard" element={protect(<Dashboard />)} />
          <Route path="/products" element={protect(<Products />)} />
          <Route path="/add-product" element={protect(<AddProduct />)} />
          <Route path="/products/edit/:id" element={protect(<EditProduct />)} />
          <Route path="/orders" element={protect(<Orders />)} />
          <Route path="/payments" element={protect(<Payments />)} />
          <Route path="/support" element={protect(<Support />)} />
          <Route path="/profile" element={protect(<Profile />)} />
          <Route path="/setting" element={protect(<Setting />)} />
          <Route path="/notification" element={protect(<Notification />)} />

          {/* KYC pages always accessible */}
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/update-kyc" element={<UpdateKycPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
