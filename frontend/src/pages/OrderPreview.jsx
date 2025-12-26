import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaHome,
  FaBriefcase,
  FaStar,
  FaTimes,
  FaStarHalfAlt,
  FaChevronDown,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

/* ---------------- QUOTES ---------------- */
const QUOTES = [
  "Almost there 🚀",
  "Your order is getting ready",
  "Great choice! ✨",
  "This one’s popular 🔥",
  "You’re going to love this",
  "Quality checked ✔️",
  "Handpicked for you",
  "Trending item 💙",
  "Smart shopping choice",
  "Brawvly recommends 👍",
];

/* ---------------- HELPERS ---------------- */
const randomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 9);
  return d.toDateString();
};

/* ================= PAGE ================= */
const OrderPreview = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    products,
    updateQuantity,
    addToCart,
  } = useContext(ShopContext);

  const location = useLocation();
  const cartTotalRef = useRef(null);

  const [priceData, setPriceData] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [cartOpenKey, setCartOpenKey] = useState(0);
  const [sizeEdit, setSizeEdit] = useState(null);

  const [address, setAddress] = useState(null);
  const [localCartOverride, setLocalCartOverride] = useState(null);


  useEffect(() => {
    const loadSelectedAddress = async () => {
      try {
        if (!token) return;

        const selectedId = localStorage.getItem("selectedAddressId");

        const res = await axios.get(`${backendUrl}/api/address/get`, {
          headers: { token },
        });

        if (res.data.success) {
          const found = res.data.addresses.find(
            (a) => a.addressId === selectedId
          );

          setAddress(found || null);
        }
      } catch (err) {
        toast.error("Failed to load delivery address");
      }
    };

    loadSelectedAddress();
  }, [token]);

  /* ---------------- BUILD ITEMS ---------------- */
  
  
  const buildItems = () => {
  const source = localCartOverride || cartItems;
  let items = [];

  Object.keys(source).forEach((pid) => {
    Object.keys(source[pid]).forEach((size) => {
      if (source[pid][size] > 0) {
        items.push({
          productId: pid,
          size,
          quantity: source[pid][size],
        });
      }
    });
  });

  return items;
};


  const handleSizeChange = async (item, product, newSize) => {
  if (newSize === item.size) return;

  // 🔥 1. Optimistic local update (IMMEDIATE UI FIX)
  setLocalCartOverride((prev) => {
    const clone = JSON.parse(JSON.stringify(prev || cartItems));

    // remove old size
    delete clone[item.productId][item.size];

    // add new size
    clone[item.productId][newSize] = item.quantity;

    return clone;
  });

  // 🔥 2. Backend sync
  await updateQuantity(item.productId, item.size, 0);
  await updateQuantity(item.productId, newSize, item.quantity);

  // 🔥 3. Clear override after backend sync
  setLocalCartOverride(null);

  toast.success(`Size changed to ${newSize}`, {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    theme: "dark",
  });

  setSizeEdit(null);
};


  /* ---------------- LOAD PRICE ---------------- */
  useEffect(() => {
    if (!Object.keys(cartItems).length) return;

    const loadPreview = async () => {
      try {
        const res = await axios.post(
          `${backendUrl}/api/order/preview`,
          {
            items: buildItems(),
            couponCode: couponValid ? couponCode : null,
          },
          { headers: { token } }
        );

        if (res.data.success) {
          setPriceData(res.data);
        }
      } catch {
        toast.error("Failed to load order preview");
      }
    };

    loadPreview();
  }, [cartItems, couponValid, couponCode]); // 🔥 cartItems added

  if (!priceData) return null;

  /* ================= RENDER ================= */
  return (
    <section className="min-h-screen bg-black text-white pt-[64px] pb-28">
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <FaArrowLeft />
          </button>

          {/* TITLE */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Step 2 of 3</p>
            <p className="font-semibold">Order Preview</p>
          </div>

          {/* CLOSE → CART */}
          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-6 mt-4 sm:mt-6">
        {/* ================= ADDRESS ================= */}
        <div
          onClick={() => navigate("/address")}
          className="bg-[#121212] p-5 rounded-2xl border border-white/10 cursor-pointer transition hover:border-white/30"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            {/* LEFT */}
            <div className="flex gap-4">
              {/* ICON */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                {address?.type === "home" ? (
                  <FaHome className="text-white/80" />
                ) : (
                  <FaBriefcase className="text-white/80" />
                )}
              </div>

              {/* TEXT */}
              <div>
                <p className="text-xs uppercase tracking-wide text-white ">
                  Deliver to <span className="text-base text-white">:</span>
                </p>

                <p className="text-base font-semibold text-white mt-0.5">
                  Name : {address?.name}
                </p>

                <p className="text-sm text-white/90 leading-relaxed max-w-[520px] mt-1">
                  {address?.houseNo}, {address?.street}, {address?.locality},{" "}
                  {address?.city} – {address?.pincode}
                </p>

                <p className="text-sm text-white mt-1">
                  Mobile :{" "}
                  <span className="text-white font-medium">
                    {address?.phone}
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT (md+) */}
            <div className="hidden md:flex items-center self-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/address");
                }}
                className="px-4 py-2 rounded-lg border border-white/20 text-sm text-green-500 hover:border-white/40 hover:bg-white/5 transition cursor-pointer whitespace-nowrap"
              >
                Change address
              </button>
            </div>
          </div>

          {/* MOBILE CTA */}
          <div className="md:hidden mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/address");
              }}
              className="w-full py-2 rounded-xl border border-white/20 text-sm text-green-500 hover:bg-white/5 transition cursor-pointer"
            >
              Change delivery address
            </button>
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}
        {buildItems().map((item, idx) => {
          const product = products.find((p) => p._id === item.productId);
          if (!product) return null;

          const rating = product.review || 4.5;
          const discountPercent = Math.round(
            ((product.actualPrice - product.discountedPrice) /
              product.actualPrice) *
              100
          );

          return (
            <div
              key={idx}
              className="bg-[#121212] rounded-2xl border border-white/10 p-4 sm:p-5 transition hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] cursor-pointer"
            >
              <p className="text-green-400 text-sm mb-3">{randomQuote()}</p>

              <div className="flex gap-4 sm:gap-5">
                {/* IMAGE + QTY */}
                <div className="w-24 sm:w-28 flex-shrink-0">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-28 sm:h-32 object-cover rounded-xl border border-white/10"
                  />

                  <select
                    disabled={!priceData}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        Number(e.target.value)
                      )
                    }
                    className="w-full mt-4 bg-black border border-white/20 rounded-lg px-2 py-1 text-sm text-white focus:border-white/40 outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {product.sizes.map((sz) => (
                      <option
                        key={sz}
                        value={sz}
                        disabled={product.stock && product.stock[sz] <= 0}
                      >
                        {sz}
                        {product.stock && product.stock[sz] <= 0
                          ? " (Out of stock)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DETAILS */}
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-semibold text-white truncate">
                    {product.name}
                  </p>

                  <p className="text-xs uppercase tracking-wide text-gray-200 mt-0.5">
                    {product.brandName}
                  </p>

                  {/* SIZE ROW */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
                    {/* LEFT — SIZE TEXT */}
                    <p className="text-sm text-gray-300">
                      Size:
                      <span className="text-white font-medium ml-1">
                        {item.size}
                      </span>
                    </p>

                    {/* RIGHT — CHANGE SIZE (md+) */}
                    <div className="hidden md:flex">
                      {sizeEdit === item.productId + item.size ? (
                        <select
                          defaultValue={item.size}
                          onChange={(e) =>
                            handleSizeChange(item, product, e.target.value)
                          }
                          className="px-4 py-2 rounded-lg border border-white/20 bg-black text-sm text-white cursor-pointer"
                        >
                          {product.sizes
                            .filter(
                              (sz) => !product.stock || product.stock[sz] > 0
                            )
                            .map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSizeEdit(item.productId + item.size);
                          }}
                          className="px-4 py-2 rounded-lg border border-white/20 text-sm text-green-500 hover:border-white/40 hover:bg-white/5 transition cursor-pointer"
                        >
                          Change size
                        </button>
                      )}
                    </div>
                  </div>

                  {/* MOBILE CTA */}
                  <div className="md:hidden mt-3">
                    {sizeEdit === item.productId + item.size ? (
                      <select
                        defaultValue={item.size}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const newSize = e.target.value;
                          if (newSize === item.size) return;
                          setSizeEdit(null);
                        }}
                        className="w-full py-2 rounded-xl border border-white/20 bg-black text-sm text-white focus:border-white/40 outline-none cursor-pointer"
                      >
                        {product.sizes.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSizeEdit(item.productId + item.size);
                        }}
                        className="w-full py-2 rounded-xl border border-white/20 text-sm text-green-500 hover:bg-white/5 transition cursor-pointer"
                      >
                        Change size
                      </button>
                    )}

                    {sizeEdit === item.productId + item.size && (
                      <div
                        className="mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          defaultValue={item.size}
                          onChange={(e) => {
                            const newSize = e.target.value;
                            if (newSize === item.size) return;

                            // ✅ SUCCESS TOAST
                            toast.success(`Size changed to ${newSize}`, {
                              position: "top-center",
                              autoClose: 1500,
                              hideProgressBar: true,
                              theme: "dark",
                            });

                            setSizeEdit(null);
                          }}
                          className="
        bg-black
        border border-white/20
        rounded-lg
        px-3 py-1
        text-sm text-white
        cursor-pointer
        focus:border-white/40
      "
                        >
                          {product.sizes.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-1 mt-2 text-yellow-400 text-sm">
                    {[...Array(Math.floor(rating))].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                    {rating % 1 !== 0 && <FaStarHalfAlt />}
                    <span className="text-gray-400 ml-1">
                      {rating} ({product.noOfPeopleReviewed})
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-green-400 font-semibold text-lg">
                      ₹{product.discountedPrice}
                    </span>

                    <span className="text-gray-500 line-through text-sm">
                      ₹{product.actualPrice}
                    </span>

                    <span className="text-green-500 text-sm font-medium">
                      ↓ {discountPercent}% OFF
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 mt-3">
                    Delivery by -
                    <span className="text-white ml-2 mr-2 sm:ml-2 sm:mr-2 ">
                      {deliveryDate()},
                    </span>
                    10 PM
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* ================= CART TOTAL ================= */}
        <div ref={cartTotalRef}>
          <CartTotal priceData={priceData} forceOpenKey={cartOpenKey} />
        </div>

        {/* ================= COUPON ================= */}
        <div className="bg-[#121212] p-4 rounded-xl border border-white/10">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="w-full bg-black border border-white/20 rounded p-3"
          />
          <button
            onClick={() => setCouponValid(true)}
            className="mt-3 w-full bg-white text-black py-2 rounded font-semibold"
          >
            Apply Coupon
          </button>
        </div>

        {/* ================= TERMS ================= */}
        <p className="text-xs text-gray-400 text-center">
          By continuing, you confirm you are 18+ and agree to Brawvly’s{" "}
          <span className="text-blue-400 cursor-pointer">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="text-blue-400 cursor-pointer">Privacy Policy</span>.
        </p>
      </div>

      {/* ================= STICKY CONTINUE ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            onClick={() => {
              setCartOpenKey((k) => k + 1);
              cartTotalRef.current?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="cursor-pointer"
          >
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="text-lg font-bold">₹{priceData.payableAmount}</p>
          </div>

          <button
            onClick={() => navigate("/payment")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderPreview;