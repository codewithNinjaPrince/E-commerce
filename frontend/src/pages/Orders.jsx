import React, { useContext, useEffect, useState, useRef } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiBox } from "react-icons/fi";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import { useLayoutEffect } from "react";

/**
 * Orders.jsx
 * Merged orders + per-item tracking + cancel
 * Horizontal timeline on desktop, vertical on mobile
 */

const TIMELINE_STAGES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const OrdersSkeleton = () => {
  return (
    <section className="pt-20 pb-16 px-2 sm:px-4 md:px-6 animate-pulse">
      <div className="max-w-7xl mx-auto bg-black/90 border border-white/10 rounded-2xl p-6">
        {/* TITLE */}
        <div className="h-7 w-40 bg-gray-700/40 rounded mb-8" />

        {/* ORDER CARDS */}
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-white/10 rounded-xl p-4 mb-6"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <div className="space-y-2">
                <div className="h-3 w-40 bg-gray-700/40 rounded" />
                <div className="h-3 w-32 bg-gray-700/30 rounded" />
              </div>
              <div className="h-4 w-20 bg-gray-700/40 rounded" />
            </div>

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-700/40 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 bg-gray-700/40 rounded" />
                <div className="h-3 w-1/3 bg-gray-700/30 rounded" />
                <div className="h-4 w-1/4 bg-gray-700/40 rounded" />
              </div>
            </div>

            {/* TIMELINE */}
            <div className="mt-6 flex gap-2">
              {[1, 2, 3, 4, 5].map((_, j) => (
                <div key={j} className="flex-1 h-2 bg-gray-700/30 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Orders = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState({});
  const [confirmUI, setConfirmUI] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  const animRef = useRef({});
  const [, tick] = useState(0);

  const keyFor = (orderId, productId) => `${orderId}-${productId}`;

  const stageIndex = (stage) => {
    const idx = TIMELINE_STAGES.indexOf(stage);
    return idx === -1 ? 0 : idx;
  };

  const getItemStatus = (order, item) => {
    if (item.itemStatus === "Cancelled") return "Cancelled";
    if (order.status === "Cancelled") return "Cancelled";
    return item.itemStatus || item.status || order.status || "Order Placed";
  };

  // --------------------------- LOAD ORDERS --------------------------
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
        toast.error(res.data.message || "Could not fetch orders");
        setOrders([]);
        setLoading(false);
        return;
      }

      const fetched = Array.isArray(res.data.orders) ? res.data.orders : [];

      setOrders(fetched);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  const setAction = (key, type, value) => {
    setActionLoading((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [type]: value },
    }));
  };

  // --------------------------- TRACK ORDER -------------------------
  const trackOrder = async (orderId) => {
    if (!token) return toast.error("Not authorized");

    const k = `${orderId}-track`;
    setAction(k, "track", true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/track`,
        { orderId },
        { headers: { token } }
      );

      if (res.data.success && res.data.order) {
        setOrders((prev) =>
          prev.map((o) => {
            if (String(o._id) !== String(orderId)) return o;

            const oldItems = o.items || [];
            const newItems = res.data.order.items || [];

            newItems.forEach((fi) => {
              const old = oldItems.find(
                (oi) => String(oi.productId) === String(fi.productId)
              );
              const oldStage = old
                ? old.itemStatus || old.status || o.status
                : null;
              const newStage =
                fi.itemStatus || fi.status || res.data.order.status;

              if (
                oldStage &&
                TIMELINE_STAGES.indexOf(newStage) >
                TIMELINE_STAGES.indexOf(oldStage)
              ) {
                animRef.current[keyFor(orderId, fi.productId)] = Date.now();
              }
            });

            return {
              ...o,
              status: res.data.order.status,
              items: o.items.map((oldItem) => {
                const updated = res.data.order.items.find(
                  (ni) => String(ni.productId) === String(oldItem.productId)
                );

                return updated
                  ? { ...oldItem, ...updated } // 👈 image preserved
                  : oldItem;
              }),
            };
          })
        );

        tick((t) => t + 1);
        toast.success("Order status updated");
      } else {
        toast.error(res.data.message || "Could not fetch updated status");
      }
    } catch (err) {
      toast.error("Unable to update status");
    } finally {
      setAction(k, "track", false);
    }
  };

  // --------------------------- CANCEL ITEM -------------------------
  const cancelItem = async (orderId, productId) => {
    if (!token) return toast.error("Not authorized");

    const k = keyFor(orderId, productId);
    setAction(k, "cancel", true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId, productId },
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => {
            if (String(o._id) !== String(orderId)) return o;

            const items = o.items.map((it) =>
              String(it.productId) === String(productId)
                ? { ...it, itemStatus: "Cancelled" }
                : it
            );

            return { ...o, items };
          })
        );
        toast.success("Item cancelled");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Unable to cancel item");
    } finally {
      setAction(k, "cancel", false);
    }
  };

  const isAnimated = (orderId, productId) => {
    const ts = animRef.current[keyFor(orderId, productId)];
    if (!ts) return false;
    return Date.now() - ts < 3000;
  };

  const shouldShowSkeleton =
    loading || !isOnline || (token && !loading && orders.length === 0);

  if (shouldShowSkeleton) {
    return <OrdersSkeleton />;
  }

  // --------------------------- UI RENDER -------------------------
  return (
    <>
      {/* PAGE WRAPPER */}
      <section className="pt-20 sm:pt-22 lg:pt-26 pb-16 px-2 sm:px-4 md:px-6">
        <div
          className="
          max-w-9xl mx-auto
          bg-black/90
          border border-white/10
          rounded-2xl
          shadow-[0_0_40px_rgba(255,255,255,0.06)]
          overflow-hidden
        "
        >
          <div className="px-2 sm:px-4 md:px-8 py-8 text-white">
            {/* TITLE */}
            <div className="text-2xl mb-6">
              <Title text1="Your" text2="Orders" />
            </div>

            {!loading && orders.length === 0 && (
              <div className="flex flex-col items-center py-20">
                <FiBox size={90} className="text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
                <p className="text-gray-500">
                  Start shopping to place your first order!
                </p>
              </div>
            )}

            {!loading && orders.length > 0 && (
              <div className="max-w-7xl mx-auto px-1 sm:px-3 md:px-5 lg:px-8 space-y-2">
                {orders.map((order) => (
                  <article
                    key={order._id}
                    className="bg-[#1c1c1c] p-2 sm:p-3 md:p-5 lg:p-8 rounded-xl border border-white/10 shadow-md"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-start flex-wrap gap-3 md:gap-8 lg:gap-10">
                      <div>
                        <p className="text-sm text-gray-400">
                          Order ID:{" "}
                          <span className="text-gray-200 break-all">
                            {order._id}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Placed on{" "}
                          <span className="text-gray-200">
                            {new Date(order.date).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-400">Payment</p>
                        <p
                          className={`font-semibold ${order.payment ? "text-green-400" : "text-red-400"
                            }`}
                        >
                          {order.payment ? "Completed" : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="mt-6 space-y-4">
                      {order.items.map((item, idx) => {
                        const itemKey = keyFor(order._id, item.productId);
                        const status = getItemStatus(order, item);
                        const statusIdx = stageIndex(status);
                        const animate = isAnimated(order._id, item.productId);
                        const isCancelled =
                          item.itemStatus === "Cancelled" ||
                          order.status === "Cancelled";

                        const loadingTrack =
                          actionLoading[`${order._id}-track`]?.track || false;
                        const loadingCancel =
                          actionLoading[itemKey]?.cancel || false;

                        const imageSrc =
                          Array.isArray(item.image) && item.image.length > 0
                            ? item.image[0]
                            : "https://via.placeholder.com/150?text=No+Image";

                        return (
                          <div
                            key={idx}
                            className="flex flex-col lg:flex-row gap-4 sm:gap-8 bg-[#121212] p-4 rounded-lg border border-white/10"
                          >
                            <div className="flex-shrink-0">
                              <img
                                src={imageSrc}
                                alt={item.name}
                                className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border border-gray-700"
                                loading="lazy"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <p className="font-semibold text-lg">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Brand:{" "}
                                  <span className="text-gray-300">
                                    {item.brandName || "—"}
                                  </span>
                                </p>

                                <div className="flex gap-2 items-center mt-3">
                                  <p className="text-green-400 font-bold text-lg">
                                    {currency}{" "}
                                    {item.discountedPrice || item.price}
                                  </p>
                                  {item.actualPrice && (
                                    <p className="text-gray-500 line-through">
                                      {currency} {item.actualPrice}
                                    </p>
                                  )}
                                </div>

                                <div className="flex gap-4 mt-2 text-sm text-gray-300">
                                  <p>Qty: {item.quantity}</p>
                                  <p>Size: {item.size}</p>
                                </div>
                              </div>

                              {/* TIMELINE */}
                              {/* STATUS / TIMELINE */}
                              <div className="mt-4">
                                {/* ❌ CANCELLED UI */}
                                {isCancelled ? (
                                  <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-4">
                                    <p className="text-red-400 font-semibold text-sm flex items-center gap-2">
                                      ❌ Order Cancelled
                                    </p>
                                    <p className="text-red-300 text-xs mt-1">
                                      This item has been cancelled and will not
                                      be delivered.
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    {/* ✅ MOBILE VERTICAL TIMELINE */}
                                    <div className="flex flex-col gap-3 lg:hidden">
                                      {TIMELINE_STAGES.map((stage, sIdx) => {
                                        const done = sIdx <= statusIdx;
                                        const animateHere =
                                          animate && sIdx === statusIdx;

                                        return (
                                          <div
                                            key={stage}
                                            className="flex items-center gap-3"
                                          >
                                            <div className="flex flex-col items-center">
                                              <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center ${done
                                                    ? "bg-green-500"
                                                    : "bg-gray-600"
                                                  }`}
                                              >
                                                {done && (
                                                  <FaCheckCircle className="text-white text-[12px]" />
                                                )}
                                              </div>

                                              {sIdx <
                                                TIMELINE_STAGES.length - 1 && (
                                                  <div
                                                    className={`w-[2px] h-6 mt-1 ${done
                                                        ? "bg-green-500"
                                                        : "bg-gray-700"
                                                      }`}
                                                  />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                              <p
                                                className={`text-sm ${done
                                                    ? "text-gray-200 font-semibold"
                                                    : "text-gray-400"
                                                  }`}
                                              >
                                                {stage}
                                              </p>

                                              {animateHere && (
                                                <div className="mt-1 w-full">
                                                  <div className="h-1 bg-gray-700 rounded overflow-hidden">
                                                    <div className="h-1 bg-green-500 animate-grow" />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* ✅ DESKTOP HORIZONTAL TIMELINE */}
                                    <div className="hidden lg:flex items-start w-full">
                                      {TIMELINE_STAGES.map((stage, sIdx) => {
                                        const done = sIdx <= statusIdx;
                                        const isLast =
                                          sIdx === TIMELINE_STAGES.length - 1;

                                        return (
                                          <div
                                            key={stage}
                                            className="flex-1 flex flex-col items-center"
                                          >
                                            <div className="flex items-center w-full">
                                              {sIdx !== 0 && (
                                                <div
                                                  className={`h-[2px] flex-1 ${done
                                                      ? "bg-green-500"
                                                      : "bg-gray-700"
                                                    }`}
                                                />
                                              )}

                                              <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center ${done
                                                    ? "bg-green-500"
                                                    : "bg-gray-600"
                                                  }`}
                                              >
                                                {done && (
                                                  <FaCheckCircle className="text-white text-[12px]" />
                                                )}
                                              </div>

                                              {!isLast && (
                                                <div
                                                  className={`h-[2px] flex-1 ${done
                                                      ? "bg-green-500"
                                                      : "bg-gray-700"
                                                    }`}
                                                />
                                              )}
                                            </div>

                                            <p
                                              className={`mt-3 text-sm ${done
                                                  ? "text-gray-200 font-semibold"
                                                  : "text-gray-400"
                                                }`}
                                            >
                                              {stage}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            {/* ACTION BUTTONS */}
                            <div
                              className="
    flex
    flex-col
    gap-3
    w-full
    mt-4

    lg:mt-0
    lg:w-[140px]
    lg:flex-col
    lg:justify-end
  "
                            >
                              {/* TRACK BUTTON */}
                              <button
                                onClick={() => trackOrder(order._id)}
                                disabled={loadingTrack || isCancelled}
                                className={`
    w-full
    h-[42px]
    rounded-md
    text-sm
    font-semibold
    transition
    flex items-center justify-center gap-2 cursor-pointer
    ${isCancelled
                                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                    : "bg-white text-black hover:bg-gray-300"
                                  }
  `}
                              >
                                {loadingTrack ? (
                                  <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <FaTruck /> Track
                                  </>
                                )}
                              </button>

                              {/* CANCEL BUTTON — ONLY IF ORDER PLACED */}
                              {status === "Order Placed" && !isCancelled && (
                                <button
                                  onClick={() =>
                                    setCancelModal({
                                      orderId: order._id,
                                      productId: item.productId,
                                    })
                                  }
                                  className="
    w-full
    cursor-pointer 
    h-[42px]
    bg-red-600
    text-white
    rounded-md
    text-sm
    font-semibold
    hover:bg-red-700
    transition
  "
                                >
                                  {loadingCancel ? "Cancelling…" : "Cancel"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* BOTTOM SUMMARY */}
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm text-gray-400">
                        Items:{" "}
                        <span className="text-gray-200">
                          {order.items.length}
                        </span>
                      </p>

                      <div className="text-right">
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="text-xl font-semibold text-blue-400">
                          {currency} {order.amount}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {cancelModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#1f1f1f] w-[90%] max-w-sm p-6 rounded-xl border border-red-500/50 shadow-xl">
                  <h3 className="text-lg font-semibold text-white">
                    Cancel Item?
                  </h3>
                  <p className="text-gray-300 mt-2 text-sm">
                    If you cancel now, you may not be able to avail this deal again. Do you still want to cancel?
                  </p>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setCancelModal(null)}
                      className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600"
                    >
                      Don't Cancel
                    </button>

                    <button
                      onClick={() => {
                        cancelItem(cancelModal.orderId, cancelModal.productId);
                        setCancelModal(null);
                      }}
                      className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            <style>{`
        @keyframes grow {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-grow {
          animation-name: grow;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
          </div>
        </div>
      </section>
    </>
  );
};

export default Orders;
