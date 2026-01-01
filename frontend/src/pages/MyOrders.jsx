import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ORDER_STATUSES = [
  "Order Placed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const OrderItemSkeleton = () => {
  return (
    <div
      className="
        relative
        grid
        grid-cols-[72px_1fr_16px]
        md:grid-cols-[88px_1fr_20px]
        lg:grid-cols-[120px_1fr_24px]
        items-start
        gap-4
        py-5
        px-4
        animate-pulse
      "
    >
      {/* LEFT BAR */}
      <span className="absolute left-0 top-0 h-full w-[3px] bg-white/10 rounded-r" />

      {/* IMAGE */}
      <div className="flex justify-center">
        <div className="w-20 aspect-[3/4] rounded-xl bg-white/10" />
      </div>

      {/* TEXT */}
      <div className="space-y-2 pr-6">
        <div className="h-3 w-40 bg-white/10 rounded" />
        <div className="h-4 w-64 bg-white/10 rounded" />
        <div className="h-3 w-28 bg-white/10 rounded" />
      </div>

      {/* CHEVRON */}
      <div className="h-4 w-2 bg-white/10 rounded" />

      {/* DIVIDER */}
      <span className="absolute bottom-0 w-full right-0 h-px bg-white/10" />
    </div>
  );
};

const OrdersSkeletonList = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <OrderItemSkeleton key={i} />
      ))}
    </>
  );
};

const MyOrders = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { backendUrl, token } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [statusFilter, setStatusFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState(null);
  const [tempStatusFilter, setTempStatusFilter] = useState([]);
  const [tempTimeFilter, setTempTimeFilter] = useState(null);

  /* ---------------- ONLINE / OFFLINE ---------------- */
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  /* ---------------- LOAD ORDERS ---------------- */
  const loadOrders = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to fetch orders");
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (err) {
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  useEffect(() => {
    document.body.style.overflow = showMobileFilter ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showMobileFilter]);

  /* ---------------- FLATTEN ORDERS → ITEMS ---------------- */
  const orderItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      orderId: order._id,
      orderDate: order.date,
      orderStatus: order.status,
      address: order.address,
      ...item,
    }))
  );

  /* ---------------- SEARCH FILTER ---------------- */
  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = orderItems.filter((item) => {
    /* ---------- SEARCH ---------- */
    if (normalizedSearch) {
      const address = item.address || {};

      const addressText = [
        address.name,
        address.phone,
        address.email,
        address.houseNo,
        address.street,
        address.locality,
        address.landmark,
        address.city,
        address.district,
        address.state,
        address.pincode,
        address.country,
        address.type,
      ]
        .filter(Boolean)
        .join(" ");

      const orderDate = new Date(item.orderDate);

      const timeText = [
        orderDate.toLocaleString("en-IN"),
        orderDate.toLocaleDateString("en-IN"),
        orderDate.toLocaleTimeString("en-IN"),
        orderDate.getFullYear(),
        orderDate.toLocaleString("en-IN", { month: "long" }),
        orderDate.toLocaleString("en-IN", { month: "short" }),
        orderDate.toLocaleString("en-IN", { weekday: "long" }),
      ].join(" ");

      const searchableText = [
        item.name,
        item.brandName,
        item.category,
        item.subCategory,
        item.size,
        item.offerCode,
        item.shopId,
        item.productId,
        item.itemStatus,
        item.orderStatus,
        ...(item.statusHistory || []).map((s) => s.status),
        addressText,
        timeText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(normalizedSearch)) return false;
    }

    /* ---------- STATUS FILTER ---------- */
    const effectiveStatus = item.itemStatus || item.orderStatus;

    if (statusFilter.length > 0) {
      if (!statusFilter.includes(effectiveStatus)) return false;
    }

    /* ---------- TIME FILTER ---------- */
    if (timeFilter) {
      const now = Date.now();
      const diff = now - item.orderDate;

      const ranges = {
        "Last 30 days": 30 * 24 * 60 * 60 * 1000,
        "Last 3 months": 90 * 24 * 60 * 60 * 1000,
        "Last 6 months": 180 * 24 * 60 * 60 * 1000,
      };

      if (timeFilter !== "Older" && diff > ranges[timeFilter]) return false;
      if (timeFilter === "Older" && diff <= ranges["Last 6 months"])
        return false;
    }

    return true;
  });

  return (
    <section className="h-screen bg-black text-white overflow-hidden">
      {/* ================= HEADER ================= */}
      <div
        className="
    fixed
    top-0
    lg:top-[64px]
    left-0
    right-0
    z-40
    bg-black/90
    backdrop-blur
    border-b
    border-white/10
  "
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-4 space-y-4">
          {/* MOBILE TITLE */}
          <div className="lg:hidden grid grid-cols-[auto_1fr_auto] items-center">
            {/* BACK */}
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="Back to home"
            >
              <FaArrowLeft />
            </button>

            {/* TITLE */}
            <div className="text-center text-lg font-semibold">My Orders</div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex items-center justify-between gap-4">
            {/* SEARCH (RESPONSIVE WIDTH) */}
            <div className="relative w-full lg:w-[55%] xl:w-[60%]">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your order here"
                className="
                   w-full
                   bg-[#121212]
                   pl-9 pr-10
                   py-2.5
                   rounded-xl
                   text-sm
                   border border-white/10
                   outline-none
                   focus:border-white/30
                 "
              />

              {/* CLEAR SEARCH */}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="
                     absolute right-3 top-1/2 -translate-y-1/2
                     text-gray-400 hover:text-white
                     transition cursor-pointer
                   "
                  aria-label="Clear search"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>

            {/* FILTERS (RIGHT SIDE) */}
            <div className="flex items-center gap-3">
              {/* 📱 MOBILE FILTER BUTTON */}
              <button
                onClick={() => {
                  setTempStatusFilter(statusFilter);
                  setTempTimeFilter(timeFilter);
                  setShowMobileFilter(true);
                }}
                className="
                   lg:hidden
                   flex items-center gap-2
                   px-4 py-2.5
                   rounded-xl
                   border border-white/10
                   text-sm
                   hover:bg-white/10
                   active:scale-95
                   transition
                   cursor-pointer
                 "
              >
                <FaFilter />
                Filter
              </button>

              {/* 💻 DESKTOP FILTERS */}
              <div className="hidden lg:flex items-center gap-3">
                <select
                  value={statusFilter[0] || ""}
                  onChange={(e) =>
                    setStatusFilter(e.target.value ? [e.target.value] : [])
                  }
                  className="bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none hover:border-white/30 cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={timeFilter || ""}
                  onChange={(e) => setTimeFilter(e.target.value || null)}
                  className={`bg-[#121212] border rounded-xl px-4 py-2.5 text-sm cursor-pointer
  ${timeFilter ? "border-white/40" : "border-white/10"}
`}
                >
                  <option value="">Any time</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 3 months">Last 3 months</option>
                  <option value="Last 6 months">Last 6 months</option>
                  <option value="Older">Older</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================= MOBILE FILTER PANEL ================= */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#121212] p-4 overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <FaTimes />
              </button>
            </div>

            <hr className="border-white/20 my-4" />

            {/* ORDER STATUS */}
            <h4 className="text-sm font-semibold mb-3 text-gray-300">
              Order Status
            </h4>

            {[
              "Order Placed",
              "Packed",
              "Shipped",
              "Out for Delivery",
              "Delivered",
              "Cancelled",
            ].map((status) => (
              <label
                key={status}
                className="flex items-center gap-3 text-sm cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={tempStatusFilter.includes(status)}
                  onChange={() =>
                    setTempStatusFilter((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status]
                    )
                  }
                  className="w-4 h-4 accent-white cursor-pointer"
                />
                <span>{status}</span>
              </label>
            ))}

            {/* ORDER TIME */}
            <h4 className="text-sm font-semibold mb-3 text-gray-300 mt-6">
              Order Time
            </h4>

            {["Last 30 days", "Last 3 months", "Last 6 months", "Older"].map(
              (time) => (
                <label
                  key={time}
                  className="flex items-center gap-3 text-sm cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="orderTime"
                    checked={tempTimeFilter === time}
                    onChange={() => setTempTimeFilter(time)}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                  <span>{time}</span>
                </label>
              )
            )}

            {/* ACTION BUTTONS */}
            <div className="sticky bottom-0 bg-[#121212] pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setStatusFilter(tempStatusFilter);
                  setTimeFilter(tempTimeFilter);
                  setShowMobileFilter(false);
                }}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition cursor-pointer"
              >
                Apply Filters
              </button>
              {statusFilter.length > 0 && (
                <span className="text-xs text-blue-400">
                  {statusFilter.join(", ")}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setTempStatusFilter([]);
                setTempTimeFilter(null);
                setStatusFilter([]);
                setTimeFilter(null);
                setShowMobileFilter(false);
              }}
              className="w-full py-2 mt-2 rounded-xl border border-white/20 text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-[136px] left-0 right-0 bottom-0 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 lg:py-4 lg:px-10">
          {/* ================= LIST ================= */}
          {loading || !isOnline ? (
            <OrdersSkeletonList />
          ) : orderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              {/* ICON */}
              <div className="mb-6 w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl">
                🛍️
              </div>

              {/* TITLE */}
              <h2 className="text-lg font-semibold text-white">
                No orders yet
              </h2>

              {/* SUBTEXT */}
              <p className="mt-2 text-sm text-gray-400 max-w-xs">
                Looks like you haven’t placed any orders yet. Start shopping to
                see your orders here.
              </p>

              {/* CTA */}
              <button
                onClick={() => navigate("/", { replace: true })}
                className="
              mt-6
              px-6
              py-3
              rounded-xl
              bg-white
              text-black
              text-sm
              font-semibold
              cursor-pointer
              transition
              hover:bg-gray-200
              hover:scale-[1.02]
              active:scale-[0.98]
              "
              >
                Go to Home
              </button>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const status =
                item.itemStatus || item.orderStatus || "Order Placed";

              const latestStatusEntry =
                Array.isArray(item.statusHistory) &&
                item.statusHistory.length > 0
                  ? item.statusHistory[item.statusHistory.length - 1]
                  : null;

              const statusDate = latestStatusEntry?.date || item.orderDate;

              const dateText = new Date(statusDate).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const imageSrc =
                Array.isArray(item.image) && item.image.length > 0
                  ? item.image[0]
                  : "https://via.placeholder.com/120";

              return (
                <div
                  key={`${item.orderId}-${item.productId}-${idx}`}
                  onClick={() =>
                    navigate(`/orders/${item.orderId}/${item.productId}`)
                  }
                  className="
                  relative
                  group
                  grid
                  grid-cols-[72px_1fr_16px]
                  md:grid-cols-[88px_1fr_20px]
                  lg:grid-cols-[120px_1fr_24px]
                  items-start
                  gap-4
                  py-5
                  px-4
                  cursor-pointer
                  transition
                  hover:bg-white/[0.05]
                  "
                >
                  {/* LEFT STATUS ACCENT */}
                  <span
                    className={`
                     absolute left-0 top-0 h-full w-[3px] rounded-r
                     ${
                       status === "Delivered"
                         ? "bg-green-500/70"
                         : status === "Cancelled"
                         ? "bg-red-500/70"
                         : "bg-blue-500/70"
                     }
                     `}
                  />

                  {/* IMAGE */}
                  <div className="flex justify-center">
                    <div className="w-20 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-[#181818]">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* TEXT CONTENT */}
                  <div className="pr-6">
                    <p className="text-xs lg:text-sm font-medium text-gray-400">
                      {status} on{" "}
                      <span className="text-gray-500">{dateText}</span>
                    </p>

                    <p className="mt-1 text-base lg:text-lg font-semibold text-white leading-snug">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-xs lg:text-sm text-gray-400">
                      {item.brandName || "Brawvly"}
                    </p>
                  </div>

                  {/* CHEVRON */}
                  <div
                    className="
                  pr-2
                  text-gray-500
                  text-xl
                  transition
                  group-hover:translate-x-1
                  group-hover:text-white
                  "
                  >
                    ❯
                  </div>

                  {/* DIVIDER */}
                  <span className="absolute bottom-0 w-full right-0 h-px bg-white/10" />
                </div>
              );
            })
          )}
          {orderItems.length > 0 && filteredItems.length === 0 && (
            <div className="text-center py-24 text-gray-400 text-sm">
              No orders match your search or filters
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
