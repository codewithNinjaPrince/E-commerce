import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [showCouponBox, setShowCouponBox] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // ---------------- APPLY COUPON ----------------
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      return toast.error("Please enter a coupon code!");
    }

    setCheckingCoupon(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/coupon/validate`,
        { code: couponCode },
        { headers: { token } }
      );

      if (res.data.success) {
        setCouponDiscount(res.data.discountPercent);
        toast.success(`Coupon Applied! ${res.data.discountPercent}% OFF`);
      } else {
        setCouponDiscount(0);
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Invalid coupon or expired.");
    }

    setCheckingCoupon(false);
  };

  // ================= AUTO PREFILL USER ADDRESS =================
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });

        if (res.data.success && res.data.user.address) {
          setFormData((prev) => ({
            ...prev,
            ...res.data.user.address, // prefill all fields
            email: res.data.user.email, // email from user profile
          }));
        }
      } catch (error) {
        console.log("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, [token]);

  // ------------ SUBMIT ORDER ------------
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (placingOrder) return; // stop double click

    setPlacingOrder(true);

    try {
      let orderItems = [];

      Object.keys(cartItems).forEach((productId) => {
        if (productId.length < 10) return; // ignore invalid ids like "0"

        Object.keys(cartItems[productId]).forEach((size) => {
          let qty = cartItems[productId][size];
          console.log("CART ITEMS:", cartItems);

          if (qty > 0) {
            orderItems.push({
              productId,
              size,
              quantity: qty,
            });
          }
        });
      });

      let baseAmount = getCartAmount() + delivery_fee;
      let finalAmount = couponDiscount
        ? baseAmount - (baseAmount * couponDiscount) / 100
        : baseAmount;

      let orderData = {
        address: formData,
        items: orderItems,
        amount: Math.round(finalAmount),
      };

      switch (method) {
        // ---------------- COD ----------------
        case "cod":
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );

          if (res.data.success) {
            setCartItems({});
            toast.success("Order Placed Successfully!", {
              position: "top-center",
              theme: "dark",
            });

            setTimeout(() => navigate("/orders"), 800);
          } else {
            toast.error(res.data.message);
          }
          break;

        // ---------------- CASHFREE ----------------
        case "cashfree":
          const resCF = await axios.post(
            backendUrl + "/api/order/cashfree",
            orderData,
            { headers: { token } }
          );

          if (resCF.data.success) {
            window.location.replace(resCF.data.session_url);
          } else {
            toast.error(resCF.data.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error("Order placement failed!");
    }

    setPlacingOrder(false);
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-10 pt-10 min-h-[90vh] border-t text-white"
    >
      {/* ================= LEFT SECTION ================= */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px] bg-[#121212] p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="text-2xl mb-1">
          <Title text1="Delivery" text2="Information" />
        </div>

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

        <input
          required
          name="email"
          type="email"
          value={formData.email}
          onChange={onChangeHandler}
          className="input-box"
          placeholder="Email Address"
        />

        <input
          required
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          className="input-box"
          placeholder="Street"
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
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="State"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            type="number"
            name="pincode"
            value={formData.pincode}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="Pin Code"
          />

          <input
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            className="input-box"
            placeholder="Country"
          />
        </div>

        <input
          required
          type="number"
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          className="input-box"
          placeholder="Phone Number"
        />
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex-1 px-3">
        {/* CART TOTAL */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl mb-10">
          <CartTotal />

          {/* APPLY COUPON */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowCouponBox(!showCouponBox)}
              className="text-[1/2]xl text-blue-300 underline cursor-pointer hover:text-white"
            >
              {showCouponBox ? "Hide Coupon" : "Have a coupon?"}
            </button>

            {/* COUPON TOGGLE BOX */}
            {showCouponBox && (
              <div className="mt-4 bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="flex gap-3">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-black text-white p-2 rounded-lg border border-white/20"
                    placeholder="Enter coupon code"
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={checkingCoupon}
                    className="bg-white text-black px-5 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    {checkingCoupon ? "Checking..." : "Apply"}
                  </button>
                </div>

                {couponDiscount > 0 && (
                  <p className="text-green-400 text-sm mt-2">
                    🎉 Coupon Applied: {couponDiscount}% OFF!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <Title text1="Payment" text2="Method" />

          <div className="flex gap-4 flex-col lg:flex-row mt-4">
            <div
              onClick={() => setMethod("cashfree")}
              className={`pay-box ${method === "cashfree" && "active-pay"}`}
            >
              <p className="radio-dot"></p>
              <img
                className="h-5 mx-4"
                src="https://cashfreelogo.cashfree.com/cashfreepayments/logopng4x/Cashfree_Payments_Logo.png"
                alt="cashfree"
              />
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className={`pay-box ${method === "razorpay" && "active-pay"}`}
            >
              <p className="radio-dot"></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className={`pay-box ${method === "cod" && "active-pay"}`}
            >
              <p className="radio-dot"></p>
              <p className="text-sm font-medium mx-4">Cash On Delivery</p>
            </div>
          </div>

          <div className="w-full text-end mt-10">
            <button
              type="submit"
              disabled={placingOrder}
              className={`${
                placingOrder
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "bg-white text-black hover:bg-black/40 border hover:text-white"
              } px-16 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-3 cursor-pointer`}
            >
              {placingOrder ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  Placing Order…
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
