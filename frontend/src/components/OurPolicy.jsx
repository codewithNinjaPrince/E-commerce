import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const OurPolicy = () => {
  return (
    <div
      className="
        relative left-1/2 right-1/2 
        -mx-[50vw] 
        w-screen
        bg-black/90
        py-16 
        shadow-[0_0_40px_rgba(255,255,255,0.04)]
      "
    >
      {/* CENTER CONTENT */}
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10">

        <div className="flex flex-col sm:flex-row justify-between gap-14 text-center">

          {/* CARD 1 - SHIPPING & DELIVERY */}
          <NavLink to="/shipping-delivery" className="w-full">
            <div
              className="
                cursor-pointer 
                bg-[#1e1e1e] border border-white/10 
                rounded-xl p-6 w-full
                hover:scale-[1.03] hover:border-white/20 
                transition-all duration-300
                shadow-[0_0_20px_rgba(255,255,255,0.03)]
              "
            >
              <img src={assets.exchange_icon} className="w-14 mx-auto mb-4 invert" />
              <p className="font-semibold text-white text-lg">Quick & Easy Exchange</p>
              <p className="text-gray-400 text-sm mt-1">
                Hassle-free size and product exchanges within 48 hours.
              </p>
            </div>
          </NavLink>

         {/* CARD 2 - REFUND & RETURN */}
          <NavLink to="/refund-return" className="w-full">
            <div
              className="
                cursor-pointer 
                bg-[#1e1e1e] border border-white/10 
                rounded-xl p-6 w-full
                hover:scale-[1.03] hover:border-white/20 
                transition-all duration-300
                shadow-[0_0_20px_rgba(255,255,255,0.03)]
              "
            >
              <img src={assets.quality_icon} className="w-14 mx-auto mb-4 invert" />
              <p className="font-semibold text-white text-lg">7 Days Return Policy</p>
              <p className="text-gray-400 text-sm mt-1">
                Returns accepted only for unused & undamaged product with all tags.
              </p>
            </div>
          </NavLink>

          {/* CARD 3 - CONTACT PAGE */}
          <NavLink to="/contact" className="w-full">
            <div
              className="
                cursor-pointer 
                bg-[#1e1e1e] border border-white/10 
                rounded-xl p-6 w-full
                hover:scale-[1.03] hover:border-white/20 
                transition-all duration-300
                shadow-[0_0_20px_rgba(255,255,255,0.03)]
              "
            >
              <img src={assets.support_img} className="w-14 mx-auto mb-4 invert" />
              <p className="font-semibold text-white text-lg">24/7 Customer Support</p>
              <p className="text-gray-400 text-sm mt-1">
                We're always here to help you with orders & issues Contact Us Whenever needed.
              </p>
            </div>
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
