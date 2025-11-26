import React from "react";
import Title from "../components/Title";

const PrivacyPolicy = () => {
  return (
    <div
      className="
+       px-4 md:px-20 py-10
        bg-black/90
        border-t border-white/10
        border-b border-white/20
        shadow-[0_0_25px_rgba(255,255,255,0.05)]
      "
    >
      {/* CENTERED INNER WRAPPER */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-2xl mb-8 text-center text-white">
          <Title text1={"Privacy &"} text2={"Policy"} />
          <p className="w-11/12 md:w-3/4 mx-auto text-gray-300 text-sm md:text-base mt-3">
            Your privacy matters to us. This page explains how Brawvly collects, uses, and safeguards your information while offering a seamless and trustworthy shopping experience.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-10 text-white text-sm md:text-base leading-7">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect personal details such as name, email, phone number, and delivery address when you interact with our platform. We may also collect device data, cookies, browsing behavior, and location information to enhance your experience.
            </p>
            <p className="text-gray-300 mt-2">
              For sellers, we may collect shop details, GST/business documents, and bank information for secure payouts.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>To create and manage your user or seller account</li>
              <li>To process orders, payments, returns, and refunds</li>
              <li>To enhance site performance and personalization</li>
              <li>To send updates, offers, or newsletters (only with consent)</li>
              <li>To prevent fraud, unauthorized access, or misuse</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Protect Your Data</h2>
            <p className="text-gray-300">
              Brawvly uses modern security measures like HTTPS encryption, secure payments, firewalls, and access control. While we prioritize safety, no system is 100% risk-free.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Sharing Your Information</h2>
            <p className="text-gray-300">We never sell your information. We only share it with:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-1">
              <li>Sellers for order fulfillment</li>
              <li>Delivery partners</li>
              <li>Payment gateways</li>
              <li>Technical/Analytics service providers</li>
              <li>Authorities when legally required</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Cookies & Tracking</h2>
            <p className="text-gray-300">
              Cookies help us optimize your experience. You may disable them, but some features may not function properly if cookies are turned off.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-gray-300">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Access or update your personal data</li>
              <li>Delete your account or request data removal</li>
              <li>Opt-out of marketing emails</li>
              <li>Withdraw cookie consent</li>
            </ul>
            <p className="mt-2 text-gray-300">
              For requests, contact us at: <span className="font-medium text-white">dixitprince895@gmail.com</span>.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Return & Refund Policy</h2>
            <p className="text-gray-300">
              Customers may request a return within <span className="font-semibold text-white">7 days</span> of delivery. Items must be unused and in original condition. Refunds are processed within 3–7 business days after approval.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Policy Updates</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. Continued use of Brawvly indicates acceptance of the updated terms.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
            <p className="text-gray-300">
              For any questions about our privacy practices:
            </p>
            <p className="text-gray-300 mt-2">
              📧 Email: <span className="font-medium text-white">dixitprince895@gmail.com</span>
            </p>
            <p className="text-gray-300">
              📞 Phone: <span className="font-medium text-white">+91-87368-52549</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
