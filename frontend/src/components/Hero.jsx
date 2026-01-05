import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const showSkeleton = !isOnline || !imageLoaded;

  return (
    <NavLink to="/collections">
      <p className="sr-only">
        Explore the latest arrivals on Brawvly, an Indian online marketplace
        offering fashion, lifestyle, and daily-use products from trusted local
        merchants across India.
      </p>

      <div
        className="
          flex flex-col sm:flex-row
          bg-gradient-to-r from-[#111] via-[#151515] to-[#1c1c1c]
          border border-white/10
          rounded-xl overflow-hidden
          shadow-[0_0_40px_rgba(255,255,255,0.06)]
          cursor-pointer
          mt-4 mb-4 sm:mt-6 sm:mb-6 lg:mt-8 lg:mb-8
        "
      >
        {/* LEFT SIDE */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-14 px-8 sm:px-12">
          {showSkeleton ? (
            <div className="space-y-5 w-full animate-pulse">
              <div className="h-3 w-32 bg-gray-700/40 rounded" />
              <div className="h-10 w-3/4 bg-gray-700/40 rounded" />
              <div className="h-4 w-24 bg-gray-700/30 rounded" />
            </div>
          ) : (
            <div className="text-white space-y-4">
              <div className="flex items-center gap-3 opacity-90">
                <p className="w-10 md:w-14 h-[2px] bg-white/60"></p>
                <p className="text-sm md:text-base font-light tracking-wide">
                  Our Bestseller
                </p>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight prata-regular">
                Latest Arrivals on Brawvly
              </h1>

              <div className="flex items-center gap-3 group">
                <p className="text-sm md:text-base font-medium tracking-wide group-hover:text-gray-300 transition">
                  Shop Now
                </p>
                <p className="w-10 md:w-14 h-[2px] bg-white/50 group-hover:w-20 transition-all duration-300"></p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-full sm:w-1/2 relative min-h-[240px] sm:min-h-full">
          {showSkeleton && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#1a1a1a] via-[#222] to-[#1a1a1a]" />
          )}

          <img
            src={assets.hero_img}
            alt="Shop latest arrivals on Brawvly – Indian online marketplace for fashion and lifestyle products"
            onLoad={() => setImageLoaded(true)}
            className={`
              w-full h-full object-cover
              transition-opacity duration-700
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
          />
        </div>
      </div>
    </NavLink>
  );
};

export default Hero;
