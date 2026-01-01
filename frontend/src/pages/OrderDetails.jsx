import React, { useEffect, useState, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRef } from "react";

/* ================= CONF ================= */
const TIMELINE = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery is taking too long",
  "Product no longer needed",
  "Wrong size or variant selected",
  "Change of mind",
  "Payment related issue",
  "Other",
];

/* ================= SKELETON ================= */
const OrderDetailsSkeleton = () => (
  <section className="min-h-screen bg-black text-white pt-[64px] animate-pulse">
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      <div className="h-6 w-40 bg-white/10 rounded" />
      <div className="h-32 bg-white/10 rounded-xl" />
      <div className="h-48 bg-white/10 rounded-xl" />
    </div>
  </section>
);

const OrderDetails = () => {
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const { orderId, productId } = useParams();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAddressConfirm, setShowAddressConfirm] = useState(false);
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  const otherRef = useRef(null);

  /* ================= LOAD ORDER ================= */
  const loadOrder = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/track`,
        { orderId },
        { headers: { token } }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Unable to load order");
        return;
      }

      setOrder(res.data.order);
    } catch {
      toast.error("Unable to load order details");
    } finally {
      setLoading(false);
    }
  };

  const submitCancellation = async () => {
    if (!cancelReason) {
      toast.error("Please select a cancellation reason");
      return;
    }

    if (cancelReason === "Other" && !otherReason.trim()) {
      toast.error("Please tell us the reason");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${backendUrl}/api/order/cancel`,
        {
          orderId,
          productId: focusedItem.productId,
          cancelReason:
            cancelReason === "Other" ? otherReason.trim() : cancelReason,
        },
        { headers: { token } }
      );

      toast.success("Order cancelled successfully");
      setCancelOpen(false);
      setHelpOpen(false);
      loadOrder();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Unable to cancel order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) return <OrderDetailsSkeleton />;
  if (!order) return null;

  /* ================= FOCUS ITEM ================= */
  const focusedItem =
    order.items.find((i) => String(i.productId) === String(productId)) ||
    order.items[0];

  /* ================= CANCELLATION LOGIC ================= */
  const cancellableStatuses = ["Order Placed", "Packing"];

  const canCancel =
    focusedItem &&
    cancellableStatuses.includes(focusedItem.itemStatus || order.status);

  /* ================= STATUS (DEFINE FIRST) ================= */
  const status = focusedItem?.itemStatus || order.status || "Order Placed";

  const isDelivered = status === "Delivered";
  const isCancelled = status === "Cancelled";

  const isShipped =
    status === "Shipped" ||
    status === "Delivered" ||
    status === "Out for Delivery";

  const isItemActive = !isDelivered && !isCancelled;

  const imageSrc =
    Array.isArray(focusedItem.image) && focusedItem.image.length
      ? focusedItem.image[0]
      : "https://via.placeholder.com/300?text=No+Image";

  return (
    <section className="min-h-screen bg-black text-white pt-[64px] pb-24">
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* BACK */}
          <button
            onClick={() => navigate("/orders")}
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <FaArrowLeft />
          </button>

          {/* TITLE */}
          <div className="text-center">
            <p className="font-semibold">Order Details</p>
            <p className="text-xs text-gray-400 truncate max-w-[180px]">
              #{order._id}
            </p>
          </div>

          {/* HELP BUTTON */}
          <div className="w-14 flex justify-end">
            <button
              onClick={() => setHelpOpen(true)}
              className="
              px-4 py-2
              text-sm font-semibold
              rounded-xl
              bg-white text-black
              hover:bg-black hover:text-white
              border border-white/30
              transition-all
              cursor-pointer
              "
              >
              Help
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* ================= PRODUCT ORDER CARD ================= */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
          {/* ================= TOP: PRODUCT INFO ================= */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
            {/* IMAGE */}
            <div className="shrink-0 flex justify-center sm:justify-start">
              <div className="bg-black/40 p-2 rounded-xl">
                <img
                  src={imageSrc}
                  alt={focusedItem.name}
                  className="w-28 h-36 sm:w-32 sm:h-40 rounded-lg object-cover"
                  />
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex-1 space-y-2">
              <h2 className="font-semibold text-lg sm:text-xl leading-snug">
                {focusedItem.name}
              </h2>

              {focusedItem.brandName && (
                 <p className="text-sm text-gray-400">
                  Brand:{" "}
                  <span className="text-gray-300">{focusedItem.brandName}</span>
                </p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                <span>Qty: {focusedItem.quantity}</span>
                {focusedItem.size && <span>Size: {focusedItem.size}</span>}
              </div>

              {/* PRICE */}
              <div className="mt-3 flex items-center gap-3">
                <p className="text-green-400 font-bold text-xl">
                  ₹{focusedItem.discountedPrice ?? focusedItem.actualPrice}
                </p>

                {focusedItem.actualPrice &&
                  focusedItem.discountedPrice &&
                  focusedItem.discountedPrice < focusedItem.actualPrice && (
                     <>
                      <p className="text-sm text-gray-500 line-through">
                        ₹{focusedItem.actualPrice}
                      </p>
                      <span className="text-xs text-green-400 font-medium">
                        {Math.round(
                           ((focusedItem.actualPrice -
                              focusedItem.discountedPrice) /
                              focusedItem.actualPrice) *
                              100
                           )}
                        % OFF
                      </span>
                    </>
                  )}
              </div>
            </div>
          </div>

          {/* ================= PAY NOW (RAZORPAY) ================= */}
          {!order.payment && (
             <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-blue-300">
                Complete payment to continue order processing
              </p>

              <button
                onClick={() => handleRazorpayPayment(order)}
                className="px-6 py-2.5 rounded-lg bg-blue-500 text-black font-semibold hover:bg-blue-600 transition"
                >
                Pay ₹{order.amount}
              </button>
            </div>
          )}

          {/* ================= TIMELINE (COMPACT) ================= */}
          <div className="space-y-3">
            <p className="font-semibold text-sm">Order Status</p>

            {/* DEFAULT: ONLY 2 STEPS */}
            <div className="flex items-center gap-3">
              {TIMELINE.slice(0, TIMELINE.indexOf(status) + 1).map(
                 (stage, idx) => (
                    <div key={stage} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <p className="text-sm text-gray-300">{stage}</p>

                    {idx !== TIMELINE.indexOf(status) && (
                       <div className="w-6 h-[2px] bg-green-500" />
                     )}
                  </div>
                )
               )}
            </div>

            {/* CURRENT STATUS TIME */}
            <p className="text-xs text-gray-400">
              Last updated on{" "}
              {new Date(order.updatedAt).toLocaleString("en-IN")}
            </p>

            {/* EXPAND */}
            <button
              onClick={() => setShowFullTimeline((p) => !p)}
              className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
              {showFullTimeline ? "Hide full tracking" : "View full tracking"}
            </button>

            {/* FULL TIMELINE */}
            {showFullTimeline && (
               <div className="mt-3 space-y-2 border-l border-white/10 pl-4">
                {TIMELINE.map((stage) => (
                   <div key={stage} className="text-sm text-gray-400">
                    • {stage} —{" "}
                    <span className="text-gray-500">
                      {new Date(order.updatedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= DELIVERY ADDRESS ================= */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
          {/* HEADER */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <p className="font-semibold text-base">Delivery Address</p>

            <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 font-medium">
              {order.address.type === "home" ? "Home" : "Address"}
            </span>
          </div>

          {/* BODY */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* NAME + PHONE */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm font-medium text-white">
                {order.address.name}
              </p>

              <p className="text-sm text-gray-400">📞 {order.address.phone}</p>
            </div>

            {/* FULL ADDRESS */}
            <p className="text-sm text-gray-400 leading-relaxed">
              {order.address.houseNo}, {order.address.street},{" "}
              {order.address.locality}, {order.address.city},{" "}
              {order.address.state} - {order.address.pincode}
            </p>

            {/* LANDMARK */}
            {order.address.landmark && (
               <p className="text-xs text-gray-500">
                Landmark: {order.address.landmark}
              </p>
            )}
          </div>
        </div>

        {/* ================= PRICE DETAILS ================= */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="font-semibold text-base">Price Details</p>
          </div>

          {(() => {
             const actual = focusedItem.actualPrice || 0;
             const discounted =
             focusedItem.discountedPrice ?? focusedItem.actualPrice ?? 0;
             
             const discount = Math.max(actual - discounted, 0);
             const totalFees = Math.max(order.amount - discounted, 0);
             
             return (
                <div className="px-4 py-4 space-y-3 text-sm">
                {/* ACTUAL PRICE */}
                <div className="flex justify-between items-center text-gray-400">
                  <span>Actual Price</span>
                  <span>₹{actual}</span>
                </div>

                {/* DISCOUNTED PRICE */}
                <div className="flex justify-between items-center text-gray-300">
                  <span>Discounted Price</span>
                  <span className="font-medium">₹{discounted}</span>
                </div>

                {/* DISCOUNT */}
                {discount > 0 && (
                   <div className="flex justify-between items-center text-green-400">
                    <span>You Save</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}

                {/* FEES */}
                {totalFees > 0 && (
                   <div className="flex justify-between items-center text-gray-400">
                    <span>Total Fees</span>
                    <span>₹{totalFees}</span>
                  </div>
                )}

                {/* DIVIDER */}
                <div className="border-t border-dashed border-white/10 pt-3" />

                {/* TOTAL */}
                <div className="flex justify-between items-center text-white">
                  <span className="text-base font-semibold">Total Amount</span>
                  <span className="text-lg font-bold">₹{order.amount}</span>
                </div>

                {/* PAYMENT INFO */}
                <div className="mt-3 flex flex-col sm:flex-row sm:justify-between gap-1 text-xs">
                  <p className="text-gray-400">
                    Payment Method:
                    <span className="ml-1 uppercase text-gray-300">
                      {order.paymentMethod || "N/A"}
                    </span>
                  </p>

                  <p
                    className={`font-medium ${
                       order.payment ? "text-green-400" : "text-yellow-400"
                     }`}
                     >
                    {order.payment ? "Payment Successful" : "Payment Pending"}
                  </p>
                </div>
              </div>
            );
         })()}
        </div>
      </div>

      {/* ================= HELP PANEL ================= */}
      {helpOpen && (
         <div className="fixed inset-0 z-50">
          <div
            onClick={() => setHelpOpen(false)}
            className="absolute inset-0 bg-black/60"
            />

          <div
            className="
            fixed inset-x-0 bottom-0 z-50
            sm:inset-auto sm:right-6 sm:top-[72px]
            w-full sm:w-[360px]
            bg-[#121212]
            border border-white/10
            rounded-t-2xl sm:rounded-2xl
            shadow-2xl
            animate-slide-up
            "
            >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <p className="font-semibold">Need Help?</p>
              <button
                onClick={() => setHelpOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-sm">
              {!isCancelled && !isDelivered && !isShipped && (
                 <>
                  <button
                    onClick={() => {
                       setHelpOpen(false);
                       setTimeout(() => {
                          setShowAddressConfirm(true);
                        }, 100);
                     }}
                     className="w-full px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer"
                     >
                    Change delivery address
                  </button>

                  <button
                    onClick={() => {
                       setHelpOpen(false);
                       
                       setCancelReason("");
                       setOtherReason("");
                       setCancelOpen(true);
                     }}
                     className="
                     w-full px-4 py-3
                     rounded-xl
                     border border-red-500/30
                     text-red-400
                     hover:bg-red-500/10
                     transition
                     cursor-pointer
                     "
                     >
                    Cancel this item
                  </button>
                </>
              )}

              <button
                onClick={() => {
                   setHelpOpen(false);
                   navigate("/help");
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer"
                  >
                Chat with us
              </button>
            </div>
          </div>
        </div>
      )}
      

      {cancelOpen && (
         <div className="fixed inset-0 z-[70]">
          {/* OVERLAY */}
          <div
            onClick={() => setCancelOpen(false)}
            className="absolute inset-0 bg-black/60 cursor-pointer"
            />

          {/* PANEL */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="
            absolute right-0 top-1/2 -translate-y-1/2
            w-full sm:w-[360px]
            bg-[#121212]
            border-l border-white/10
            rounded-2xl
            shadow-2xl
            animate-slide-in
            max-h-[90vh]
            flex flex-col
            "
            >
            {/* ================= HEADER (FIXED) ================= */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
              <p className="font-semibold">Cancel this item</p>
              <button
                onClick={() => setCancelOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                ✕
              </button>
            </div>

            {/* ================= BODY (SCROLLABLE) ================= */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 text-sm">
              {/* PRODUCT SUMMARY */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{focusedItem.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Quantity: {focusedItem.quantity}
                  </p>
                </div>

                <img
                  src={imageSrc}
                  alt={focusedItem.name}
                  className="w-10 h-12 rounded-lg object-cover object-center border border-white/10 bg-black"
                  />
              </div>

              <p className="text-sm font-medium">Reason for cancellation</p>

              {/* RADIO OPTIONS */}
              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => (
                   <label
                   key={reason}
                   className="
                   flex items-center gap-3
                   px-3 py-2
                   rounded-xl
                   border border-white/10
                   hover:bg-white/5
                   cursor-pointer
                   "
                   >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={() => {
                         setCancelReason(reason);
                         if (reason === "Other") {
                            setTimeout(() => {
                               otherRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                 });
                              }, 100);
                           }
                        }}
                        className="accent-blue-500"
                        />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {/* OTHER TEXTBOX */}
              {cancelReason === "Other" && (
                 <textarea
                 ref={otherRef}
                 value={otherReason}
                 onChange={(e) => setOtherReason(e.target.value)}
                 placeholder="Tell us the reason..."
                 className="
                 w-full
                 mt-2
                 px-3 py-2
                 rounded-xl
                 bg-black
                 border border-white/10
                 text-sm
                 resize-none
                 focus:outline-none focus:border-white/30
                 "
                 rows={3}
                 />
               )}
            </div>

            {/* ================= FOOTER (ALWAYS VISIBLE) ================= */}
            <div className="px-4 py-4 border-t border-white/10 flex gap-3 shrink-0">
              <button
                onClick={() => setCancelOpen(false)}
                disabled={submitting}
                className="
                flex-1 py-3 rounded-xl
                border border-white/20
                hover:bg-white/10
                transition cursor-pointer
                disabled:opacity-50
                "
                >
                Don’t cancel
              </button>

              <button
                onClick={() => {
                   setCancelOpen(false);
                   setShowCancelConfirm(true);
                  }}
                  disabled={submitting}
                  className="
                  flex-1 py-3 rounded-xl
                  bg-red-500 text-black
                  font-semibold
                  hover:bg-red-600
                  transition cursor-pointer
                  disabled:opacity-60
                  flex items-center justify-center
                  "
                  >
                {submitting ? (
                   <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                     "Submit & Cancel"
                  )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCancelConfirm && (
         <div
         className="
         fixed inset-0 z-[80]
         flex items-center justify-center
         bg-black/40 backdrop-blur-[2px]
         "
         >
          {/* CONFIRM BOX */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="
            bg-[#181818]
            w-[90%] max-w-md
            rounded-2xl
            p-6
            border border-white/20
            shadow-[0_0_0_1px_rgba(255,255,255,0.05)]
            text-center
            "
            >
            <h3 className="text-lg font-semibold text-white">
              Cancel this item?
            </h3>

            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Are you sure you want to cancel this item from your order?
            </p>

            <p className="text-xs text-yellow-400 mt-3">
              Once cancelled, this action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              {/* NO */}
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="
                flex-1 py-2.5 rounded-xl
                border border-white/20
                hover:bg-white/10
                transition cursor-pointer
                "
                >
                No, keep item
              </button>

              {/* YES */}
              <button
                onClick={() => {
                   setShowCancelConfirm(false);
                   submitCancellation();
                  }}
                  className="
                  flex-1 py-2.5 rounded-xl
                  bg-red-500 text-black
                  font-semibold
                  hover:bg-red-600
                  transition cursor-pointer
                  "
                  >
                Yes, cancel item
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddressConfirm && (
         <div
         className="
         fixed inset-0 z-[80]
         flex items-center justify-center
         bg-black/40 backdrop-blur-[2px]
         "
         >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
            bg-[#181818]
            w-[90%] max-w-md
            rounded-2xl
            p-6
            border border-white/20
            shadow-2xl
            text-center
            "
            >
            <h3 className="text-lg font-semibold text-white">
              Change delivery address?
            </h3>

            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Are you sure you want to update the delivery address for this
              order?
            </p>

            <p className="text-xs text-yellow-400 mt-3">
              Address change may delay delivery and re-verification may be
              required.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddressConfirm(false)}
                className="
                flex-1 py-2.5 rounded-xl
                border border-white/20
                hover:bg-white/10 transition cursor-pointer
                "
                >
                No
              </button>

              <button
                onClick={() => {
                   setShowAddressConfirm(false);
                   navigate("/address");
                  }}
                  className="
                  flex-1 py-2.5 rounded-xl
                  bg-blue-500 text-black font-semibold
                  hover:bg-blue-600 transition cursor-pointer
                  "
                  >
                Yes, change address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ANIMATION ================= */}
      <style>{`
        @keyframes slideIn {
         from { transform: translateX(100%); }
         to { transform: translateX(0); }
         }
         .animate-slide-in {
            animation: slideIn 0.25s ease-out;
            }
            `}</style>
    </section>
  );
};

export default OrderDetails;