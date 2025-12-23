import React from "react";
import Title from "../components/Title";

const PrivacyPolicy = () => {
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
          <div className="text-2xl text-center mb-8">
            <Title text1="Privacy &" text2="Policy" />
            <p className="max-w-3xl mx-auto text-gray-300 text-sm md:text-base mt-3">
              Your privacy matters to us. This page explains how Brawvly
              collects, uses, and safeguards your information.
            </p>
          </div>

          {/* CONTENT */}
          <div className="max-w-5xl mx-auto space-y-8 text-sm md:text-base leading-7 text-gray-200">

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                1. Information We Collect
              </h3>
              <p>
                We collect personal details such as name, email, phone number,
                delivery address, device data, cookies, and browsing behavior.
              </p>
              <p className="mt-2">
                For sellers, we may collect business details, documents, and
                bank information for payouts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                2. How We Use Your Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Account creation and management</li>
                <li>Order processing, returns, and refunds</li>
                <li>Platform personalization and analytics</li>
                <li>Fraud prevention and security</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                3. Data Security
              </h3>
              <p>
                We use HTTPS encryption, secure payment gateways, and restricted
                access systems. However, no system is 100% risk-free.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                4. Sharing of Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Sellers and delivery partners</li>
                <li>Payment gateways</li>
                <li>Analytics and technical service providers</li>
                <li>Legal authorities when required</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                5. Cookies & Tracking
              </h3>
              <p>
                Cookies help improve your experience. Disabling cookies may
                affect certain features.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                6. Your Rights
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Access or update your data</li>
                <li>Request account or data deletion</li>
                <li>Opt-out of marketing communication</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                7. Contact Us
              </h3>
              <p>
                📧 Email:{" "}
                <a
                  href="mailto:support@brawvly.com"
                  className="hover:text-blue-400 font-medium"
                >
                  support@brawvly.com
                </a>
              </p>
              <p>
               📞 Phone:{" "}
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

export default PrivacyPolicy;
