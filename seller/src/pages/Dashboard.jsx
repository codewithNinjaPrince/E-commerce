import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";
import { backendUrl } from "../App";
import axios from "axios";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [merchant, setMerchant] = useState(null);
  const [stats, setStats] = useState(null);

  const token = localStorage.getItem("merchantToken");

  // LOAD DASHBOARD STATS
  const loadDashboard = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/dashboard`, {
        headers: { token },
      });

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log("Dashboard Fetch Error:", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // LOAD MERCHANT PROFILE
  const fetchMerchant = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
        headers: { token },
      });

      if (res.data.success) setMerchant(res.data.merchant);
    } catch (error) {
      console.log("Merchant fetch failed");
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, []);

  if (!stats) return <div className="text-white p-10">Loading Dashboard…</div>;

  return (
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white overflow-x-hidden w-full">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className="
    w-full max-w-[1600px] mx-auto 
    px-4 sm:px-6 
    overflow-x-hidden 
    pt-[30px] sm:pt-[60px] lg:pt-[50px]
  "
      >
        <div className="max-w-5xl mx-auto w-full overflow-x-hidden">
          {/* WELCOME */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-6 
            bg-gradient-to-r from-white via-gray-300 to-gray-500 
            bg-clip-text text-transparent"
          >
            Welcome Back{merchant ? `, ${merchant.name}` : ""} 👋
          </h1>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Products"
              value={stats.totalProducts ?? 0}
              icon={<FaBoxOpen className="text-blue-500 text-2xl" />}
              iconBg="bg-blue-600/20"
            />

            <DashboardCard
              title="Total Orders"
              value={stats.totalOrders ?? 0}
              icon={<FaShoppingCart className="text-yellow-400 text-2xl" />}
              iconBg="bg-yellow-600/20"
            />

            <DashboardCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue ?? 0}`}
              icon={<FaMoneyBillWave className="text-green-400 text-2xl" />}
              iconBg="bg-green-600/20"
            />

            <DashboardCard
              title="Available Earnings"
              value={`₹${stats.earnings ?? 0}`}
              icon={<FaWallet className="text-purple-400 text-2xl" />}
              iconBg="bg-purple-600/20"
            />
          </div>

          {/* RECENT SECTIONS */}
          {/* RECENT ORDERS */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

            {stats.recentOrders.length === 0 ? (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                No recent orders yet
              </div>
            ) : (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                {stats.recentOrders.map((order) => {
                  const date = new Date(order.date);
                  const firstItem = order.items[0];
                  const customer =
                    order.address?.firstName + " " + order.address?.lastName;

                  return (
                    <div
                      key={order._id}
                      className="p-4 bg-black/30 rounded-lg border border-white/10 
            hover:border-blue-500 cursor-pointer flex justify-between items-center"
                      onClick={() => (window.location.href = `/orders`)} // you can change this to specific page
                    >
                      {/* LEFT DETAILS */}
                      <div>
                        <p className="font-semibold text-white">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>

                        <p className="text-gray-400 text-sm">
                          {date.toLocaleDateString()} •{" "}
                          {date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        <p className="text-gray-300 text-sm mt-1">
                          👤 {customer}
                        </p>
                      </div>

                      {/* RIGHT PRICE */}
                      <p className="text-blue-400 font-semibold text-lg">
                        ₹{order.amount}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RECENT PRODUCTS */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Recent Products</h2>

            {stats.recentProducts.length === 0 ? (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                No recent products yet
              </div>
            ) : (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                {stats.recentProducts.map((p) => (
                  <div
                    key={p._id}
                    className="
            p-4 bg-black/30 rounded-lg border border-white/10 
            hover:border-green-500 hover:shadow-[0_0_12px_rgba(0,255,120,0.5)]
            cursor-pointer flex items-center gap-4 transition-all
          "
                    onClick={() =>
                      (window.location.href = `/products?highlight=${p._id}`)
                    }
                  >
                    {/* IMAGE */}
                    <img
                      src={p.image[0]}
                      alt={p.name}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-700"
                    />

                    {/* DETAILS */}
                    <div className="flex-1">
                      <p className="text-white font-semibold">{p.name}</p>

                      <p className="text-gray-400 text-sm">
                        Brand:{" "}
                        <span className="text-gray-300">{p.brandName}</span>
                      </p>

                      <p className="text-gray-400 text-sm">
                        Category:{" "}
                        <span className="text-gray-300">{p.category}</span>
                      </p>

                      <p className="text-green-400 font-medium">
                        ₹{p.discountedPrice}
                      </p>

                      <p className="text-gray-500 text-xs">
                        Added: {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

/* ===========================
   COMPONENTS
=========================== */

const DashboardCard = ({ title, value, icon, iconBg }) => {
  return (
    <div
      className="
        bg-white/5 backdrop-blur-lg p-5 rounded-xl border border-white/10 shadow-md
        cursor-pointer transition-all duration-300
        hover:border-blue-500 hover:shadow-[0_0_15px_rgba(0,123,255,0.5)]
        hover:scale-[1.03]
      "
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>

        <div>
          <p className="text-gray-300 text-xs">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   RECENT ORDERS
=========================== */
const RecentOrders = ({ orders }) => (
  <div className="mt-10">
    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

    {!orders || orders.length === 0 ? (
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-gray-300 h-[150px] flex items-center justify-center">
        No recent orders yet
      </div>
    ) : (
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="flex justify-between p-3 border-b border-white/10 text-gray-300"
          >
            <p>Order #{order._id.slice(-6)}</p>
            <p>{new Date(order.date).toDateString()}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ===========================
   RECENT PRODUCTS
=========================== */
/* =======================
   RECENT PRODUCTS SECTION
========================= */
const RecentProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Recent Products</h2>
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 text-gray-300 h-[150px] flex items-center justify-center">
          No recent products yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full">
      <h2 className="text-lg font-semibold mb-4">Recent Products</h2>

      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          gap-6
        "
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="
              bg-white/5 backdrop-blur-lg border border-white/10 
              rounded-xl p-4 shadow-md 
              hover:border-blue-500/40 hover:shadow-lg hover:scale-[1.02]
              transition-all cursor-pointer
              flex flex-col gap-3
            "
          >
            {/* Product Image */}
            <img
              src={product.image?.[0]}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg border border-white/10"
            />

            {/* Product Info */}
            <div className="space-y-1">
              <p className="font-semibold text-white text-lg truncate">
                {product.name}
              </p>
              <p className="text-gray-400 text-sm">
                Brand:{" "}
                <span className="text-gray-300">{product.brandName}</span>
              </p>

              <p className="text-blue-300 text-sm">
                Category:{" "}
                <span className="text-gray-300">{product.category}</span>
              </p>

              <p className="text-green-400 font-semibold">
                ₹{product.discountedPrice}
                <span className="text-gray-500 line-through ml-2 text-sm">
                  ₹{product.actualPrice}
                </span>
              </p>

              <p className="text-gray-400 text-xs">
                Added: {new Date(product.createdAt).toDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
