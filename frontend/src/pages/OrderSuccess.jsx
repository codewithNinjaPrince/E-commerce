import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaHome, FaBriefcase } from "react-icons/fa";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

/* ---------------- HELPERS ---------------- */
const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 9);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/* ---------------- CONFETTI ---------------- */
const Confetti = () => (
  <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <span
        key={i}
        className="absolute w-2 h-2 rounded-full animate-confetti"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ["#22c55e", "#3b82f6", "#eab308"][i % 3],
          animationDelay: `${Math.random() * 0.4}s`,
        }}
      />
    ))}
  </div>
);

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(ShopContext);

  const [address, setAddress] = useState(null);
  const [step, setStep] = useState(0); // text animation
  const [showConfetti, setShowConfetti] = useState(true);

  const handleChangeAddress = () => {
    navigate("/address", {
      state: { from: "order-success" },
    });
  };

  /* ---------------- LOAD ADDRESS ---------------- */
  useEffect(() => {
    const loadAddress = async () => {
      try {
        if (!token) return;
        const res = await axios.get(`${backendUrl}/api/address/get`, {
          headers: { token },
        });
        if (res.data?.success) {
          const { addresses, selectedAddressId } = res.data;
          setAddress(
            addresses.find((a) => a.addressId === selectedAddressId) || null
          );
        }
      } catch {}
    };
    loadAddress();
  }, [backendUrl, token]);

  useEffect(() => {
    sessionStorage.removeItem("checkout_source");
  }, []);

  /* ---------------- STEP ANIMATION ---------------- */
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => setStep(3), 2600);
    const t4 = setTimeout(() => setShowConfetti(false), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <section className="min-h-screen bg-black text-white pt-[64px] relative overflow-hidden">
      {showConfetti && <Confetti />}

      {/* ================= NAVBAR ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div />
          <p className="font-semibold">Order Confirmed</p>
          <button
            onClick={() => navigate("/orders")}
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="max-w-3xl mx-auto px-4 mt-12 text-center relative z-10">
        {/* CHECK */}
        <div className="w-28 h-28 mx-auto rounded-full bg-green-500/10 flex items-center justify-center animate-scaleIn shadow-lg shadow-green-500/20">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
            <FaCheck className="text-black text-3xl animate-checkDraw" />
          </div>
        </div>

        {/* TEXT STEPS */}
        {step >= 1 && (
          <h1 className="text-2xl sm:text-3xl font-bold mt-6 animate-fadeUp">
            Thanks for shopping with us 💙
          </h1>
        )}

        {step >= 2 && (
          <p className="text-gray-400 mt-2 animate-fadeUp">
            Your order is confirmed & moving fast 🚀
          </p>
        )}

        {step >= 3 && (
          <p className="mt-6 text-sm text-gray-300 animate-fadeUp">
            📦 Packing now • 🚚 Delivery by{" "}
            <span className="text-white font-medium">{deliveryDate()}</span>
          </p>
        )}

        {/* ================= ADDRESS ================= */}
        {address && step >= 3 && (
          <div className="mt-10 bg-[#121212] p-5 rounded-2xl border border-white/10 text-left animate-fadeUp">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* LEFT */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {address.type === "home" ? <FaHome /> : <FaBriefcase />}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                    Delivering to
                  </p>

                  <p className="font-semibold text-white">{address.name}</p>

                  <p className="text-sm text-gray-300 mt-1">
                    {address.houseNo}, {address.street}, {address.locality},{" "}
                    {address.city} – {address.pincode}
                  </p>

                  <p className="text-sm mt-1">📞 {address.phone}</p>

                  <p className="text-xm text-gray-500 mt-2">
                    You can change the delivery address before the order is
                    shipped
                  </p>
                </div>
              </div>

              {/* RIGHT (Desktop) */}
              <div className="hidden md:flex items-center">
                <button
                  onClick={handleChangeAddress}
                  className="
            px-4 py-2
            rounded-lg
            border border-white/20
            text-sm text-green-400
            hover:border-white/40
            hover:bg-white/5
            transition
            cursor-pointer
            whitespace-nowrap
          "
                >
                  Change address
                </button>
              </div>
            </div>

            {/* MOBILE CTA */}
            <div className="md:hidden mt-4">
              <button
                onClick={handleChangeAddress}
                className="
          w-full
          py-2
          rounded-xl
          border border-white/20
          text-sm text-green-400
          hover:bg-white/5
          transition
          cursor-pointer
        "
              >
                Change delivery address
              </button>
            </div>
          </div>
        )}

        {/* ================= CTA ================= */}
        {step >= 3 && (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fadeUp">
            <button
              onClick={() => navigate("/orders")}
              className="px-7 py-3 rounded-xl bg-blue-500 text-black font-semibold hover:bg-blue-400 cursor-pointer"
            >
              Track & Manage Order
            </button>

            <button
              onClick={() => navigate("/", { replace: true })}
              className="px-7 py-3 rounded-xl border border-white/20 hover:bg-white/5 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderSuccess;
