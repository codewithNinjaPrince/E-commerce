import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import axios from "axios";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useLayoutEffect } from "react";

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
  FaChevronRight,
  FaMoneyBillWave,
} from "react-icons/fa";

// 🇮🇳 Indian currency formatter (local to this page)
const formatINR = (amount) => {
  if (amount === null || amount === undefined) return "0";
  return Number(amount).toLocaleString("en-IN");
};

const CheckoutNote = () => (
  <div className="mt-10 px-4">
    <div
      className="
        mx-auto max-w-md
        rounded-2xl
        border border-white/10
        bg-gradient-to-br from-[#121212] via-[#141414] to-[#0f0f0f]
        p-5
        text-center
        shadow-lg
      "
    >
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <FaCheckCircle className="text-green-400 text-lg" />
        </div>
      </div>

      <p className="text-base sm:text-lg font-semibold text-white">
        Good choices deserve a smooth checkout 😉
      </p>

      <p className="text-sm sm:text-base text-gray-400 mt-1 leading-relaxed">
        Let’s finish this.
      </p>
    </div>
  </div>
);

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

/* ================= HELPERS ================= */
const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 9);
  return d.toDateString();
};

/* ================= PAGE ================= */
const PaymentPage = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  const { backendUrl, token, cartItems, products, updateQuantity, addToCart, buyNowItem, setBuyNowItem } =
    useContext(ShopContext);

  const cartTotalRef = useRef(null);

  const [priceData, setPriceData] = useState(null);

  const [cartOpenKey, setCartOpenKey] = useState(0);

  const [addressLoading, setAddressLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponValid, setCouponValid] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [selectedUpi, setSelectedUpi] = useState(false);
  const [address, setAddress] = useState(null);
  const [localCartOverride, setLocalCartOverride] = useState(null);
  const [upiOpen, setUpiOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [codOpen, setCodOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/(\d{2})(\d{0,2})/, "$1/$2");

  const isCardValid =
    card.number.replace(/\s/g, "").length === 16 &&
    card.expiry.length === 5 &&
    card.cvv.length === 3 &&
    card.name.length > 2;

  const payableAmount =
    location.state?.payableAmount || priceData?.payableAmount;

  const PaymentRadio = ({ active }) => (
    <div
      className={`
      w-4 h-4 rounded-full border flex items-center justify-center
      ${active ? "border-blue-500" : "border-white/40"}
    `}
    >
      {active && <div className="w-2 h-2 rounded-full bg-blue-500" />}
    </div>
  );

  const handlePayClick = () => {
    setConfirmOpen(true);
  };

  const confirmPayment = () => {
    setProcessing(true);

    // fake delay for UX (payment gateway feel)
    setTimeout(() => {
      setProcessing(false);
      setConfirmOpen(false);

      setBuyNowItem(null);

      navigate("/placeorder", {
        state: {
          payableAmount,
          priceData,
          paymentMethod,
        },
      });
    }, 1200);
  };

  /* ================= LOAD SELECTED ADDRESS ================= */

  useEffect(() => {
    const loadSelectedAddress = async () => {
      try {
        if (!token) return;

        const res = await axios.get(`${backendUrl}/api/address/get`, {
          headers: { token },
        });

        if (!res.data.success) return;

        const { addresses, selectedAddressId } = res.data;

        const found = addresses.find((a) => a.addressId === selectedAddressId);

        if (!found) {
          navigate("/address");
          return;
        }

        setAddress(found);
      } catch {
        toast.error("Unable to load address");
        navigate("/address");
      } finally {
        // 🔥 THIS WAS MISSING
        setAddressLoading(false);
      }
    };

    loadSelectedAddress();
  }, [token, backendUrl, navigate]);

const buildItems = () => {
  // 🚀 BUY NOW FLOW
  if (buyNowItem) {
    return [
      {
        productId: buyNowItem.productId,
        size: buyNowItem.size,
        quantity: buyNowItem.quantity,
      },
    ];
  }

  // 🛒 NORMAL CART FLOW
  let items = [];

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
        toast.error("Please try later");
      }
    };

    loadPreview();
  }, [cartItems, couponValid, couponCode]); // 🔥 cartItems added

  if (addressLoading) return <OrderPreviewSkeleton />;
  if (!priceData) return <OrderPreviewSkeleton />;

  return (
    <section className="min-h-screen bg-black text-white pt-[64px] pb-28">
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* BACK */}
          <button
            onClick={() =>{ setBuyNowItem(null);
               navigate(-1)}
            }
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <FaArrowLeft />
          </button>

          {/* TITLE */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Step 3 of 3</p>
            <p className="font-semibold">Payments</p>
          </div>

          {/* SECURE */}
          <div className="flex items-center gap-1 text-xs text-green-300 cursor-pointer">
            <FaLock />
            <span>100% Secure</span>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-6 mt-4 sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= CART TOTAL ================= */}

          {/* LEFT SIDE */}
          <div className="lg:col-span-1">
            <div ref={cartTotalRef} className="sticky top-[80px]">
              <CartTotal priceData={priceData} forceOpenKey={cartOpenKey} />
              <div className="hidden lg:block">
                <CheckoutNote />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
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
                      {address?.houseNo}, {address?.street}, {address?.locality}
                      , {address?.city} – {address?.pincode}
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

            {/* ================= PAYMENT METHODS ================= */}
            <div className="mt-6 space-y-4">
              {/* ================= UPI PAYMENT ================= */}
              <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
                {/* HEADER */}
                <button
                  onClick={() => {
                    setPaymentMethod("upi");
                    setUpiOpen(true);
                    setCardOpen(false);
                    setCodOpen(false);
                  }}
                  className="
    w-full px-4 py-3 flex items-center justify-between
    border-b border-white/10 cursor-pointer
  "
                >
                  <div className="flex items-center gap-3">
                    <PaymentRadio active={paymentMethod === "upi"} />
                    <p className="font-semibold text-blue-500">Pay using UPI</p>
                  </div>

                  <FaChevronDown
                    className={`text-blue-500 transition-transform duration-300 ${
                      upiOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* COLLAPSIBLE BODY */}
                <div
                  className={`
      transition-all duration-300 ease-in-out
      ${upiOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
      overflow-hidden
    `}
                >
                  {/* UPI OPTIONS */}
                  {[
                    { id: "paytm", name: "Paytm" },
                    { id: "gpay", name: "Google Pay" },
                    { id: "phonepe", name: "PhonePe" },
                    { id: "navi", name: "Navi" },
                  ].map((upi) => {
                    const active = selectedUpi === upi.id;

                    return (
                      <div
                        key={upi.id}
                        onClick={() => setSelectedUpi(upi.id)}
                        className={`
            px-4 py-4 cursor-pointer transition
            border-t border-white/10
            ${active ? "bg-white/5 ring-1 ring-blue-500" : "hover:bg-white/5"}
          `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* RADIO */}
                            <div
                              className={`
                  w-4 h-4 rounded-full border flex items-center justify-center
                  ${active ? "border-blue-500" : "border-white/40"}
                `}
                            >
                              {active && (
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                              )}
                            </div>

                            <p className="text-white font-medium">{upi.name}</p>
                          </div>

                          {active && (
                            <FaCheckCircle className="text-blue-800 text-sm" />
                          )}
                        </div>

                        {/* CASHBACK */}
                        {active && upi.cashback && (
                          <p className="text-sm text-green-400 mt-1 ml-7">
                            ✓ {upi.cashback}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* PAY BUTTON */}
                  <div className="p-4 border-t border-white/10">
                    <button
                      onClick={handlePayClick}
                      className="
    w-full
    py-3
    rounded-xl
    font-semibold
    text-base
    bg-blue-500
    text-black
    hover:bg-blue-400
    active:scale-95
    transition-all
    cursor-pointer
  "
                    >
                      Pay ₹{formatINR(payableAmount)}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-2 cursor-pointer ">
                      Pay by any UPI app or need to Scan Qr
                    </p>
                  </div>

                  {/* ADD NEW UPI */}
                  <button className="w-full py-3 text-sm text-blue-400 border-t border-white/10 hover:bg-white/5 cursor-pointer">
                    + Add new UPI ID
                  </button>
                </div>
              </div>

              {/* ================= CARD ================= */}
              {/* ================= CARD PAYMENT ================= */}
              <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
                {/* HEADER */}
                <button
                  onClick={() => {
                    setPaymentMethod("card");
                    setCardOpen(true);
                    setUpiOpen(false);
                    setCodOpen(false);
                  }}
                  className="
    w-full px-4 py-3 flex items-center justify-between
    border-b border-white/10 cursor-pointer
  "
                >
                  <div className="flex items-center gap-3">
                    <PaymentRadio active={paymentMethod === "card"} />
                    <p className="font-semibold text-blue-500">
                      Pay using Card
                    </p>
                  </div>

                  <FaChevronDown
                    className={`text-blue-500 transition-transform duration-300 ${
                      cardOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div className="px-4 py-2 border-b border-white/10 bg-white/5">
                  <p className="text-xs text-gray-300 flex items-center gap-2">
                    <FaLock className="text-green-400 text-sm" />
                    Add and secure cards as per RBI Guidelines
                  </p>
                </div>

                {/* BODY */}
                <div
                  className={`
      transition-all duration-300 ease-in-out
      ${cardOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"}
      overflow-hidden
    `}
                >
                  <div className="px-4 py-4 space-y-3">
                    {/* CARD NUMBER */}
                    <input
                      value={card.number}
                      onChange={(e) =>
                        setCard({
                          ...card,
                          number: formatCardNumber(e.target.value),
                        })
                      }
                      placeholder="Card number"
                      className="
          w-full
          bg-black
          border border-white/20
          rounded-lg
          px-3 py-2
          text-white
          outline-none
          focus:border-blue-500
          cursor-text
        "
                    />

                    {/* EXPIRY + CVV */}
                    <div className="flex gap-2">
                      <input
                        value={card.expiry}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                        placeholder="MM/YY"
                        className="
            flex-1
            bg-black
            border border-white/20
            rounded-lg
            px-3 py-2
            text-white
            outline-none
            focus:border-blue-500
            cursor-text
          "
                      />

                      <input
                        type="password"
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                          })
                        }
                        placeholder="CVV"
                        className="
            flex-1
            bg-black
            border border-white/20
            rounded-lg
            px-3 py-2
            text-white
            outline-none
            focus:border-blue-500
            cursor-text
          "
                      />
                    </div>

                    {/* NAME */}
                    <input
                      value={card.name}
                      onChange={(e) =>
                        setCard({ ...card, name: e.target.value })
                      }
                      placeholder="Name on card"
                      className="
          w-full
          bg-black
          border border-white/20
          rounded-lg
          px-3 py-2
          text-white
          outline-none
          focus:border-blue-500
          cursor-text
        "
                    />

                    {/* PAY BUTTON */}
                    <button
  disabled={!isCardValid}
  onClick={isCardValid ? handlePayClick : undefined}
  className={`
    w-full
    py-3
    rounded-xl
    font-semibold
    text-base
    transition-all
    ${
      isCardValid
        ? "bg-blue-500 text-black hover:bg-blue-400 active:scale-95 cursor-pointer"
        : "bg-white/10 text-gray-500 cursor-not-allowed"
    }
  `}
>
  Pay ₹{formatINR(payableAmount)}
</button>

                  </div>
                </div>
              </div>

              {/* ================= CASH ON DELIVERY ================= */}
              <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
                {/* HEADER */}
                <button
                  onClick={() => {
                    setPaymentMethod("cod");
                    setCodOpen(true);
                    setUpiOpen(false);
                    setCardOpen(false);
                  }}
                  className="
    w-full px-4 py-3 flex items-center justify-between
    border-b border-white/10 cursor-pointer
  "
                >
                  <div className="flex items-center gap-3">
                    <PaymentRadio active={paymentMethod === "cod"} />
                    <p className="font-semibold text-blue-500 flex items-center gap-2">
                      <FaMoneyBillWave />
                      Cash on Delivery
                    </p>
                  </div>

                  <FaChevronDown
                    className={`text-blue-500 transition-transform duration-300 ${
                      codOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* BODY */}
                <div
                  className={`
      transition-all duration-300 ease-in-out
      ${codOpen ? "max-h-[160px] opacity-100" : "max-h-0 opacity-0"}
      overflow-hidden
    `}
                >
                  <div className="px-4 py-4 space-y-3">
                    <div className="flex items-start gap-3 text-sm text-gray-300">
                      <FaMoneyBillWave className="text-green-400 mt-0.5" />
                      <p>
                        Pay in cash when your order is delivered to your
                        address.
                      </p>
                    </div>

                    {/* COD INFO */}
                    <div className="text-xs text-yellow-400">
                      ₹20 COD handling charges may apply
                    </div>

                    {/* CONFIRM BUTTON */}
                    <button
                      onClick={handlePayClick}
                      className="
    w-full
    py-3
    rounded-xl
    font-semibold
    text-base
    bg-blue-500
    text-black
    hover:bg-blue-400
    active:scale-95
    transition-all
    cursor-pointer
  "
                    >
                      Place Order ₹{formatINR(payableAmount)}
                    </button>
                  </div>
                </div>
              </div>
              <div className="block lg:hidden ">
                <CheckoutNote />
              </div>
            </div>
          </div>
        </div>
      </div>
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-[#121212] w-[90%] max-w-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white text-center">
              Confirm Payment
            </h3>

            <p className="text-sm text-gray-400 text-center mt-2">
              You are about to pay
            </p>

            <p className="text-2xl font-bold text-green-400 text-center mt-1">
              ₹{formatINR(payableAmount)}
            </p>

            <div className="flex gap-3 mt-6">
              {/* CANCEL */}
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={processing}
                className="
            flex-1
            py-2
            rounded-lg
            bg-white/10
            text-white
            hover:bg-white/20
            transition
            cursor-pointer
          "
              >
                Cancel
              </button>

              {/* CONFIRM */}
              <button
                onClick={confirmPayment}
                disabled={processing}
                className="
            flex-1
            py-2
            rounded-lg
            bg-green-500
            text-black
            font-semibold
            hover:bg-green-400
            transition
            cursor-pointer
            disabled:opacity-50
          "
              >
                {processing ? "Processing..." : "Confirm & Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentPage;
