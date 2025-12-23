import React from "react";
import Title from "../components/Title";

const RefundReturnPolicy = () => {
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
            <Title text1="Refund &" text2="Return" />
          </div>

          {/* CONTENT */}
          <div className="max-w-5xl mx-auto space-y-8 text-sm md:text-base leading-7 text-gray-200">

            <p>
              Thank you for shopping with{" "}
              <span className="font-semibold text-white">Brawvly</span>. We aim
              to provide high-quality products and a smooth shopping experience.
              If something doesn’t go as expected, our easy{" "}
              <span className="font-semibold text-white">
                7-day return policy
              </span>{" "}
              ensures support.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                1. Eligibility for Returns
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Returns allowed within{" "}
                  <span className="font-semibold text-white">7 days</span> of
                  delivery.
                </li>
                <li>Item must be unused, unworn, and in original condition.</li>
                <li>All tags, labels, and packaging must be intact.</li>
                <li>Used or damaged products will not be accepted.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                2. Non-Returnable Items
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Innerwear or hygiene-sensitive items</li>
                <li>Gift cards or marked “non-returnable” products</li>
                <li>Items damaged after delivery due to misuse</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                3. Refund Process
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Refund processed within{" "}
                  <span className="font-semibold text-white">
                    5–7 working days
                  </span>
                  .
                </li>
                <li>Refund via original payment method or store wallet.</li>
                <li>Email notification sent once refund is issued.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                4. Exchange Policy
              </h3>
              <p>
                Exchanges are currently supported only for size-related issues
                (subject to availability).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                5. Wrong or Damaged Product
              </h3>
              <p>
                If you receive a damaged, defective, or incorrect item, report
                it within{" "}
                <span className="font-semibold text-white">48 hours</span> with
                photos. We will arrange a replacement or refund.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                6. Contact for Returns
              </h3>
               <a
                  href="tel:+918736852549"
                  className="hover:text-blue-400 font-medium"
                >
                 Phone: +91 87368 52549
                </a>
              <p>
                <a
                  href="mailto:support@brawvly.com"
                  className="hover:text-blue-400 font-medium"
                >
                  Email: support@brawvly.com
                </a>
                
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundReturnPolicy;
