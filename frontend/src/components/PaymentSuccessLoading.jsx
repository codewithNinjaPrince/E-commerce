import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const Confetti = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {[...Array(30)].map((_, i) => (
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
};

const PaymentSuccessLoading = () => {
  const navigate = useNavigate();

  const [showConfetti, setShowConfetti] = useState(true);
  const [packingStep, setPackingStep] = useState(false);

  useEffect(() => {
    // ✅ CLEAR CHECKOUT FLOW STATE
    sessionStorage.removeItem("checkout_source");

    const packingTimer = setTimeout(() => {
      setPackingStep(true);
    }, 2000);

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 2000);

    const navTimer = setTimeout(() => {
      navigate("/order-success", { replace: true });
    }, 7500);

    return () => {
      clearTimeout(packingTimer);
      clearTimeout(confettiTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  const now = new Date();

  return (
    <section className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* 🎉 CONFETTI */}
      {showConfetti && <Confetti />}

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 animate-pulse" />

      {/* CHECK ANIMATION */}
      <div className="relative z-10">
        {/* OUTER RING */}
        <div className="w-28 h-28 rounded-full border-4 border-green-500/30 flex items-center justify-center animate-[ping_2s_ease-out_infinite]" />

        {/* INNER CIRCLE */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 animate-scaleIn">
            <FaCheck className="text-black text-3xl" />
          </div>
        </div>
      </div>

      {/* TEXT */}
      <div className="relative z-10 text-center mt-8 px-4">
        <p className="text-2xl sm:text-3xl font-bold">
          Order placed successfully 🎉
        </p>

        {!packingStep ? (
          <p className="text-gray-400 mt-2">Securing your payment…</p>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-green-400 animate-fadeIn">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              <span>Placing your order</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150" />
            </div>
            <p className="text-xs text-gray-400">
              Getting it ready for dispatch 🚚
            </p>
          </div>
        )}

        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          {now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          •{" "}
          {now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <p className="mt-6 text-xs text-gray-400">
          Please don’t refresh or press back
        </p>
      </div>

      {/* PROGRESS DOTS */}
      <div className="flex gap-2 mt-6 relative z-10">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-green-500/70 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </section>
  );
};

export default PaymentSuccessLoading;
