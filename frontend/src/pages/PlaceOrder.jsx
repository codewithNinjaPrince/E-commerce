import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrderSkeleton = () => {
  return (
    <section className="pt-[64px] px-3 pb-32 animate-pulse">
      <div className="max-w-7xl mx-auto bg-black/90 border border-white/10 rounded-2xl p-4">
        {/* ADDRESS CARD */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="h-6 w-40 bg-gray-700/40 rounded mb-5" />

          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 mb-4">
              <div className="h-10 flex-1 bg-gray-700/40 rounded" />
              <div className="h-10 flex-1 bg-gray-700/30 rounded" />
            </div>
          ))}

          <div className="h-10 w-full bg-gray-700/40 rounded" />
        </div>

        {/* CART TOTAL */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="h-6 w-32 bg-gray-700/40 rounded mb-4" />

          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between mb-3">
              <div className="h-4 w-28 bg-gray-700/30 rounded" />
              <div className="h-4 w-16 bg-gray-700/40 rounded" />
            </div>
          ))}

          <div className="h-10 w-full bg-gray-700/40 rounded mt-4" />
        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5">
          <div className="h-6 w-40 bg-gray-700/40 rounded mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-700/30 rounded mb-3" />
          ))}
        </div>
      </div>
    </section>
  );
};


const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    buyNowItem,
    setBuyNowItem,
  } = useContext(ShopContext);

  const location = useLocation();
  const isBuyNow =
    new URLSearchParams(location.search).get("mode") === "buynow";

  const [method, setMethod] = useState("cod");
  const [showCouponBox, setShowCouponBox] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [locating, setLocating] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const cartTotalRef = useRef(null);
  const [cartOpenKey, setCartOpenKey] = useState(0);

  const priceSummaryRef = useRef(null);

  const buildItems = () => {
    let items = [];

    if (isBuyNow) {
      items = [
        {
          productId: buyNowItem.productId,
          size: buyNowItem.size,
          quantity: buyNowItem.quantity,
        },
      ];
    } else {
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
    }

    return items;
  };


  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    setCheckingCoupon(true);

    try {
      const items = buildItems();

      const res = await axios.post(
        `${backendUrl}/api/order/preview`,
        { items, couponCode, paymentMethod: method },
        { headers: { token } }
      );

      if (!res.data.success && res.data.code === "COUPON_ALREADY_USED") {
        toast.error("Coupon applied previously");
        setCouponValid(false);
        setCouponCode("");
        return;
      }

      if (!res.data.success) {
        toast.error(res.data.message || "Invalid coupon");
        setCouponValid(false);
        return;
      }

      setCouponValid(true);
      setPriceData(res.data);
      toast.success("Coupon applied");
    } catch {
      toast.error("Invalid Coupon");
      setCouponValid(false);
    } finally {
      setCheckingCoupon(false); // 🔥 always runs
    }
  };

  //Load Preview
  useEffect(() => {
    const loadPreview = async () => {
      try {
        const items = buildItems();
        if (!items.length || placingOrder) return;

        const res = await axios.post(
          `${backendUrl}/api/order/preview`,
          {
            items,
            paymentMethod: method,
            couponCode: couponValid ? couponCode : null,
          },
          { headers: { token } }
        );

        if (res.data.success) {
          setPriceData(res.data);
        }
      } catch (e) {
        console.log("Preview failed");
      }
    };

    loadPreview();
  }, [method, cartItems, buyNowItem, couponValid, couponCode]);

  /* ================= SUBMIT ORDER ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (placingOrder) return;

    setPlacingOrder(true);

    try {
      let items = [];

      if (isBuyNow) {
        items = [
          {
            productId: buyNowItem.productId,
            size: buyNowItem.size,
            quantity: buyNowItem.quantity,
          },
        ];
      } else {
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
      }

      const orderData = {
        address: formData,
        items,
        paymentMethod: method,
        couponCode: couponValid ? couponCode : null,
      };

      const res = await axios.post(`${backendUrl}/api/order/place`, orderData, {
        headers: { token },
      });

      if (res.data.success) {
        localStorage.setItem("checkoutAddress", JSON.stringify(formData));

        if (isBuyNow) {
          setBuyNowItem(null);
        } else {
          setCartItems({});
        }

        toast.success("Order Placed Successfully!");
        navigate("/orders", { replace: true });
        return; // 🔥 MOST IMPORTANT
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Order placement failed!");
    }

    setPlacingOrder(false);
  };


  useEffect(() => {
    if (!placingOrder && isBuyNow && !buyNowItem) {
      toast.error("Buy Now item missing. Please try again.");
      navigate("/");
    }
  }, [isBuyNow, buyNowItem, placingOrder, navigate]);

  if (isBuyNow && !buyNowItem) return null;

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setPriceOpen(true);
    }
  }, []);

  const ResponsiveStyles = () => (
    <style>{`
    @media (min-width: 860px) {
      .checkout-row {
        display: flex;
        flex-direction: row;
        gap: 2.5rem;
        align-items: flex-start;
      }
      .checkout-left {
        max-width: 420px;
        flex-shrink: 0;
      }
    }
  `}</style>
  );

  const shouldShowSkeleton = !token || placingOrder || !priceData;

  if (shouldShowSkeleton) {
    return <PlaceOrderSkeleton />;
  }

  return (
    <>
      <ResponsiveStyles />
      <section className="min-h-screen flex flex-col pt-[64px]">
        <div className="flex-1 overflow-y-auto pb-32">
          <div
            className="
        max-w-9xl mx-auto
        bg-black/90
        border border-white/10
        rounded-2xl
        shadow-[0_0_40px_rgba(255,255,255,0.06)]
      "
          >
            <div className="px-1 sm:px-3 md:px-5 py-1 text-white">
              <form
                onSubmit={onSubmitHandler}
                className="checkout-row flex flex-col gap-10 pt-10 border-t text-white items-start"
              >

                {/* ================= RIGHT SECTION ================= */}
                <div className="flex-1 w-full px-1 flex flex-col gap-6">
                  <div ref={cartTotalRef}>
                    <CartTotal
                      includeCodFee={method === "cod"}
                      priceData={priceData}
                      forceOpenKey={cartOpenKey}
                    />
                  </div>

                  {/* ================= COUPON SECTION ================= */}
                  <div className="mt-6 relative">
                    <button
                      type="button"
                      onClick={() => setShowCouponBox(!showCouponBox)}
                      className="text-blue-400 text-sm hover:text-white cursor-pointer"
                    >
                      {showCouponBox ? "Hide Coupon" : "Have a coupon?"}
                    </button>
                    {showCouponBox && (
                      <div className="mt-3 bg-[#121212] p-4 rounded-xl border border-white/10">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            value={couponCode}
                            disabled={couponValid}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full bg-black text-white p-3 rounded-lg border border-white/20 disabled:opacity-60"
                            placeholder="Enter coupon code"
                          />

                          {!couponValid && (
                            <button
                              type="button"
                              onClick={applyCoupon}
                              disabled={checkingCoupon}
                              className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-black hover:text-white"
                            >
                              {checkingCoupon ? "Checking..." : "Apply"}
                            </button>
                          )}
                        </div>

                        {/* SUCCESS MESSAGE */}
                        {couponValid && (
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-green-400 text-sm">
                              ✅ Coupon applied successfully
                            </p>

                            {/* REMOVE BUTTON */}
                            <button
                              type="button"
                              onClick={async () => {
                                setCouponValid(false);
                                setCouponCode("");

                                const items = buildItems();
                                const res = await axios.post(
                                  `${backendUrl}/api/order/preview`,
                                  { items, paymentMethod: method },
                                  { headers: { token } }
                                );

                                if (res.data.success) {
                                  setPriceData(res.data);
                                }
                              }}
                              className="text-red-400 text-sm hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        )}

                        {/* ERROR MESSAGE */}
                        {!couponValid && couponCode && (
                          <p className=" flex items-center text-green-400 text-sm mt-2">
                            Click on Apply
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {isBuyNow && buyNowItem && (
                    <div className="bg-[#121212] p-4 rounded-xl border border-white/10 mt-1 md:mt-2 ">
                      <p className="font-semibold mb-2">Buying</p>
                      <div className="flex gap-8 sm:gap-10 md:gap-15 items-center">
                        <img
                          src={
                            Array.isArray(buyNowItem.image)
                              ? buyNowItem.image[0]
                              : buyNowItem.image
                          }
                          className="w-12 h-16 rounded"
                        />

                        <div>
                          <p className="text-sm">{buyNowItem.name}</p>
                          <p className="text-xs text-gray-400">
                            Qty: {buyNowItem.quantity} • Size: {buyNowItem.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================= PAYMENT METHOD ================= */}
                  <div className="mt-5 bg-[#121212] p-5 rounded-xl border border-white/10">
                    <p className="text-lg font-semibold mb-4">Payment Method</p>

                    <div className="flex flex-col gap-3">
                      {/* ================= COD ================= */}
                      <label
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition
        ${
          method === "cod"
            ? "border-green-500 bg-green-500/10"
            : "border-white/10 hover:border-white/30"
        }
      `}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={method === "cod"}
                          onChange={() => setMethod("cod")}
                        />
                        <span className="font-medium">Cash on Delivery</span>
                        <span className="ml-auto text-sm text-gray-400">
                          ₹20 COD fee
                        </span>
                      </label>

                      {/* ================= RAZORPAY ================= */}
                      <label
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition
        ${
          method === "razorpay"
            ? "border-blue-500 bg-blue-500/10"
            : "border-white/10 hover:border-white/30"
        }
      `}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="razorpay"
                          checked={method === "razorpay"}
                          onChange={() => setMethod("razorpay")}
                        />
                        <img
                          src={assets.razorpay_logo}
                          alt="Razorpay"
                          className="h-5"
                        />
                        <span className="ml-auto text-sm text-gray-400">
                          UPI / Card / Netbanking
                        </span>
                      </label>

                      {/* ================= ONLINE (GENERIC / FUTURE) ================= */}
                      <label
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition
        ${
          method === "online"
            ? "border-purple-500 bg-purple-500/10"
            : "border-white/10 hover:border-white/30"
        }
      `}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={method === "online"}
                          onChange={() => {
                            toast.info("Online payment coming soon 🚀");
                            setMethod("online");
                          }}
                        />
                        <span className="font-medium">Online Payment</span>
                        <span className="ml-auto text-sm text-gray-400">
                          Wallets / UPI / Cards
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* ================= STICKY PLACE ORDER ================= */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-t border-white/10 px-4 py-3">
                  <div
                    className="
  max-w-7xl mx-auto
  flex items-center justify-between
  gap-4
"
                  >
                    {/* LEFT — TOTAL (CLICKABLE) */}
                    <div
                      onClick={() => {
                        setCartOpenKey((prev) => prev + 1); // open CartTotal
                        setTimeout(() => {
                          cartTotalRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                      className="flex flex-col cursor-pointer group"
                    >
                      <p className="text-xs text-green-400 flex flex-end gap-1">
                        Total Amount
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </p>

                      <p className="text-lg font-bold text-white flex items-center gap-2">
                        ₹{priceData?.payableAmount ?? "—"}
                        <span
                          className="
            text-gray-400
            transition-all duration-200
            group-hover:text-white
            group-hover:translate-x-1
          "
                        >
                          ❯
                        </span>
                      </p>
                    </div>

                    {/* RIGHT — PLACE ORDER BUTTON */}
                    <button
                      type="submit"
                      disabled={placingOrder}
                      className={`${
                        placingOrder
                          ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                          : "bg-white text-black hover:bg-black hover:text-white"
                      } px-6 py-3 rounded-lg font-semibold transition cursor-pointer`}
                    >
                      {placingOrder ? "Placing…" : "Place Order"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlaceOrder;
