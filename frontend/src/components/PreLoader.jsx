import React, { useEffect, useState } from "react";
import preloaderImg from "../assets/Preloader.png"; // your uploaded image

const Preloader = ({ isLoading }) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 🔥 force hide after 2.5 sec (even if loading)
    const hardLimit = setTimeout(() => {
      setVisible(false);
    }, 4000);

    // normal hide when loading completes
    if (!isLoading) {
      const fade = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(fade);
    }

    return () => clearTimeout(hardLimit);
  }, [isLoading]);

  useEffect(() => {
    let timeout;

    if (isLoading) {
      timeout = setTimeout(() => {
        setShowTimeout(true);
      }, 6000); // ⏳ only if REALLY slow
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const MESSAGES = [
    "Preparing your store…",
    "Loading latest trends…",
    "Almost there…",
    "Polishing your experience…",
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setMsgIndex((p) => (p + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(i);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999] overflow-hidden">
      {/* Rotating Circle */}
      <div className="relative flex items-center justify-center">
        <div className="w-40 h-40 sm:w-48 sm:h-48 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

        {/* Your Preloader Image */}
        <img
          src={preloaderImg}
          alt="Preloader Logo"
          className="absolute w-20 sm:w-24 drop-shadow-xl"
        />
      </div>

      <p className="mt-6 text-sm animate-fadeIn">{MESSAGES[msgIndex]}</p>

      {/* Timeout Message */}
      {showTimeout && (
        <div className="text-center text-white mt-6 px-6">
          <p className="text-lg font-semibold">Connection Timed Out</p>
          <p className="text-sm mt-2 opacity-80">Please refresh the page.</p>
        </div>
      )}
    </div>
  );
};

export default Preloader;
