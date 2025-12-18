import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // NEW STATES
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [confirmBox, setConfirmBox] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("merchantToken");
  const merchantId = localStorage.getItem("merchantId");

  /* ================= CONFIRM STATUS CHANGE ================= */
  const openConfirmBox = (action, status) => {
    setPendingAction(() => action);
    setPendingStatus(status);
    setConfirmBox(true);
  };

  const confirmYes = () => {
    if (pendingAction) pendingAction();
    setConfirmBox(false);
    setPendingAction(null);
    setPendingStatus(null);
  };

  const confirmNo = () => {
    setConfirmBox(false);
    setPendingAction(null);
  };

  /* =====================================
     FETCH ALL ORDERS
  =================================== */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/merchant/dashboard/orders`,
        { headers: { token } }
      );

      if (res.data.success) setOrders(res.data.orders);
      else toast.error("Unable to load orders");
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE ITEM STATUS ================= */
  const updateStatus = async (orderId, productId, newStatus) => {
    const key = `${orderId}-${productId}`;
    setUpdating(key);

    try {
      const res = await axios.post(
        `${backendUrl}/api/merchant/dashboard/update-merchant-item-status`,
        { orderId, productId, status: newStatus },
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => {
            if (o._id !== orderId) return o;

            return {
              ...o, // 🔥 order ka saara data safe rahega
              items: o.items.map((item) =>
                item.productId === productId
                  ? { ...item, itemStatus: newStatus }
                  : item
              ),
            };
          })
        );

        toast.success("Status updated");
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch {
      toast.error("Unable to update status");
    }

    setUpdating(null);
  };

  //     /* ================= FILTER ================= */

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;

    if (filter === "pending") {
      return order.items.some((item) =>
        ["Order Placed", "Packing", "Shipped", "Out for Delivery"].includes(
          item.itemStatus
        )
      );
    }

    if (filter === "Cancelled") {
      return order.items.some((item) => item.itemStatus === "Cancelled");
    }

    return order.items.some((item) => item.itemStatus === filter);
  });

  //    /* ================= SORT ================= */

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sort === "latest" ? dateB - dateA : dateA - dateB;
  });

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="text-center text-white mt-20 text-lg animate-pulse">
        Loading Orders…
      </div>
    );

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 text-white">
      {/* HEADER */}
      <h2 className="text-3xl font-bold flex items-center gap-3 mb-6">
        <FaBoxOpen className="text-blue-400" /> Orders Management
      </h2>

      {/* FILTERS & SORT */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {[
          { label: "All", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Shipped", value: "Shipped" },
          { label: "Delivered", value: "Delivered" },
          { label: "Cancelled", value: "Cancelled" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition
            ${
              filter === btn.value
                ? "bg-blue-600 text-white"
                : "bg-[#1b1b1b] text-gray-300 hover:bg-[#2a2a2a]"
            }`}
          >
            {btn.label}
          </button>
        ))}

        <button
          onClick={() => setSort(sort === "latest" ? "oldest" : "latest")}
          className="ml-auto px-4 py-2 rounded-lg text-sm cursor-pointer bg-[#1b1b1b] text-gray-300 hover:bg-[#2a2a2a] transition"
        >
          Sort: {sort === "latest" ? "Latest" : "Oldest"}
        </button>
      </div>

      {/* EMPTY STATE */}
      {sortedOrders.length === 0 && (
        <div className="bg-[#101010] border border-[#222] py-16 rounded-xl text-center mt-10">
          <p className="text-xl font-semibold">No Orders Found</p>
        </div>
      )}

      {/* ORDER LIST */}
      <div className="flex flex-col gap-8 mt-6">
        {sortedOrders.map((order) => {
          // ✅ ONLY LOGIC ADDITION (NO UI CHANGE)
          const orderItemTotal = order.items.reduce(
            (sum, item) => sum + item.discountedPrice * item.quantity,
            0
          );

          return (
            <div
              key={order._id}
              className="bg-[#131313] border border-[#222] rounded-xl p-6 shadow-lg hover:border-blue-500/30 transition-all duration-200"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <div>
                  <p className="font-semibold text-lg">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.date).toLocaleString()}
                  </p>
                </div>

                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800/50 text-gray-300">
                  {order.status}
                </span>
              </div>

              {/* CUSTOMER SECTION */}
              {/* CUSTOMER SECTION */}
              <div className="mt-2 mb-4 bg-[#0f0f0f] p-4 rounded-lg border border-[#222]">
                <p className="text-blue-400 text-xs">Customer Details</p>

                <p className="text-white font-semibold text-sm mt-1">
                  {order.address?.firstName} {order.address?.lastName}
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  📞 {order.address?.phone}
                </p>

                <p className="text-gray-400 text-xs mt-3">
                  <span className="font-medium text-gray-300">Address:</span>
                  <br />
                  {order.address?.houseNo && (
                    <>
                      {order.address.houseNo},<br />
                    </>
                  )}
                  {order.address?.street && (
                    <>
                      {order.address.street},<br />
                    </>
                  )}
                  {order.address?.locality && (
                    <>
                      {order.address.locality},<br />
                    </>
                  )}
                  {order.address?.landmark && (
                    <>
                      Landmark: {order.address.landmark}
                      <br />
                    </>
                  )}
                  {order.address?.district && <>{order.address.district}, </>}
                  {order.address?.city}, {order.address?.state}
                  <br />
                  {order.address?.country} – {order.address?.pincode}
                </p>
              </div>

              {/* ITEMS */}
              <div className="divide-y divide-[#222]">
                {order.items.map((item) => {
                  const key = `${order._id}-${item.productId}`;
                  const isUpdating = updating === key;

                  const flow = [
                    "Order Placed",
                    "Packing",
                    "Shipped",
                    "Out for Delivery",
                    "Delivered",
                  ];

                  const currentIndex = flow.indexOf(item.itemStatus);
                  const allowedNext = flow[currentIndex + 1];

                  const disabled =
                    isUpdating ||
                    item.itemStatus === "Cancelled" ||
                    item.itemStatus === "Delivered";

                  return (
                    <div
                      key={item.productId}
                      className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image?.[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-[#333]"
                        />

                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-400 text-xs">
                            Brand: {item.brandName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Size: {item.size}
                          </p>
                          <p className="text-gray-200 text-xs mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <select
                        value={item.itemStatus} // 👈 value SAME rahega
                        disabled={disabled}
                        onChange={(e) => {
                          const status = e.target.value;

                          if (
                            status !== allowedNext &&
                            status !== "Cancelled"
                          ) {
                            toast.error("You can only move to the next stage.");
                            return;
                          }

                          // 🔥 DO NOT CHANGE VALUE YET
                          openConfirmBox(
                            () =>
                              updateStatus(order._id, item.productId, status),
                            status
                          );
                        }}
                        className={`bg-[#0f0f0f] border border-[#333] p-2 rounded-lg cursor-pointer ${
                          disabled ? "opacity-50" : "hover:bg-[#1a1a1a]"
                        }`}
                      >
                        <option value={item.itemStatus}>
                          {item.itemStatus}
                        </option>
                        {allowedNext && (
                          <option value={allowedNext}>{allowedNext}</option>
                        )}
                        {currentIndex <= 1 && (
                          <option value="Cancelled">Cancelled</option>
                        )}
                      </select>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-xl text-blue-400">₹{orderItemTotal}</p>

                <p className="text-sm text-gray-400">
                  Payment:{" "}
                  <span
                    className={`font-semibold ${
                      order.payment ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {order.payment ? "Completed" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {confirmBox && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-[#131313] border border-[#222] rounded-xl p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-white">
              Confirm Status Update
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Are you sure you want to update this order status?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6 ">
              <button
                onClick={confirmNo}
                className="px-4 py-2 rounded-lg bg-[#1b1b1b] text-gray-300 hover:bg-[#2a2a2a] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmYes}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
