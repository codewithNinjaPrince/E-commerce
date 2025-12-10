import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

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

  const [kycVerified, setKycVerified] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [token, setToken] = useState(
    localStorage.getItem("merchantToken") || ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================================
     AUTO UPDATE TOKEN
  ========================================================= */
  useEffect(() => {
    const storedToken = localStorage.getItem("merchantToken");
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]);

  /* =========================================================
     REDIRECT IF LOGGED OUT
  ========================================================= */
  useEffect(() => {
    if (!token) navigate("/", { replace: true });
  }, [token]);

  /* =========================================================
     FETCH UNREAD NOTIFICATIONS COUNT
  ========================================================= */
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

  /* =========================================================
     AUTO REFRESH EVERY 10 SECONDS
  ========================================================= */
  useEffect(() => {
    fetchUnreadCount(); // Initial load

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [token]);

  //Kyc page would only be active if kyc is not done
  const fetchMerchantStatus = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
        headers: { token },
      });

      if (res.data.success) {
        const merchant = res.data.merchant;
        setKycVerified(merchant.isVerified); // true or false
      }
    } catch (err) {
      console.log("KYC status fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMerchantStatus();
  }, [token]);

  /* =========================================================
     AUTH: Login Page
  ========================================================= */
  if (!token) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black">
        <MerchantAuth setMerchantToken={setToken} />
      </div>
    );
  }

  /* =========================================================
     APP LAYOUT
  ========================================================= */

  // Lock Component

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
      <ToastContainer />

      {/* MOBILE NAVBAR */}
      <MobileNavbar setSidebarOpen={setSidebarOpen} />

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setMerchantToken={setToken}
        unreadCount={unreadCount}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 pt-[70px] lg:pt-0 p-4 sm:p-6 text-white lg:pl-[260px]">
        <Routes>
          <Route
            path="/"
            element={kycVerified ? <Dashboard /> : <LockedPage />}
          />
          <Route
            path="/dashboard"
            element={kycVerified ? <Dashboard /> : <LockedPage />}
          />
          <Route
            path="/products"
            element={kycVerified ? <Products /> : <LockedPage />}
          />
          <Route
            path="/add-product"
            element={kycVerified ? <AddProduct /> : <LockedPage />}
          />
          <Route
            path="/products/edit/:id"
            element={kycVerified ? <EditProduct /> : <LockedPage />}
          />
          <Route
            path="/orders"
            element={kycVerified ? <Orders /> : <LockedPage />}
          />
          <Route
            path="/payments"
            element={kycVerified ? <Payments /> : <LockedPage />}
          />
          <Route
            path="/support"
            element={kycVerified ? <Support /> : <LockedPage />}
          />
          <Route
            path="/profile"
            element={kycVerified ? <Profile /> : <LockedPage />}
          />
          <Route
            path="/setting"
            element={kycVerified ? <Setting /> : <LockedPage />}
          />
          <Route
            path="/notification"
            element={kycVerified ? <Notification /> : <LockedPage />}
          />

          {/* KYC pages always accessible */}
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/update-kyc" element={<UpdateKycPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
