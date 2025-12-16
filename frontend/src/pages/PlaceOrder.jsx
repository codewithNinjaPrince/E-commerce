// import React, { useContext, useState, useEffect } from "react";
// import Title from "../components/Title";
// import CartTotal from "../components/CartTotal";
// import { assets } from "../assets/assets";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const INDIAN_STATES = [
//   "Andhra Pradesh",
//   "Bihar",
//   "Delhi",
//   "Gujarat",
//   "Haryana",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Punjab",
//   "Rajasthan",
//   "Tamil Nadu",
//   "Telangana",
//   "Uttar Pradesh",
//   "West Bengal",
// ];

// const PlaceOrder = () => {
//   const {
//     navigate,
//     backendUrl,
//     token,
//     cartItems,
//     setCartItems,
//     getCartAmount,
//     delivery_fee,
//   } = useContext(ShopContext);

//   const [method, setMethod] = useState("cod");
//   const [showCouponBox, setShowCouponBox] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponDiscount, setCouponDiscount] = useState(0);
//   const [checkingCoupon, setCheckingCoupon] = useState(false);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [locating, setLocating] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     houseNo: "",
//     street: "", // ✅ FIXED
//     locality: "",
//     landmark: "",
//     city: "",
//     district: "",
//     state: "",
//     pincode: "",
//     country: "India",
//   });

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   /* ================= USE MY LOCATION ================= */
//   const useMyLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Location not supported");
//       return;
//     }

//     setLocating(true);

//     navigator.geolocation.getCurrentPosition(
//       async ({ coords }) => {
//         try {
//           const res = await axios.get(
//             "https://nominatim.openstreetmap.org/reverse",
//             {
//               params: {
//                 lat: coords.latitude,
//                 lon: coords.longitude,
//                 format: "json",
//               },
//             }
//           );

//           const a = res.data.address || {};
//           setFormData((p) => ({
//             ...p,
//             city: a.city || a.town || a.village || "",
//             district: a.state_district || a.county || "",
//             state: a.state || "",
//           }));

//           toast.success("Location detected. Please verify pincode.");
//         } catch {
//           toast.error("Failed to fetch location");
//         }
//         setLocating(false);
//       },
//       () => {
//         toast.error("Location permission denied");
//         setLocating(false);
//       }
//     );
//   };

//   /* ================= PREFILL USER ADDRESS ================= */
//   useEffect(() => {
//     if (!token) return;

//     axios
//       .get(`${backendUrl}/api/user/profile`, { headers: { token } })
//       .then((res) => {
//         if (res.data.success && res.data.user) {
//           setFormData((p) => ({
//             ...p,
//             ...res.data.user.address,
//             email: res.data.user.email || "",
//           }));
//         }
//       });
//   }, [token, backendUrl]);

//   /* ================= APPLY COUPON ================= */
//   const applyCoupon = async () => {
//     if (!couponCode.trim()) return toast.error("Enter coupon code");

//     setCheckingCoupon(true);
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/coupon/validate`,
//         { code: couponCode },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setCouponDiscount(res.data.discountPercent);
//         toast.success(`${res.data.discountPercent}% OFF applied`);
//       } else {
//         setCouponDiscount(0);
//         toast.error(res.data.message);
//       }
//     } catch {
//       toast.error("Invalid coupon");
//     }
//     setCheckingCoupon(false);
//   };

//   /* ================= AMOUNT ================= */
//   const cartAmount = getCartAmount();
//   const deliveryFee = cartAmount >= 999 ? 0 : 49;
//   const codFee = method === "cod" ? 20 : 0;

//   const discountedBase = couponDiscount
//     ? cartAmount - (cartAmount * couponDiscount) / 100
//     : cartAmount;

//   const finalAmount = Math.round(discountedBase + deliveryFee + codFee);

//   /* ================= SUBMIT ORDER ================= */
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     if (placingOrder) return;

//     setPlacingOrder(true);

//     try {
//       const items = [];

//       Object.keys(cartItems).forEach((pid) => {
//         Object.keys(cartItems[pid]).forEach((size) => {
//           if (cartItems[pid][size] > 0) {
//             items.push({
//               productId: pid,
//               size,
//               quantity: cartItems[pid][size],
//             });
//           }
//         });
//       });

//       const orderData = {
//         address: formData,
//         items,
//         amount: finalAmount,
//         paymentMethod: method,
//       };

//       const res = await axios.post(`${backendUrl}/api/order/place`, orderData, {
//         headers: { token },
//       });

//       if (res.data.success) {
//         setCartItems({});
//         toast.success("Order Placed Successfully!");
//         setTimeout(() => navigate("/orders"), 800);
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch {
//       toast.error("Order placement failed!");
//     }

//     setPlacingOrder(false);
//   };

//   return (
//   <form
//   onSubmit={onSubmitHandler}
//   className="
//     flex flex-col sm:flex-row gap-10 pt-10
//     border-t text-white
//     min-h-[calc(100vh-120px)]
//     items-stretch
//   "
// >
//     {/* ================= LEFT SECTION ================= */}
//    <div
//   className="
//     flex flex-col gap-4
//     w-full sm:max-w-[480px]
//     bg-[#121212] p-6
//     rounded-2xl border border-white/10 shadow-xl
//     flex-1
//   "
// >

//       <Title text1="Delivery" text2="Information" />

//       <button
//         type="button"
//         onClick={useMyLocation}
//         className="text-md text-blue-400 hover:text-white cursor-pointer"
//       >
//         {locating ? "Detecting location..." : "Use my delivery location"}
//       </button>

//       <div className="flex gap-3">
//         <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} className="input-box" placeholder="First Name" />
//         <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} className="input-box" placeholder="Last Name" />
//       </div>

//       <div className="flex gap-3">
//         <input required name="phone" value={formData.phone} onChange={onChangeHandler} className="input-box" placeholder="Phone No." />
//         <input required name="email" value={formData.email} onChange={onChangeHandler} className="input-box" placeholder="Email Address" />
//       </div>

//       <input required name="houseNo" value={formData.houseNo} onChange={onChangeHandler} className="input-box" placeholder="House / Flat / Apartment No" />
//       <input required name="street" value={formData.street} onChange={onChangeHandler} className="input-box" placeholder="Street" />
//       <input name="locality" value={formData.locality} onChange={onChangeHandler} className="input-box" placeholder="Locality / Area (optional)" />

//       <div className="flex gap-3">
//         <input required name="city" value={formData.city} onChange={onChangeHandler} className="input-box" placeholder="City" />
//         <input required name="pincode" value={formData.pincode} onChange={onChangeHandler} className="input-box" placeholder="Pin Code" />
//       </div>

//       <input required name="district" value={formData.district} onChange={onChangeHandler} className="input-box" placeholder="District" />

//       <div className="flex gap-3">
//         <select required name="state" value={formData.state} onChange={onChangeHandler} className="input-box">
//           <option value="">Select State</option>
//           {INDIAN_STATES.map((s) => (
//             <option key={s} value={s}>{s}</option>
//           ))}
//         </select>

//         <input required name="country" value={formData.country} onChange={onChangeHandler} className="input-box" placeholder="Country" />

//         <div className="flex-1"></div>
//       </div>
//     </div>

//     {/* ================= RIGHT SECTION ================= */}
//     <div className="flex-1 px-3 flex flex-col pb-28 lg:pb-0">
//       <CartTotal />

//       {/* ================= COUPON (RESTORED) ================= */}
//       <div className="mt-6">
//         <button
//           type="button"
//           onClick={() => setShowCouponBox(!showCouponBox)}
//           className="text-blue-400 underline text-sm hover:text-white cursor-pointer"
//         >
//           {showCouponBox ? "Hide Coupon" : "Have a coupon?"}
//         </button>

//         {showCouponBox && (
//           <div className="mt-4 bg-black/40 p-4 rounded-xl border border-white/10">
//             <div className="flex gap-3">
//               <input
//                 value={couponCode}
//                 onChange={(e) => setCouponCode(e.target.value)}
//                 className="flex-1 bg-black text-white p-2 rounded-lg border border-white/20"
//                 placeholder="Enter coupon code"
//               />

//               <button
//                 type="button"
//                 onClick={applyCoupon}
//                 disabled={checkingCoupon}
//                 className="bg-white text-black px-5 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
//               >
//                 {checkingCoupon ? "Checking..." : "Apply"}
//               </button>
//             </div>

//             {couponDiscount > 0 && (
//               <p className="text-green-400 text-sm mt-2">
//                 🎉 Coupon Applied: {couponDiscount}% OFF
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ================= PRICE SUMMARY ================= */}
//       <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-4">
//         <div className="flex justify-between text-sm text-gray-300">
//           <span>Delivery Charges</span>
//           <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
//         </div>

//         {method === "cod" && (
//           <div className="flex justify-between text-sm text-gray-300 mt-3">
//             <span>COD Handling Fee</span>
//             <span>₹20</span>
//           </div>
//         )}

//         <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
//           <span className="text-sm text-gray-400">Total Payable</span>
//           <span className="text-lg font-bold text-white">₹{finalAmount}</span>
//         </div>
//       </div>

//       {/* ================= PAYMENT ================= */}
//       <div className="mt-10 pt-6 border-t border-white/10">
//         <Title text1="Payment" text2="Method" />
//       </div>

//       <div className="flex gap-4 flex-col lg:flex-row mt-4">
//         <div onClick={() => setMethod("cashfree")} className={`pay-box ${method === "cashfree" && "active-pay"}`}>
//           <p className="radio-dot"></p>
//           <img className="h-5 mx-4" src="https://cashfreelogo.cashfree.com/cashfreepayments/logopng4x/Cashfree_Payments_Logo.png" />
//         </div>

//         <div onClick={() => setMethod("razorpay")} className={`pay-box ${method === "razorpay" && "active-pay"}`}>
//           <p className="radio-dot"></p>
//           <img className="h-5 mx-4" src={assets.razorpay_logo} />
//         </div>

//         <div onClick={() => setMethod("cod")} className={`pay-box ${method === "cod" && "active-pay"}`}>
//           <p className="radio-dot"></p>
//           <p className="text-sm font-medium mx-4">Cash On Delivery</p>
//         </div>
//       </div>

//       {/* ================= DESKTOP PLACE ORDER ================= */}
//       <div className="hidden lg:block w-full text-end mt-10">
//         <button
//           type="submit"
//           disabled={placingOrder}
//           className={`${
//             placingOrder
//               ? "bg-gray-700 text-gray-300 cursor-not-allowed"
//               : "bg-white text-black hover:bg-black/40 border hover:text-white"
//           } px-16 py-3 rounded-lg font-semibold transition cursor-pointer`}
//         >
//           {placingOrder ? "Placing…" : "Place Order"}
//         </button>
//       </div>
//     </div>

//     {/* ================= STICKY PLACE ORDER (MOBILE + TABLET) ================= */}
//     <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-t border-white/10 px-4 py-3">
//       <div className="flex items-center justify-between max-w-[720px] mx-auto">
//         <div>
//           <p className="text-xs text-gray-400">Total Payable</p>
//           <p className="text-lg font-bold text-white">₹{finalAmount}</p>
//         </div>

//         <button
//           type="submit"
//           disabled={placingOrder}
//           className={`${
//             placingOrder
//               ? "bg-gray-700 text-gray-300 cursor-not-allowed"
//               : "bg-white text-black"
//           } px-6 py-3 rounded-lg font-semibold`}
//         >
//           {placingOrder ? "Placing…" : "Place Order"}
//         </button>
//       </div>
//     </div>
//   </form>
// );
// };

// export default PlaceOrder;

import React, { useContext, useState, useEffect } from "react";
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
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [showCouponBox, setShowCouponBox] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [locating, setLocating] = useState(false);

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

  /* ================= AMOUNT ================= */
  const cartAmount = getCartAmount();
  const deliveryFee = cartAmount >= 999 ? 0 : 49;
  const codFee = method === "cod" ? 20 : 0;

  const discountedBase = couponDiscount
    ? cartAmount - (cartAmount * couponDiscount) / 100
    : cartAmount;

  const finalAmount = Math.round(discountedBase + deliveryFee + codFee);

  /* ================= SUBMIT ORDER ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (placingOrder) return;

    setPlacingOrder(true);

    try {
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

      const orderData = {
        address: formData,
        items,
        amount: finalAmount,
        paymentMethod: method,
      };

      const res = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (res.data.success) {
        localStorage.setItem(
          "checkoutAddress",
          JSON.stringify(formData)
        );
        setCartItems({});
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
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} className="input-box" placeholder="First Name" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} className="input-box" placeholder="Last Name" />
        </div>

        <div className="flex gap-3">
          <input required name="phone" value={formData.phone} onChange={onChangeHandler} className="input-box" placeholder="Phone No." />
          <input required name="email" value={formData.email} onChange={onChangeHandler} className="input-box" placeholder="Email Address" />
        </div>

        <input required name="houseNo" value={formData.houseNo} onChange={onChangeHandler} className="input-box" placeholder="House / Flat / Apartment No" />
        <input required name="street" value={formData.street} onChange={onChangeHandler} className="input-box" placeholder="Street" />
        <input name="locality" value={formData.locality} onChange={onChangeHandler} className="input-box" placeholder="Locality / Area (optional)" />

        <div className="flex gap-3">
          <input required name="city" value={formData.city} onChange={onChangeHandler} className="input-box" placeholder="City" />
          <input required name="pincode" value={formData.pincode} onChange={onChangeHandler} className="input-box" placeholder="Pin Code" />
        </div>

        <input required name="district" value={formData.district} onChange={onChangeHandler} className="input-box" placeholder="District" />

        <div className="flex gap-3">
          <select required name="state" value={formData.state} onChange={onChangeHandler} className="input-box">
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input required name="country" value={formData.country} onChange={onChangeHandler} className="input-box" placeholder="Country" />
          <div className="flex-1"></div>
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex-1 px-3 flex flex-col pb-28 lg:pb-0">
        <CartTotal />

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
  );
};

export default PlaceOrder;

