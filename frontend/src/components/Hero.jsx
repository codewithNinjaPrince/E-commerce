import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div
      className="
        flex flex-col sm:flex-row 
        bg-gradient-to-r from-[#111] via-[#151515] to-[#1c1c1c]
        border border-white/10
        rounded-xl overflow-hidden
        shadow-[0_0_40px_rgba(255,255,255,0.06)]
        mt-6
      "
    >
      {/* LEFT SIDE */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-14 px-8 sm:px-12">
        <div className="text-white space-y-4">

          {/* TOP TAG */}
          <div className="flex items-center gap-3 opacity-90">
            <p className="w-10 md:w-14 h-[2px] bg-white/60"></p>
            <p className="text-sm md:text-base font-light tracking-wide">
              Our Bestseller
            </p>
          </div>

          {/* HEADING */}
          <h1
            className="
              text-4xl md:text-5xl lg:text-6xl 
              font-semibold leading-tight prata-regular
              drop-shadow-[0_4px_15px_rgba(255,255,255,0.12)]
            "
          >
            Latest Arrivals
          </h1>

          {/* SHOP NOW */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <p className="text-sm md:text-base font-medium tracking-wide group-hover:text-gray-300 transition">
              Shop Now
            </p>
            <p className="w-10 md:w-14 h-[2px] bg-white/50 group-hover:w-20 transition-all duration-300"></p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="w-full sm:w-1/2 relative">
        <img
          className="w-full h-full object-cover brightness-105 hover:brightness-110 transition duration-500"
          src={assets.hero_img}
          alt="hero"
        />

        {/* LIGHT FOG OVERLAY */}
        {/* <div className="absolute inset-0 bg-gradient-to-l from-black/25 to-transparent"></div> */}
      </div>
    </div>
  );
};

export default Hero;




