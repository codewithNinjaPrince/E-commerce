import React from "react";
import Title from "../components/Title";

const RefundReturnPolicy = () => {
  return (
    <div
      className="
        px-4 md:px-20 py-10 
        bg-black/90
        border-t border-white/10
        border-b border-white/20
        shadow-[0_0_25px_rgba(255,255,255,0.05)]
      "
    >
      {/* CENTER CONTENT WRAPPER */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">

        {/* Title */}
        <div className="text-2xl text-center mb-8 text-white">
        <Title text1={"Refund &"} text2={"Return"}></Title>
        </div>


        {/* Content */}
        <div className="space-y-8 text-white text-sm md:text-base leading-7">

          <p>
            Thank you for shopping with <span className="font-semibold text-white">Brawvly</span>.  
            We aim to provide high-quality products and a smooth shopping experience.  
            If something doesn’t go as expected, our easy 
            <span className="font-semibold text-white"> 7-day return policy</span> ensures support.
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">1. Eligibility for Returns</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>You can return products within <span className="font-semibold text-white">7 days</span> of delivery.</li>
              <li>The item must be unused, unworn, and in original condition.</li>
              <li>All tags, labels, and packaging must be intact.</li>
              <li>Used/damaged products will not be accepted.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">2. Non-Returnable Items</h2>
            <p className="text-gray-300">The following items cannot be returned:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Innerwear or hygiene-sensitive items</li>
              <li>Gift cards or marked “non-returnable” offers</li>
              <li>Products damaged after delivery due to misuse</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">3. Refund Process</h2>
            <p className="text-gray-300">After your return is approved:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Refund processed within <span className="font-semibold text-white">5–7 working days</span>.</li>
              <li>Refund mode: original payment method / store wallet.</li>
              <li>Email notification is sent once refund is issued.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">4. Exchange Policy</h2>
            <p className="text-gray-300">
              Exchanges are currently supported only for size issues (subject to availability).
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">5. Wrong or Damaged Product</h2>
            <p className="text-gray-300">
              If you receive a damaged, defective, or incorrect item, report it within  
              <span className="font-semibold text-white"> 48 hours</span> with photos.  
              We will arrange replacement or refund.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">6. Contact for Returns</h2>
            <p className="text-gray-300">
              Email: <span className="font-semibold text-white">dixitprince895@gmail.com</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundReturnPolicy;
