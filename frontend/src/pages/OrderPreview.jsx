import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useLayoutEffect } from "react";

import {
  FaArrowLeft,
  FaHome,
  FaBriefcase,
  FaStar,
  FaTimes,
  FaStarHalfAlt,
  FaChevronRight,
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

// 🇮🇳 Indian currency formatter
const formatINR = (amount) => {
  if (amount === null || amount === undefined) return "0";
  return Number(amount).toLocaleString("en-IN");
};

const OrderPreviewSkeleton = () => {
  return (
    <section className="min-h-screen bg-black text-white pt-[64px] pb-28 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* ADDRESS SKELETON */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-4 w-52 bg-white/10 rounded" />
              <div className="h-3 w-64 bg-white/10 rounded" />
            </div>
          </div>
        </div>

        {/* PRODUCT SKELETON */}
        {[1, 2].map((i) => (
          <div
          key={i}
          className="bg-[#121212] p-5 rounded-2xl border border-white/10"
          >
            <div className="flex gap-4">
              <div className="w-24 h-32 bg-white/10 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-1/3 bg-white/10 rounded" />
                <div className="h-4 w-1/4 bg-white/10 rounded" />
                <div className="h-3 w-2/5 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ))}

        {/* TOTAL SKELETON */}
        <div className="bg-[#121212] p-4 rounded-xl border border-white/10">
          <div className="h-4 w-40 bg-white/10 rounded" />
          <div className="h-6 w-32 bg-white/10 rounded mt-3" />
        </div>
      </div>
    </section>
  );
};

/* ---------------- HELPERS ---------------- */
const randomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 9);
  
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

/* ================= PAGE ================= */
const OrderPreview = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const {
    backendUrl,
    token,
    cartItems,
    products,
    updateQuantity,
    addToCart,
    buyNowItem,
    setBuyNowItem,
  } = useContext(ShopContext);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const cartTotalRef = useRef(null);
  
  const [priceData, setPriceData] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [cartOpenKey, setCartOpenKey] = useState(0);
  const [sizeEdit, setSizeEdit] = useState(null);
  const [sizeConfirm, setSizeConfirm] = useState(null);
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [previewItems, setPreviewItems] = useState(null);
  const [addressChecked, setAddressChecked] = useState(false);
  
  const [address, setAddress] = useState(null);
  
  /* ---------------- BUILD ITEMS ---------------- */
  
  const handleConfirmSizeChange = async () => {
    if (!sizeConfirm) return;
    
    const { productId, oldSize, newSize, quantity } = sizeConfirm;
    
    if (oldSize === newSize) {
      setSizeConfirm(null);
      return;
    }
    
    // 🔒 Lock UI
    setPreviewItems([{ productId, size: newSize, quantity }]);
    
    setSizeConfirm(null);
    
    toast.success(`Size changed to ${newSize}`, {
      theme: "dark",
      autoClose: 500,
    });
    
    try {
      setOrderUpdating(true);
      
      // backend sync
      await updateQuantity(productId, oldSize, 0);
      await updateQuantity(productId, newSize, quantity);
    } catch (err) {
      toast.error(
        "Size updated locally but failed to sync. Refresh cart once.",
        { autoClose: 3000 }
      );
    } finally {
      // 🔓 RELEASE AFTER CART STATE IS STABLE
      setTimeout(() => {
        setPreviewItems(null);
      }, 0);
      
      setOrderUpdating(false);
    }
  };
  
  const buildItems = () => {
    // 🔒 absolute lock during preview
    if (previewItems) return previewItems;
    
    if (buyNowItem) {
      return [
        {
          productId: buyNowItem.productId,
          size: buyNowItem.size,
          quantity: buyNowItem.quantity,
        },
      ];
    }
    
    const items = [];
    Object.keys(cartItems).forEach((pid) => {
      Object.keys(cartItems[pid]).forEach((size) => {
        if (cartItems[pid][size] > 0) {
          items.push({
            productId: pid,
            size,
            quantity: cartItems[pid][size],
          });
        }
      });
    });
    
    return items;
  };
  
  const handleContinue = () => {
    if (!address) {
      toast.info("Please add a delivery address", {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
      });
      
      navigate("/address", {
        state: { from: "order-preview" },
      });
      
      return;
    }
    
    navigate("/payment", {
      state: {
        payableAmount: priceData.payableAmount,
        priceData,
      },
    });
  };
  
  useEffect(() => {
    const loadSelectedAddress = async () => {
      try {
        if (!token) {
          setAddressChecked(true);
          return;
        }
        
        const res = await axios.get(`${backendUrl}/api/address/get`, {
          headers: { token },
        });
        
        if (res.data.success) {
          const { addresses, selectedAddressId } = res.data;
          const found = addresses?.find(
            (a) => a.addressId === selectedAddressId
          );
          setAddress(found || null);
        }
      } catch {
        setAddress(null);
      } finally {
        setAddressChecked(true);
      }
    };
    
    loadSelectedAddress();
  }, [token, backendUrl]);
  
  /* ---------------- LOAD PRICE ---------------- */
  useEffect(() => {
    if (!token) return;
    
    const items = buildItems();
    if (!items.length) return;
    
    const loadPreview = async () => {
      try {
        const res = await axios.post(
          `${backendUrl}/api/order/preview`,
          {
            items,
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
  }, [cartItems, buyNowItem, previewItems, couponValid, couponCode]);
  
  if (!addressChecked || !priceData) {
    return <OrderPreviewSkeleton />;
  }
  
  if (orderUpdating) {
    return (
      <section className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="mt-4 text-lg font-medium">
          Hold on… We are updating your 🛒✨
        </p>
      </section>
    );
  }
  
  {
    buildItems().length === 0 && (
      <p className="text-center text-gray-400 py-10">No items to preview</p>
    );
  }
  
  /* ================= RENDER ================= */
  return (
    <section className="min-h-screen bg-black text-white pt-[64px] pb-28">
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* BACK */}
          <button
            onClick={() => navigate("/cart")}
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
            onClick={() => {
              setBuyNowItem(null);
              navigate("/cart");
            }}
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
                <p className="text-xs uppercase tracking-wide text-white">
                  Deliver to <span className="text-base">:</span>
                </p>

                {address ? (
                  <>
                    <p className="text-base font-semibold text-white mt-0.5">
                      Name : {address.name}
                    </p>

                    <p className="text-sm text-white/90 leading-relaxed max-w-[520px] mt-1">
                      {address.houseNo}, {address.street}, {address.locality},{" "}
                      {address.city} – {address.pincode}
                    </p>

                    <p className="text-sm text-white mt-1">
                      Mobile :{" "}
                      <span className="text-white font-medium">
                        {address.phone}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-white mt-0.5">
                      No delivery address added
                    </p>

                    <p className="text-sm text-white/70 mt-1">
                      Add an address to proceed with your order
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT (md+) */}
            <div className="hidden md:flex items-center self-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/address");
                }}
                className={`
                  px-4 py-2 rounded-lg border text-sm transition cursor-pointer whitespace-nowrap
                  ${address
                    ? "border-white/20 text-green-500 hover:border-white/40 hover:bg-white/5"
                    : "border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                  }
                  `}
                  >
                {address ? "Change address" : "Add address"}
              </button>
            </div>
          </div>

          {/* MOBILE CTA */}
          {/* MOBILE CTA */}
          <div className="md:hidden mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/address");
              }}
              className={`
                w-full py-2 rounded-xl border text-sm transition cursor-pointer
                ${address
                  ? "border-white/20 text-green-500 hover:bg-white/5"
                  : "border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                }
                `}
                >
              {address ? "Change delivery address" : "+ Add delivery address"}
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
            className={`bg-[#121212] p-5 rounded-2xl border transition cursor-pointer
              ${!address ? "border-yellow-400/60" : "border-white/10 hover:border-white/30"}
              `}
              >
              <p className="text-green-400 text-sm mb-3">{randomQuote()}</p>

              <div
                onClick={() => navigate(`/product/${item.productId}`)}
                className="flex gap-4 sm:gap-5 cursor-pointer"
                >
                {/* IMAGE + QTY */}
                <div className="w-24 sm:w-28 flex-shrink-0 flex flex-col items-center">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-28 sm:h-32 object-cover rounded-xl border border-white/10"
                    />

                  {/* QUANTITY BELOW IMAGE */}
                  <div className="flex items-center gap-2 mt-3 border border-white/20 rounded-lg overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity - 1
                        );
                      }}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 text-lg hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                      >
                      −
                    </button>

                    <span className="px-3 text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity + 1
                        );
                      }}
                      className="px-2 py-1 text-lg hover:bg-white/10 cursor-pointer"
                      >
                      +
                    </button>
                  </div>
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

    if (!address) {
      toast.info("Please add a delivery address first", {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
      });
      return;
    }

    navigate("/payment", {
      state: {
        payableAmount: priceData.payableAmount,
        priceData,
      },
    });
  }}
  className="
    px-4 py-2
    rounded-lg
    border border-green-500/40
    text-sm
    text-green-400
    hover:border-green-400
    hover:bg-green-500/10
    transition
    cursor-pointer
    whitespace-nowrap
  "
>
  Go to payment
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
                        navigate(
                          `/product/${item.productId}?from=orderpreview`
                        );
                      }}
                      className="px-4 py-2 rounded-lg border border-white/20 text-sm text-green-500 hover:border-white/40 hover:bg-white/5 transition cursor-pointer"
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
                      ₹{formatINR(product.discountedPrice)}
                    </span>

                    <span className="text-gray-500 line-through text-sm">
                      ₹{product.actualPrice}
                    </span>

                    <span className="text-green-500 text-sm font-medium">
                      ↓ {discountPercent}% OFF
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative w-full my-6">
                {/* dotted line */}
                <div className="border-t border-dashed border-white/30 w-full"></div>

                {/* center text */}
                <span
                  className="
                  absolute
                  left-1/2 top-0
                  -translate-x-1/2 -translate-y-1/2
                  bg-[#0e0e0e]
                  px-4
                  text-sm sm:text-base
                  text-gray-300
                  whitespace-nowrap
                  "
                  >
                  🚚 Delivery Expected by{" "}
                  <span className="text-white font-medium">
                    {deliveryDate()}
                  </span>
                </span>
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
            className="mt-3 w-full bg-white text-black py-2 rounded font-semibold hover:bg-white/80 hover:text-black/80 cursor-pointer"
            >
            Apply Coupon
          </button>
        </div>

        {/* ================= TERMS ================= */}
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          By continuing with the order, you confirm that you are above 18 years
          of age, and you agree the Brawvly’s{" "}
          <Link
            to="/terms-conditions"
            className="
            text-blue-400
            hover:text-blue-300
            underline-offset-4
            hover:underline
            transition-all duration-200
            cursor-pointer
            "
            >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy-policy"
            className="
            text-blue-400
            hover:text-blue-300
            underline-offset-4
            hover:underline
            transition-all duration-200
            cursor-pointer
            "
            >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* ================= STICKY CONTINUE ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            onClick={() => {
              setCartOpenKey((k) => k + 1);
              cartTotalRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
            cursor-pointer
            group
            flex items-center gap-2
            "
            >
            <div className="flex flex-col">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                Total Amount
                <span
                  className="
                  text-gray-400
                  text-sm
                  group-hover:text-white
                  transition
                  "
                  title="View price breakdown"
                  >
                  ⓘ
                </span>
              </p>

              <p className="text-lg font-bold text-white flex items-center gap-1">
                ₹{formatINR(priceData.payableAmount)}
                <FaChevronRight
                  className="
                  text-gray-400
                  text-sm
                  transition-transform duration-300
                  group-hover:translate-y-0.5
                  group-hover:text-white
                  "
                  />
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 cursor-pointer"
            >
            Continue
          </button>
        </div>
      </div>
      {sizeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#121212] rounded-2xl p-6 w-[90%] max-w-sm border border-white/10 text-center">
            {!orderUpdating ? (
              <>
                <p className="text-lg font-semibold text-white">
                  Change product size
                </p>

                <select
                  value={sizeConfirm.newSize}
                  onChange={(e) =>
                    setSizeConfirm((p) => ({ ...p, newSize: e.target.value }))
                  }
                  className="w-full mt-4 bg-black border border-white/20 rounded-lg px-3 py-2 text-white cursor-pointer"
                  >
                  <option value="" disabled>
                    Select size
                  </option>

                  {products
                    .find((p) => p._id === sizeConfirm.productId)
                    ?.sizes.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                </select>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSizeConfirm(null)}
                    className="flex-1 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer "
                    >
                    Cancel
                  </button>

                  <button
                    disabled={!sizeConfirm?.newSize}
                    onClick={handleConfirmSizeChange}
                    className="bg-green-500 text-black px-4 py-2 rounded cursor-pointer"
                    >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                <p className="text-white mt-4 font-medium">
                  Hold on… updating your item
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderPreview;