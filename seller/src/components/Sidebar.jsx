import { useState } from "react";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaHeadset,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaShieldAlt
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen, setMerchantToken, unreadCount = 0 }) => {
  const navigate = useNavigate();

  const [logoutModal, setLogoutModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const merchantName = localStorage.getItem("merchantName") || "Merchant";

  // Initials: "Prince Dixit" => "PD"
  const initials = merchantName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const logoutNow = () => {
    setLoadingLogout(true);

    setTimeout(() => {
      localStorage.removeItem("merchantToken");
      localStorage.removeItem("merchantName");
      setMerchantToken("");
      navigate("/login");
    }, 300);
  };

  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { label: "Products", icon: <FaBox />, path: "/products" },
    { label: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { label: "Support", icon: <FaHeadset />, path: "/support" },
    { label: "Notification", icon: <FaBell />, path: "/notification" },
    { label: "Kyc", icon: <FaShieldAlt />, path: "/kyc" },    
    { label: "Settings", icon: <FaCog />, path: "/setting" },    

  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-[998]"
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[240px] sm:w-[260px] 
          bg-[#151515] border-r border-[#2a2a2a]
          p-5 pt-7 z-[999]
          overflow-x-hidden transition-transform duration-300
          flex flex-col justify-between
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div>
          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-5 right-4 text-white text-xl"
          >
            <FaTimes />
          </button>

          {/* PROFILE SECTION */}
          <div
            className="flex items-center gap-3 mb-8 p-2 rounded-lg hover:bg-[#222] cursor-pointer transition"
            onClick={() => {
              navigate("/profile");
              setSidebarOpen(false);
            }}
          >
            <div className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold">
              {initials}
            </div>

            <div>
              <p className="text-white font-semibold">{merchantName}</p>
              <p className="text-gray-400 text-xs">Merchant Profile</p>
            </div>
          </div>

          {/* MENU ITEMS */}
          <nav className="space-y-4">
            {menuItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer relative
                  ${
                    isActive
                      ? "bg-[#222] text-white"
                      : "text-gray-300 hover:bg-[#222] hover:text-white"
                  }
                `
                }
              >
                {/* ICON + BADGE FOR NOTIFICATION ONLY */}
                {item.label === "Notification" ? (
                  <div className="relative">
                    <span className="text-lg">{item.icon}</span>

                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-[6px] rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-lg">{item.icon}</span>
                )}

                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => setLogoutModal(true)}
          className="flex items-center gap-3 text-red-500 p-3 w-full rounded-lg hover:bg-[#222] mb-6 cursor-pointer"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>

      {/* LOGOUT MODAL */}
      {logoutModal && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center px-4">
          <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-6 w-[90%] max-w-[350px] text-white shadow-xl">
            <h2 className="text-xl font-semibold mb-3">Logout?</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 cursor-pointer"
              >
                No
              </button>

              <button
                onClick={logoutNow}
                disabled={loadingLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer flex items-center gap-2"
              >
                {loadingLogout && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
