import React, { useEffect, useState } from "react";
import preloaderImg from "../assets/Preloader.png"; // your uploaded image

const Preloader = ({ isLoading }) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 1 min timeout checker
    const timeout = setTimeout(() => {
      if (isLoading) {
        setShowTimeout(true);
      }
    }, 60000); // 60 sec

    // hide animation when loading completes
    if (!isLoading) {
      setTimeout(() => setVisible(false), 800); // fade-out time
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

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

      {/* Loading text */}
      {!showTimeout && (
        <p className="text-white text-center text-sm sm:text-lg mt-6 animate-pulse px-6">
          Preparing your shopping experience…
        </p>
      )}

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
