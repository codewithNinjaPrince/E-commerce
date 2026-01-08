import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotalSkeleton = () => {
  return (
    <div className="w-full bg-[#111111] p-6 rounded-2xl border border-white/10 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-40 bg-gray-700/40 rounded" />
        <div className="h-7 w-24 bg-gray-700/40 rounded" />
      </div>

      {/* Lines */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-32 bg-gray-700/30 rounded" />
            <div className="h-4 w-20 bg-gray-700/40 rounded" />
          </div>
        ))}
      </div>

      <hr className="border-gray-800 my-4" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <div className="h-5 w-24 bg-gray-700/40 rounded" />
        <div className="h-6 w-28 bg-gray-700/50 rounded" />
      </div>

      <div className="h-3 w-3/4 bg-gray-700/30 rounded mt-3" />
    </div>
  );
};

const CartTotal = ({ forceOpenKey, priceData }) => {
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { currency = "₹" } = useContext(ShopContext);

  /* 🌐 ONLINE / OFFLINE */
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

  const formatINR = (amount) => {
    if (amount === null || amount === undefined) return "0";
    return Number(amount).toLocaleString("en-IN");
  };

  /* ================= FORCE OPEN ================= */
  useEffect(() => {
    if (forceOpenKey !== null) setOpen(true);
  }, [forceOpenKey]);

  /* ================= LOADING STATE ================= */
  const isLoading =
    !isOnline || !priceData || typeof priceData.payableAmount !== "number";

  if (isLoading) {
    return <CartTotalSkeleton />;
  }

  const {
    actualTotal = 0,
    discountedAmount = 0,
    deliveryFee = 0,
    codFee = 0,
    payableAmount = 0,
  } = priceData;

  const productDiscountAmount = actualTotal - discountedAmount;

  const discountPercentage =
    actualTotal > 0
      ? Math.round((productDiscountAmount / actualTotal) * 100)
      : 0;

  const fmt = (n) => formatINR(n);

  const FREE_LIMIT = 999;

  const subTotalForDelivery = Number(discountedAmount || 0);

  const subTotal = Number(discountedAmount || 0);

  let nextTarget = null;
  let targetMessage = "";

  if (subTotal < 300) {
    nextTarget = 300;
    targetMessage = "₹29 delivery";
  } else if (subTotal < 600) {
    nextTarget = 600;
    targetMessage = "₹19 delivery";
  } else if (subTotal < 1000) {
    nextTarget = 1000;
    targetMessage = "FREE delivery";
  }

  const remainingForBetterDelivery = nextTarget ? nextTarget - subTotal : 0;

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="w-full bg-[#111111] text-gray-300 p-6 rounded-2xl shadow-xl border border-white/10">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <p className="text-blue-500 text-lg font-semibold">Price Details</p>

        <p className="text-xs text-blue-500">
          {open ? "Hide Details ▲" : "View Details ▼"}
        </p>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <hr className="border-gray-400 my-3" />
        <div className="flex justify-between items-center">
          <p className="text-gray-400">Actual Price</p>
          <p className="line-through text-gray-500">
            {currency} {fmt(actualTotal)}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 flex items-center gap-2">
            Discounted Price
            {discountPercentage > 0 && (
              <span className="font-semibold bg-green-700/20 text-green-300 px-2 py-0.5 text-[11px] rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </p>
          <p className="text-white font-semibold">
            {currency} {fmt(discountedAmount)}
          </p>
        </div>

        <div className="border-t border-dashed border-gray-700/40 my-3" />

        <div className="flex justify-between items-center">
          <p className="text-gray-400">Shipping & Delivery</p>

          {deliveryFee === 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-medium">FREE</span>
              <span className="line-through text-sm">
                {currency} {priceData.originalDeliveryFee ?? 49}
              </span>
            </div>
          ) : (
            <span>
              {currency} {deliveryFee}
            </span>
          )}
        </div>

        {codFee > 0 && (
          <div className="flex justify-between mt-1">
            <span className="text-gray-300">
              Pay on Delivery Convenience Fee
            </span>
            <span>
              {currency} {codFee}
            </span>
          </div>
        )}

        <hr className="border-gray-400 my-3" />

        <div className="flex justify-between text-lg items-center">
          <p className="text-white text-lg font-semibold ">Total Amount</p>
          <p className="text-xl font-bold text-white">
            {currency} {fmt(payableAmount)}
          </p>
        </div>

        <div className="border-t border-dashed border-gray-700/40 my-3" />

        {productDiscountAmount > 0 && (
          <div className="mt-4 bg-green-900/20 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-green-500/20 rounded-full text-green-400">
              ₹
            </div>

            <p className="text-green-400 text-sm font-medium">
              You’ll save {currency} {fmt(productDiscountAmount)} on this order!
            </p>
          </div>
        )}

        {remainingForBetterDelivery > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Add {currency} {fmt(remainingForBetterDelivery)} more to get{" "}
            <span className="text-white font-medium">{targetMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CartTotal;
