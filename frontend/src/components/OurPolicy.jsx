import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import Title from "./Title";

const OurPolicy = () => {
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

  return (
    <section>
      <div className="bg-black/90 border border-white/10 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.06)] mt-4 mb-4 sm:mt-6 sm:mb-6 lg:mt-8 lg:mb-8">
        <div className="w-full">

          {/* HEADER */}
          <div className="text-center text-white py-6 md:py-8">
            {showSkeleton ? (
              <>
                <div className="h-8 w-40 bg-gray-700/40 rounded mx-auto mb-4 animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-700/30 rounded mx-auto mb-2 animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-700/30 rounded mx-auto animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl">
                  <Title text1="Our" text2="Policies" />
                </div>
                <p className="mt-3 w-full sm:w-4/5 md:w-3/4 mx-auto text-gray-400">
                  Simple, transparent and customer-friendly policies designed to
                  keep your shopping experience smooth and worry-free.
                </p>
              </>
            )}
          </div>

          {/* POLICY GRID */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-3 pb-6">
            {showSkeleton ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full bg-[#1e1e1e] border border-white/10 rounded-xl p-6 text-center animate-pulse"
                >
                  <div className="w-14 h-14 bg-gray-700/40 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-700/40 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-700/30 rounded w-full mx-auto" />
                </div>
              ))
            ) : (
              <>
                {/* CARD 1 */}
                <NavLink to="/terms-conditions">
                  <div className="h-full bg-[#1e1e1e] border border-white/10 rounded-xl p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:border-white/20 transition">
                    <img src={assets.exchange_icon} className="w-14 mb-4 invert" />
                    <p className="font-semibold text-white text-lg">
                      Quick & Easy Exchange
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Hassle-free size and product exchanges within 48 hours.
                    </p>
                  </div>
                </NavLink>

                {/* CARD 2 */}
                <NavLink to="/refund-return">
                  <div className="h-full bg-[#1e1e1e] border border-white/10 rounded-xl p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:border-white/20 transition">
                    <img src={assets.quality_icon} className="w-14 mb-4 invert" />
                    <p className="font-semibold text-white text-lg">
                      7 Days Return Policy
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Returns accepted only for unused & undamaged products.
                    </p>
                  </div>
                </NavLink>

                {/* CARD 3 */}
                <NavLink to="/contact">
                  <div className="h-full bg-[#1e1e1e] border border-white/10 rounded-xl p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:border-white/20 transition">
                    <img src={assets.support_img} className="w-14 mb-4 invert" />
                    <p className="font-semibold text-white text-lg">
                      24/7 Customer Support
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      We’re always here to help you with orders & issues.
                    </p>
                  </div>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;


// import React from "react";
// import { assets } from "../assets/assets";
// import { NavLink } from "react-router-dom";
// import Title from "./Title";

// const OurPolicy = () => {
//   return (
//     <section>
//       {/* HERO-LIKE CARD CONTAINER (same as LatestCollection) */}
//       <div
//         className="
//           bg-black/90
//           border border-white/10
//           rounded-xl
//           overflow-hidden
//           shadow-[0_0_40px_rgba(255,255,255,0.06)]

//           mt-4 mb-4
//           sm:mt-6 sm:mb-6
//           lg:mt-8 lg:mb-8
//         "
//       >
//         <div className="w-full">
//           {/* HEADER */}
//           <div className="text-center text-white py-4 sm:py-6 md:py-8">
//             <div className="text-2xl sm:text-3xl md:text-4xl">
//               <Title text1="Our" text2="Policies" />
//             </div>

//             <p
//               className="
//                 mt-3
//                 w-full sm:w-4/5 md:w-3/4
//                 mx-auto
//                 text-sm sm:text-base md:text-lg
//                 leading-relaxed
//                 text-gray-400
//               "
//             ></p>
//           </div>

//           {/* POLICY GRID — CHIPKA HUA (same logic as LatestCollection) */}
//           <div
//             className="
//               mt-6
//               grid
//               grid-cols-1 sm:grid-cols-3
//               gap-2 sm:gap-3 md:gap-4 lg:gap-5
//               px-1 sm:px-2 md:px-3 lg:px-4
//               pb-4 sm:pb-6 md:pb-8
//             "
//           >
//             {/* CARD 1 */}
//             <NavLink to="/shipping-delivery">
//               <div
//                 className="
//                   h-full
//                   bg-[#1e1e1e]
//                   border border-white/10
//                   rounded-xl
//                   p-5 sm:p-6
//                   flex flex-col items-center text-center
//                   hover:scale-[1.03]
//                   hover:border-white/20
//                   transition-all duration-300
//                 "
//               >
//                 <img
//                   src={assets.exchange_icon}
//                   className="w-12 sm:w-14 mb-4 invert"
//                 />
//                 <p className="font-semibold text-white text-base sm:text-lg">
//                   Quick & Easy Exchange
//                 </p>
//                 <p className="text-gray-400 text-sm mt-1">
//                   Hassle-free size and product exchanges within 48 hours.
//                 </p>
//               </div>
//             </NavLink>

//             {/* CARD 2 */}
//             <NavLink to="/refund-return">
//               <div
//                 className="
//                   h-full
//                   bg-[#1e1e1e]
//                   border border-white/10
//                   rounded-xl
//                   p-5 sm:p-6
//                   flex flex-col items-center text-center
//                   hover:scale-[1.03]
//                   hover:border-white/20
//                   transition-all duration-300
//                 "
//               >
//                 <img
//                   src={assets.quality_icon}
//                   className="w-12 sm:w-14 mb-4 invert"
//                 />
//                 <p className="font-semibold text-white text-base sm:text-lg">
//                   7 Days Return Policy
//                 </p>
//                 <p className="text-gray-400 text-sm mt-1">
//                   Returns accepted only for unused & undamaged products.
//                 </p>
//               </div>
//             </NavLink>

//             {/* CARD 3 */}
//             <NavLink to="/contact">
//               <div
//                 className="
//                   h-full
//                   bg-[#1e1e1e]
//                   border border-white/10
//                   rounded-xl
//                   p-5 sm:p-6
//                   flex flex-col items-center text-center
//                   hover:scale-[1.03]
//                   hover:border-white/20
//                   transition-all duration-300
//                 "
//               >
//                 <img
//                   src={assets.support_img}
//                   className="w-12 sm:w-14 mb-4 invert"
//                 />
//                 <p className="font-semibold text-white text-base sm:text-lg">
//                   24/7 Customer Support
//                 </p>
//                 <p className="text-gray-400 text-sm mt-1">
//                   We’re always here to help you with orders & issues.
//                 </p>
//               </div>
//             </NavLink>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default OurPolicy;
