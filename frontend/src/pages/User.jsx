import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const User = () => {
  const { token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken("");
    setCartItems({});
    toast.success("Logged out successfully 👋");
    navigate("/login");
  };

  return (
    <div
      className="
        min-h-[70vh]
        max-w-3xl
        mx-auto
        mt-10
        bg-gradient-to-br
        from-black
        via-[#0d0d0d]
        to-[#1a1a1a]
        border border-white/10
        rounded-2xl
        shadow-2xl
        p-6
        text-white
      "
    >
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {token ? `Welcome, ${userName} 👋` : "Welcome to Brawvly"}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account & orders
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-4">
        {token ? (
          <>
            {/* MY PROFILE */}
            <div
              onClick={() => navigate("/profile")}
              className="user-card"
            >
              <span>👤</span>
              <div>
                <p className="font-medium">My Profile</p>
                <p className="text-xs text-gray-400">
                  View & update your details
                </p>
              </div>
            </div>

            {/* ORDERS */}
            <div
              onClick={() => navigate("/orders")}
              className="user-card"
            >
              <span>📦</span>
              <div>
                <p className="font-medium">My Orders</p>
                <p className="text-xs text-gray-400">
                  Track and manage orders
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <div
              onClick={() => setShowLogoutConfirm(true)}
              className="user-card text-red-400 hover:border-red-500"
            >
              <span>🚪</span>
              <div>
                <p className="font-medium">Logout</p>
                <p className="text-xs text-red-400">
                  Sign out from your account
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* LOGIN */}
            <div
              onClick={() => navigate("/login")}
              className="user-card"
            >
              <span>🔐</span>
              <div>
                <p className="font-medium">Login</p>
                <p className="text-xs text-gray-400">
                  Access your account
                </p>
              </div>
            </div>

            {/* REGISTER */}
            <div
              onClick={() => navigate("/login")}
              className="user-card"
            >
              <span>✨</span>
              <div>
                <p className="font-medium">Create Account</p>
                <p className="text-xs text-gray-400">
                  Join Brawvly today
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* LOGOUT CONFIRMATION */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-3">
              Confirm Logout
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2 border border-white/20 rounded-md hover:bg-white hover:text-black transition"
              >
                Cancel
              </button>

              <button
                onClick={logout}
                className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .user-card {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.5);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .user-card:hover {
          background: rgba(255,255,255,0.06);
          transform: translateY(-2px);
          border-color: white;
        }

        .user-card span {
          font-size: 22px;
        }
      `}</style>
    </div>
  );
};

export default User;
