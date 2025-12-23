import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const PlaceOrder = () => {
  const {
    products,
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    buyNowItem,
    setBuyNowItem,
  } = useContext(ShopContext);

  const location = useLocation();
  const isBuyNow =
    new URLSearchParams(location.search).get("mode") === "buynow";

  const [method, setMethod] = useState("cod");
  const [showCouponBox, setShowCouponBox] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [locating, setLocating] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem("checkoutAddress");

  if (saved) {
    setFormData(JSON.parse(saved));
  }
}, [isBuyNow]);


 useEffect(() => {
  if (isBuyNow && !buyNowItem) {
    toast.error("Buy Now item missing. Please try again.");
    navigate("/");
  }
}, [isBuyNow, buyNowItem, navigate]);

if (isBuyNow && !buyNowItem) return null;

  /* ================= AMOUNT ================= */
  const codFee = method === "cod" ? 20 : 0;
  const baseAmount =
  isBuyNow && buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : getCartAmount();


  const discountedBase = couponDiscount
    ? baseAmount - (baseAmount * couponDiscount) / 100
    : baseAmount;

  const deliveryFee = baseAmount >= 999 ? 0 : 49;
  const finalAmount = Math.round(discountedBase + deliveryFee + codFee);
  const totalAmount = isBuyNow && buyNowItem
  ? buyNowItem.price * buyNowItem.quantity
  : getCartAmount();




  /* ================= ADDRESS STATE (LOCAL STORAGE PREFILL) ================= */
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("checkoutAddress");
    return saved
      ? JSON.parse(saved)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          houseNo: "",
          street: "",
          locality: "",
          landmark: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
          country: "India",
        };
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= USE MY LOCATION ================= */
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location not supported");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat: coords.latitude,
                lon: coords.longitude,
                format: "json",
              },
            }
          );

          const a = res.data.address || {};
          setFormData((p) => ({
            ...p,
            city: a.city || a.town || a.village || "",
            district: a.state_district || a.county || "",
            state: a.state || "",
          }));

          toast.success("Location detected. Please verify pincode.");
        } catch {
          toast.error("Failed to fetch location");
        }
        setLocating(false);
      },
      () => {
        toast.error("Location permission denied");
        setLocating(false);
      }
    );
  };

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Enter coupon code");

    setCheckingCoupon(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/coupon/validate`,
        { code: couponCode },
        { headers: { token } }
      );

      if (res.data.success) {
        setCouponDiscount(res.data.discountPercent);
        toast.success(`${res.data.discountPercent}% OFF applied`);
      } else {
        setCouponDiscount(0);
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Invalid coupon");
    }
    setCheckingCoupon(false);
  };

    
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
        amount: finalAmount,
        paymentMethod: method,
      };

      const res = await axios.post(`${backendUrl}/api/order/place`, orderData, {
        headers: { token },
      });

      if (res.data.success) {
        if (isBuyNow) {
          setBuyNowItem(null); // 🔥 clear buy-now snapshot
        } else {
          setCartItems({});
        }
        localStorage.setItem("checkoutAddress", JSON.stringify(formData));
        toast.success("Order Placed Successfully!");
        setTimeout(() => navigate("/orders"), 800);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Order placement failed!");
    }

    setPlacingOrder(false);
  };


  return (
    <section className="pt-20 sm:pt-22 lg:pt-26 pb-16 px-1 sm:px-2 md:px-5">
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
      <div className="px-1 sm:px-3 md:px-5 py-1 text-white">
    <form
      onSubmit={onSubmitHandler}
      className="
        flex flex-col sm:flex-row gap-10 pt-10
        border-t text-white
        min-h-[calc(100vh-120px)]
        items-stretch
      "
    >
      {/* ================= LEFT SECTION ================= */}
      <div
        className="
          flex flex-col gap-4
          w-full sm:max-w-[480px]
          bg-[#121212] p-6
          rounded-2xl border border-white/10 shadow-xl
          flex-1
          max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-270px)]
        "
      >
        <Title text1="Delivery" text2="Information" />

        <button
          type="button"
          onClick={useMyLocation}
          className="text-md text-blue-400 hover:text-white cursor-pointer"
        >
          {locating ? "Detecting location..." : "Use my delivery location"}
        </button>

        <div className="flex gap-3">
          <input
            required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="Last Name"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="Phone No."
          />
          <input
            required
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="Email Address"
          />
        </div>

        <input
          required
          name="houseNo"
          value={formData.houseNo}
          onChange={onChangeHandler}
          className="input-box"
          placeholder="House / Flat / Apartment No"
        />
        <input
          required
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          className="input-box"
          placeholder="Street"
        />
        <input
          name="locality"
          value={formData.locality}
          onChange={onChangeHandler}
          className="input-box"
          placeholder="Locality / Area (optional)"
        />

        <div className="flex gap-3">
          <input
            required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="City"
          />
          <input
            required
            name="pincode"
            value={formData.pincode}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="Pin Code"
          />
        </div>

        <input
          required
          name="district"
          value={formData.district}
          onChange={onChangeHandler}
          className="input-box"
          placeholder="District"
        />


<div className="flex gap-3">

  <select
            required
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            className="input-box"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="Country"
          />
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex-1 px-3 flex flex-col pb-28 lg:pb-0">
        {!isBuyNow && <CartTotal />}

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
            <div
              className="
        mt-3
        bg-[#121212] p-4
        rounded-xl border border-white/10
        w-full
        max-w-full
      "
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="
            w-full
            bg-black text-white p-3
            rounded-lg border border-white/20
          "
                  placeholder="Enter coupon code"
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={checkingCoupon}
                  className="
            w-full sm:w-auto
            bg-white text-black
            px-6 py-3
            rounded-lg font-semibold
            hover:bg-gray-300 transition
            cursor-pointer
          "
                >
                  {checkingCoupon ? "Checking..." : "Apply"}
                </button>
              </div>

              {couponDiscount > 0 && (
                <p className="text-green-400 text-sm mt-3">
                  🎉 Coupon Applied: {couponDiscount}% OFF
                </p>
              )}
            </div>
          )}
        </div>

        {isBuyNow && buyNowItem && (
  <div className="bg-[#121212] p-4 rounded-xl border border-white/10 mt-6 ">
    <p className="font-semibold mb-2">Buying</p>
    <div className="flex gap-5 sm:gap-7 md:gap-9 items-center">
      <img src={buyNowItem.image?.[0]} className="w-12 h-16 rounded" />
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
        <div className="mt-8 bg-[#121212] p-5 rounded-xl border border-white/10">
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
              <span className="ml-auto text-sm text-gray-400">₹20 COD fee</span>
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
              <img src={assets.razorpay_logo} alt="Razorpay" className="h-5" />
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

        {/* ================= PRICE SUMMARY ================= */}
        <div className="mt-6 bg-[#121212] p-5 rounded-xl border border-white/10">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span>
            <span>₹{baseAmount}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>

          {method === "cod" && (
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>COD Fee</span>
              <span>₹20</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-400 mt-2">
              <span>Coupon Discount</span>
              <span>-{couponDiscount}%</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-semibold mt-4">
            <span>Total</span>
            <span>₹{finalAmount}</span>
          </div>
        </div>

        {/* COUPON, PAYMENT, SUMMARY — UNCHANGED */}
        {/* SAME AS YOUR CODE */}

        {/* ================= DESKTOP PLACE ORDER ================= */}
        <div className="hidden lg:block w-full text-end mt-10">
          <button
            type="submit"
            disabled={placingOrder}
            className={`${
              placingOrder
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-white text-black hover:bg-black/40 border hover:text-white"
            } px-16 py-3 rounded-lg font-semibold transition cursor-pointer`}
          >
            {placingOrder ? "Placing…" : "Place Order"}
          </button>
        </div>
      </div>

      {/* ================= STICKY PLACE ORDER ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-[720px] mx-auto">
          <div>
            <p className="text-xs text-gray-400">Total Payable</p>
            <p className="text-lg font-bold text-white">₹{finalAmount}</p>
          </div>

          <button
            type="submit"
            disabled={placingOrder}
            className={`${
              placingOrder
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-white text-black"
            } px-6 py-3 rounded-lg font-semibold`}
          >
            {placingOrder ? "Placing…" : "Place Order"}
          </button>
        </div>
      </div>
    </form>
    </div>
    </div>
  </section>
  );
};

export default PlaceOrder;
