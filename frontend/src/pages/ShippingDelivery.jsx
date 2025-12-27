import React from "react";
import Title from "../components/Title";
import { useLayoutEffect } from "react";


const ShippingDelivery = () => {

  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  
  return (
    
    <section className="pt-20 sm:pt-22 lg:pt-26 pb-16 px-2 sm:px-4 md:px-6">
      <div
        className="
          max-w-7xl mx-auto
          bg-black/90
          border border-white/10
          rounded-2xl
          shadow-[0_0_40px_rgba(255,255,255,0.06)]
          overflow-hidden
        "
      >
        <div className="px-4 sm:px-6 md:px-10 py-10 text-white">

          {/* PAGE TITLE */}
          <div className="text-2xl text-center mb-10">
            <Title text1="Shipping &" text2="Delivery" />
          </div>


        {/* CONTENT */}
        <div className=" max-w-5xl mx-auto space-y-8 text-white text-sm md:text-base leading-7 text-gray-300">

          <p>
            At <span className="font-semibold text-white">Brawvly</span>, we work with trusted delivery
            partners to ensure your orders reach you safely and on time.
            Here’s everything you need to know about our shipping process.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Delivery Time</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Standard delivery time: <span className="font-semibold text-white">3–7 business days</span>.
              </li>
              <li>
                Remote or rural areas may take slightly longer depending on courier availability.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Shipping Charges</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Free delivery on orders above a certain value (if applicable).</li>
              <li>Standard shipping fee shown at checkout for smaller orders.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. Order Tracking</h2>
            <p className="text-gray-300">
              After your order is shipped, you will receive an SMS/email with a tracking link.  
              You can check real-time delivery updates anytime.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Delivery Attempts</h2>
            <p className="text-gray-300">
              If you miss the delivery, our courier partner will make 
              <span className="font-semibold text-white"> 2 more attempts</span>.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Delays</h2>
            <p className="text-gray-300">
              During festivals, extreme weather, or logistics issues, delivery may take longer.  
              We will keep you informed whenever possible.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Incorrect Address</h2>
            <p className="text-gray-300">
              If the provided address is incorrect or unreachable, your order may return to us.  
              Additional charges may apply for reshipping.
            </p>
          </div>

          {/* Section 7 */}
          <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                7. Contact for Delivery Issues
              </h3>
            <p className="text-gray-300">
                Email:{" "}
                <a
                  href="mailto:support@brawvly.com"
                  className="hover:text-blue-400 font-medium"
                >
                  support@brawvly.com
                  <br />
                </a>
                Phone:{" "}
                <a
                  href="tel:+918736852549"
                  className="hover:text-blue-400 font-medium"
                >
                  +91 87368 52549
                </a>
              </p>
          </div>

        </div>
      </div>
    </div>
    </section>
  );
};

export default ShippingDelivery;

