import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ forceOpenKey }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (forceOpenKey !== null) {
      setOpen(true);
    }
  }, [forceOpenKey]);


 const {
    currency = "₹",
    delivery_fee,
    cartItems,
    products,
  } = useContext(ShopContext);



  // Find product
  const findProduct = (id) =>
    products.find((p) => String(p._id) === String(id));

  // ---- TOTAL CALCULATION ----
  const computeTotals = () => {
    let actualTotal = 0;
    let discountedTotal = 0;

    for (const productId in cartItems) {
      const prod = findProduct(productId);
      if (!prod) continue;

      const actual = Number(prod.actualPrice) || 0;
      const discounted = Number(prod.discountedPrice) || actual;

      for (const size in cartItems[productId]) {
        const qty = cartItems[productId][size];
        if (qty > 0) {
          actualTotal += actual * qty;
          discountedTotal += discounted * qty;
        }
      }
    }

    return { actualTotal, discountedTotal };
  };

  const { actualTotal, discountedTotal } = computeTotals();

  const discountAmount = actualTotal - discountedTotal;
  const discountPercentage =
    actualTotal > 0
      ? Math.round((discountAmount / actualTotal) * 100)
      : 0;

  const FREE_LIMIT = 1000;
  const shippingFee = discountedTotal >= FREE_LIMIT ? 0 : delivery_fee;
  const finalTotal = discountedTotal + shippingFee;

  const fmt = (n) => (Number.isInteger(n) ? n : n.toFixed(2));

  return (
    <div className="w-full bg-[#111111] text-gray-300 p-6 rounded-2xl shadow-xl border border-white/10">

      {/* HEADER (COLLAPSE TOGGLE) */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="text-2xl">
          <Title text1="Cart" text2="Totals" />
        </div>

        <div className="text-right">
          <p className="text-white font-bold text-lg">
            {currency} {fmt(finalTotal)}
          </p>
          <p className="text-xs text-red-500">
            {open ? "Hide details ▲" : "View details ▼"}
          </p>
        </div>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {/* Actual price */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400">Actual Price</p>
          <p className="line-through text-gray-500">
            {currency} {fmt(actualTotal)}
          </p>
        </div>

        {/* Discounted price */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400 flex items-center gap-2">
            Discounted Price
            {discountPercentage > 0 && (
              <span className="bg-green-700/20 text-green-300 px-2 py-0.5 text-[11px] rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </p>
          <p className="text-white font-semibold">
            {currency} {fmt(discountedTotal)}
          </p>
        </div>

        {/* Savings */}
        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-gray-500">You save</p>
            <p className="text-green-400 flex items-center gap-2">
              {currency} {fmt(discountAmount)} <span className="text-lg">↓</span>
            </p>
          </div>
        )}

        <hr className="border-gray-800 my-3" />

        {/* Shipping */}
        <div className="flex justify-between">
          <p className="text-gray-400">Shipping</p>
          {shippingFee === 0 ? (
            <div className="flex items-center gap-2">
              <p className="text-green-300">Free Shipping</p>
              <p className="text-gray-600 line-through">
                {currency} {delivery_fee}
              </p>
            </div>
          ) : (
            <p>{currency} {delivery_fee}</p>
          )}
        </div>

        <hr className="border-gray-800 my-3" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <p className="text-white text-lg font-semibold">Total</p>
          <p className="text-xl font-bold text-white">
            {currency} {fmt(finalTotal)}
          </p>
        </div>

        {discountedTotal < FREE_LIMIT && (
          <p className="text-xs text-gray-400 mt-1">
            Add {currency} {fmt(FREE_LIMIT - discountedTotal)} more to get
            <span className="text-white font-medium"> free shipping</span>.
          </p>
        )}
      </div>
    </div>
  );
};

export default CartTotal;

