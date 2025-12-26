import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  /* 🌐 ONLINE / OFFLINE */
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  const showSkeleton = !isOnline;

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
    <section>
      <div className="bg-black/90 border border-white/10 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.06)] mt-4 mb-4 sm:mt-6 sm:mb-6 lg:mt-8 lg:mb-8 relative">

        {/* 🔄 SUBMIT LOADER OVERLAY */}
        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
            <p className="text-gray-300 mt-4 text-sm tracking-wide">
              Subscribing...
            </p>
          </div>
        )}

        <div className="w-full text-center px-4 sm:px-6 md:px-10 py-8 md:py-10">

          {/* HEADER */}
          {showSkeleton ? (
            <>
              <div className="h-8 w-72 bg-gray-700/40 rounded mx-auto mb-4 animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-700/30 rounded mx-auto animate-pulse" />
            </>
          ) : (
            <>
              <p className="text-2xl sm:text-3xl font-semibold text-white tracking-wide">
                📩 Subscribe Now & Get Great Discounts
              </p>

              <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
                Get exclusive first looks, member-only deals, and updates curated
                just for you ✨
              </p>
            </>
          )}

          {/* FORM / SKELETON */}
          <div className="mt-6 w-full sm:w-2/3 lg:w-1/2 mx-auto">
            {showSkeleton ? (
              <div className="flex gap-3 bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 animate-pulse">
                <div className="flex-1 h-10 bg-gray-700/40 rounded-lg" />
                <div className="w-24 h-10 bg-gray-700/40 rounded-lg" />
              </div>
            ) : (
              <form
                onSubmit={onSubmitHandler}
                className="flex items-center gap-3 bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2"
              >
                <input
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  disabled={loading}
                  className="bg-gray-600 hover:bg-gray-500 text-white text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* FOOT NOTE */}
          {!showSkeleton && (
            <p className="text-xs font-semibold text-gray-500 mt-4">
              🔒 No spam. Unsubscribe anytime.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
