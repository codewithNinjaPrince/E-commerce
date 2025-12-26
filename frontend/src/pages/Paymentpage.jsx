import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import {
  FaArrowLeft,
  FaLock,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

/* ================= HELPERS ================= */
const getExpectedDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 9);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

/* ================= PAGE ================= */
const PaymentPage = () => {
  const navigate = useNavigate();
  const { priceData } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [selectedUpi, setSelectedUpi] = useState("gpay");
  const [address, setAddress] = useState(null);

  /* ================= LOAD SELECTED ADDRESS ================= */
  useEffect(() => {
    const saved = localStorage.getItem("selectedAddress");
    if (saved) setAddress(JSON.parse(saved));
  }, []);

  return (
    <section className="min-h-screen bg-black text-white">
      {/* ================= FIXED HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <FaArrowLeft />
            </button>

            <div>
              <p className="text-xs text-gray-400">Step 3 of 3</p>
              <p className="font-semibold">Payments</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-green-400">
            <FaLock />
            <span>100% Secure</span>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="pt-[80px] pb-32 max-w-3xl mx-auto px-4">
        {/* ================= ADDRESS INFO ================= */}
        {address && (
          <div className="bg-[#121212] border border-white/10 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">Delivering to</p>

            <p className="font-medium truncate">
              {address.name}, {address.city} – {address.pincode}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Delivery expected by{" "}
              <span className="text-green-400 font-medium">
                {getExpectedDate()}
              </span>
            </p>
          </div>
        )}

        {/* ================= CART TOTAL ================= */}
        <CartTotal priceData={priceData} />

        {/* ================= PAYMENT METHODS ================= */}
        <div className="mt-6 space-y-4">
          {/* ================= UPI ================= */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setPaymentMethod("upi")}
              className="w-full flex justify-between items-center p-4"
            >
              <span className="font-medium">UPI</span>
              {paymentMethod === "upi" ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </button>

            {paymentMethod === "upi" && (
              <div className="px-4 pb-4 space-y-3">
                {[
                  { id: "paytm", name: "Paytm" },
                  { id: "phonepe", name: "PhonePe" },
                  { id: "gpay", name: "Google Pay" },
                ].map((upi) => (
                  <label
                    key={upi.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center
                        ${
                          selectedUpi === upi.id
                            ? "border-blue-500"
                            : "border-gray-500"
                        }
                      `}
                    >
                      {selectedUpi === upi.id && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </span>

                    <span className="flex-1">{upi.name}</span>

                    <span className="text-xs text-gray-400">LOGO</span>
                  </label>
                ))}

                <button
                  className="
                    w-full mt-4
                    bg-yellow-400 text-black
                    py-3 rounded-xl font-semibold
                    hover:bg-yellow-300
                    transition cursor-pointer
                  "
                >
                  Pay ₹{priceData?.payableAmount ?? "--"}
                </button>
              </div>
            )}
          </div>

          {/* ================= CARD ================= */}
          <div className="border border-white/10 rounded-xl">
            <button
              onClick={() => setPaymentMethod("card")}
              className="w-full flex justify-between items-center p-4"
            >
              <span>Credit / Debit / ATM Card</span>
              {paymentMethod === "card" ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </button>
          </div>

          {/* ================= COD ================= */}
          <div className="border border-white/10 rounded-xl">
            <button
              onClick={() => setPaymentMethod("cod")}
              className="w-full flex justify-between items-center p-4"
            >
              <span>Cash on Delivery</span>
              {paymentMethod === "cod" ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
