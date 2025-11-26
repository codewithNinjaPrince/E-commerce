import React from "react";
import Title from "../components/Title";

const ShippingDelivery = () => {
  return (
    <div
      className="
        px-4 md:px-20 py-10
        bg-black
        bg-black/90
        border-t border-white/10
        border-b border-white/20
        shadow-[0_0_25px_rgba(255,255,255,0.05)]
      "
    >
      {/* CENTERED CONTENT CONTAINER */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">

        {/* TITLE */}
        <div className="text-2xl text-center mb-8 text-white">
        <Title text1={"Shipping &"} text2={"Delivery"}></Title>
        </div>


        {/* CONTENT */}
        <div className="space-y-8 text-white text-sm md:text-base leading-7">

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
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">7. Contact for Delivery Issues</h2>
            <p className="text-gray-300">
              Email: <span className="font-semibold text-white">dixitprince895@gmail.com</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;

