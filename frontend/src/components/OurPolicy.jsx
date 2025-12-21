import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const OurPolicy = () => {
  return (
    <section className="section-top-gap">
      <div
        className="
          relative left-1/2 right-1/2 
          -mx-[50vw] 
          w-screen
          bg-black/90
          py-16
        "
      >
        {/* CENTER CONTENT */}
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10">

          {/* ROW */}
          <div className="flex flex-col sm:flex-row gap-14 text-center items-stretch">

            {/* CARD 1 */}
            <NavLink to="/shipping-delivery" className="w-full">
              <div
                className="
                  h-full
                  flex flex-col items-center justify-between
                  cursor-pointer
                  bg-[#1e1e1e] border border-white/10
                  rounded-xl p-6
                  hover:scale-[1.03] hover:border-white/20
                  transition-all duration-300
                "
              >
                <div>
                  <img
                    src={assets.exchange_icon}
                    className="w-14 mx-auto mb-4 invert"
                  />
                  <p className="font-semibold text-white text-lg">
                    Quick & Easy Exchange
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Hassle-free size and product exchanges within 48 hours.
                  </p>
                </div>
              </div>
            </NavLink>

            {/* CARD 2 */}
            <NavLink to="/refund-return" className="w-full">
              <div
                className="
                  h-full
                  flex flex-col items-center justify-between
                  cursor-pointer
                  bg-[#1e1e1e] border border-white/10
                  rounded-xl p-6
                  hover:scale-[1.03] hover:border-white/20
                  transition-all duration-300
                "
              >
                <div>
                  <img
                    src={assets.quality_icon}
                    className="w-14 mx-auto mb-4 invert"
                  />
                  <p className="font-semibold text-white text-lg">
                    7 Days Return Policy
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Returns accepted only for unused & undamaged product with all tags.
                  </p>
                </div>
              </div>
            </NavLink>

            {/* CARD 3 */}
            <NavLink to="/contact" className="w-full">
              <div
                className="
                  h-full
                  flex flex-col items-center justify-between
                  cursor-pointer
                  bg-[#1e1e1e] border border-white/10
                  rounded-xl p-6
                  hover:scale-[1.03] hover:border-white/20
                  transition-all duration-300
                "
              >
                <div>
                  <img
                    src={assets.support_img}
                    className="w-14 mx-auto mb-4 invert"
                  />
                  <p className="font-semibold text-white text-lg">
                    24/7 Customer Support
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    We're always here to help you with orders & issues. Contact us whenever needed.
                  </p>
                </div>
              </div>
            </NavLink>

          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
