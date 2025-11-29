import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const MerchantAuth = ({ setMerchantToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Register fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [businessType, setBusinessType] = useState("Individual");
  const [address, setAddress] = useState("");

  // Common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const endpoint = isLogin
        ? `${backendUrl}/api/merchant/login`
        : `${backendUrl}/api/merchant/register`;

      const payload = isLogin
        ? { email, password }
        : {
            name,
            email,
            phone,
            password,
            storeName,
            storeDescription,
            businessType,
            address,
          };

      const res = await axios.post(endpoint, payload);

      if (!res.data.success) {
        toast.error(res.data.message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        toast.success("Login successful 🎉");
        setMerchantToken(res.data.token);
        localStorage.setItem("merchantToken", res.data.token);

      localStorage.setItem("merchantName", res.data.merchant?.name || "");

      
      } else {
        toast.success("Merchant registered successfully! 🎉");
      }

      // Short wait like your old loader
      setTimeout(() => {
        setLoading(false);
      }, 700);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 relative">

      {/* ============================================================= */}
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">

          {/* Circular Loader */}
          <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>

          {/* Loading Line */}
          <div className="w-48 h-1 bg-gray-800 mt-6 overflow-hidden rounded-full">
            <div className="h-full w-full bg-white animate-[loadingLine_1.2s_linear_infinite]"></div>
          </div>

          {/* Funny Text */}
          <p className="text-white mt-6 text-sm flex items-center gap-2 animate-pulse">
            {isLogin ? "Dusting your dashboard... 🧹💼" : "Setting up your mini-store... 🏪✨"}
          </p>

          {/* Animation Keyframes */}
          <style>
            {`@keyframes loadingLine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }`}
          </style>
        </div>
      )}
      {/* ============================================================= */}

      {/* MAIN AUTH CARD */}
      <div
        className={`w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 
        px-10 py-10 rounded-2xl shadow-2xl transition-all duration-300
        ${loading ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
      >
        <h1 className="text-3xl font-bold text-white text-center">
          {isLogin ? "Merchant Login" : "Merchant Registration"}
        </h1>

        <p className="text-gray-300 mt-2 text-center text-sm">
          Sell on <span className="font-semibold">BRAWVLY</span> & grow your business
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* ======================= REGISTER FIELDS ====================== */}
          {!isLogin && (
            <>
              <div>
                <label className="text-gray-200 text-sm">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-200 text-sm">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-200 text-sm">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-200 text-sm">Store Description</label>
                <textarea
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-200 text-sm">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
                >
                  <option value="Individual">Individual</option>
                  <option value="Retail Shop">Retail Shop</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Manufacturer">Manufacturer</option>
                </select>
              </div>

              <div>
                <label className="text-gray-200 text-sm">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
                />
              </div>
            </>
          )}

          {/* ======================= LOGIN / COMMON FIELDS ====================== */}
          <div>
            <label className="text-gray-200 text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="text-gray-200 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none focus:border-white"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-300 duration-200 cursor-pointer"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* SWITCH LOGIN/REGISTER */}
        <p className="text-gray-300 text-center text-sm mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-white ml-1 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MerchantAuth;

