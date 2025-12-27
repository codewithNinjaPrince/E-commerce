import React from "react";
import Title from "../components/Title";
import { useLayoutEffect } from "react";

const AffiliatePolicy = () => {
  useLayoutEffect(() => {
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
            <Title text1="Affiliate" text2="Policy" />
          </div>

          <div className="max-w-7xl mx-auto space-y-8 text-sm md:text-base leading-7 text-gray-200">
            <p>
              Welcome to the <span className="font-semibold text-white">Brawvly Affiliate Program</span>.
              This Affiliate Policy outlines the terms and conditions governing
              participation in our affiliate program. By joining or promoting
              Brawvly, you agree to comply with this policy.
            </p>

            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                1. Affiliate Program Overview
              </h3>
              <p>
                The Brawvly Affiliate Program allows individuals, creators,
                influencers, and partners to earn commissions by promoting
                Brawvly products through approved affiliate links.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                2. Eligibility
              </h3>
              <p>
                To participate, you must be at least 18 years old and capable of
                entering into a legal agreement. Brawvly reserves the right to
                approve or reject any affiliate application at its sole
                discretion.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                3. Affiliate Responsibilities
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Promote Brawvly honestly and ethically.</li>
                <li>Do not make false claims, misleading offers, or fake discounts.</li>
                <li>Do not engage in spam, paid traffic abuse, or misleading ads.</li>
                <li>Comply with all applicable advertising and consumer laws.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                4. Commission & Tracking
              </h3>
              <p>
                Commissions are tracked via unique affiliate links provided by
                Brawvly. Earnings are credited only for valid purchases that are
                successfully completed and not refunded or cancelled.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                5. Payment Terms
              </h3>
              <p>
                Affiliate payouts are processed as per the payment cycle defined
                by Brawvly. Minimum payout thresholds may apply. Payments are
                subject to verification and deduction of applicable taxes.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                6. Prohibited Activities
              </h3>
              <p>
                Affiliates must not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use Brawvly branding for impersonation.</li>
                <li>Run ads pretending to be the official Brawvly website.</li>
                <li>Use coupon misuse, click fraud, or fake traffic.</li>
                <li>Promote illegal, adult, or misleading content.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                7. Termination
              </h3>
              <p>
                Brawvly reserves the right to suspend or terminate any affiliate
                account at any time for violation of this policy or misuse of
                the program. No unpaid commissions will be released in such
                cases.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                8. Limitation of Liability
              </h3>
              <p>
                Brawvly shall not be liable for indirect, incidental, or
                consequential damages arising from affiliate participation,
                including loss of revenue or data.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                9. Policy Updates
              </h3>
              <p>
                We may modify this Affiliate Policy at any time. Continued
                participation in the program after changes implies acceptance
                of the updated terms.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                10. Governing Law
              </h3>
              <p>
                This policy shall be governed by the laws of India. Any disputes
                shall be subject to the jurisdiction of courts in Uttar Pradesh,
                India.
              </p>
            </div>

            {/* Contact */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                11. Contact Us
              </h3>
              <p className="text-gray-300">
                For affiliate-related questions, reach out to us at:
              </p>
              <p className="mt-3 text-gray-200">
                📧 Email:{" "}
                <a
                  href="mailto:support@brawvly.com"
                  className="hover:text-blue-400 font-medium"
                >
                  support@brawvly.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliatePolicy;
