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
import UpdateKycPage from "./pages/updateKycPage";

import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("merchantToken") || "");
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
      const res = await axios.get(
        `${backendUrl}/api/merchant/notifications`,
        {
          headers: { token },
        }
      );

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
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex">
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/update-kyc" element={<UpdateKycPage/>}/>
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
