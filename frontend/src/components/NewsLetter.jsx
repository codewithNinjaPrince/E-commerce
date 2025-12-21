import React, { useState } from "react";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter a valid email");
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://e-commerce-eight-blue-36.vercel.app/api/email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setLoading(false);
      toast.error("Server not responding. Try again later.");
    }
  };

  return (
    <section className="section-top-gap">
      <div
        className="
          relative left-1/2 right-1/2
          -mx-[50vw]
          w-screen
          bg-black/90
          py-16
          shadow-[0_0_25px_rgba(255,255,255,0.05)]
          overflow-hidden
        "
      >
        {/* ======= LOADER OVERLAY ======= */}
        {loading && (
          <div
            className="
              absolute inset-0
              bg-black/80 backdrop-blur-sm
              flex flex-col items-center justify-center
              z-20
            "
          >
            <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
            <p className="text-gray-300 mt-4 tracking-wide">
              Subscribing...
            </p>
          </div>
        )}

        {/* INNER CONTENT */}
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-2xl font-semibold text-white tracking-wide">
            Subscribe Now & Get Great Discounts
          </p>

          <p className="text-gray-300 mt-3 text-sm sm:text-base">
            Get exclusive first looks, member-only deals, and content hand-picked
            just for you.
          </p>

          {/* FORM */}
          <form
            onSubmit={onSubmitHandler}
            className="
              w-full sm:w-2/3 lg:w-1/2
              flex items-center gap-3
              mx-auto mt-6
              bg-[#1c1c1c] border border-white/10
              rounded-xl px-4 py-2
              shadow-[0_0_15px_rgba(255,255,255,0.03)]
            "
          >
            <input
              className="
                w-full bg-transparent outline-none
                text-white placeholder-gray-400
                text-sm sm:text-base
              "
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              disabled={loading}
              className="
                bg-gray-600 hover:bg-gray-500
                text-white text-xs sm:text-sm
                px-6 sm:px-8 py-3
                rounded-lg
                transition-all duration-300
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              type="submit"
            >
              {loading ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
