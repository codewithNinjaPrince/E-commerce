import React from "react";
import Title from "../components/Title";

const PrivacyPolicy = () => {
  return (
    <div className="my-10">
      {/* Header */}
      <div className="text-center py-8">
        <Title text1={"Privacy"} text2={"Policy"} />
        <p className="w-3/4 m-auto text-gray-600 text-sm md:text-base">
          Your privacy matters to us. This page explains how Brawvly collects, uses, and safeguards your information while offering a seamless, trustworthy shopping experience.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-11/12 md:w-3/4 m-auto text-gray-700 leading-7 text-sm md:text-base space-y-8">

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">1. Information We Collect</h2>
          <p>
            We collect personal details such as your name, email, phone number, and delivery address when you interact with our platform. Additionally, device details, cookies, browsing behavior, and location information may be automatically collected to improve user experience.
          </p>
          <p>
            For local sellers, we may collect shop details, GST or business documents, and bank information to facilitate secure payouts and marketplace operations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>To create and manage your user or seller account</li>
            <li>To process orders, payments, returns, and refunds</li>
            <li>To improve website performance and personalization</li>
            <li>To communicate updates, offers, and newsletters (only with your consent)</li>
            <li>To prevent fraud, misuse, and unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">3. How We Protect Your Data</h2>
          <p>
            Brawvly uses modern security practices including encrypted connections (HTTPS), secure payment processing, firewalls, and access control to safeguard your data. Although we take strong precautions, no online system is fully immune from risks, and absolute security cannot be guaranteed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">4. Sharing Your Information</h2>
          <p>
            We do not sell your personal information. We only share it with trusted entities such as:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Local sellers (for order & delivery purposes)</li>
            <li>Delivery partners</li>
            <li>Secure payment gateways</li>
            <li>Analytics, hosting, and technical service providers</li>
            <li>Authorities, only when legally required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">5. Cookies & Tracking</h2>
          <p>
            Cookies help us improve your shopping experience by saving preferences, optimizing performance, and personalizing recommendations. You may disable cookies through your browser, though certain features may not function properly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Access or update your personal data</li>
            <li>Delete your account or request data removal</li>
            <li>Opt-out of marketing and newsletters</li>
            <li>Withdraw cookie consent</li>
          </ul>
          <p className="mt-2">
            To request any of the above, contact us at: <span className="text-black font-medium">dixitprince895@gmail.com</span>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">7. Return & Refund Policy</h2>
          <p>
            Customers can request a return within <span className="font-semibold">7 days</span> of delivery. Items must be unused, unwashed, and in original condition. Sellers may reject returns that show signs of wear or misuse. Refunds are processed within 3–7 business days after approval.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">8. Policy Updates</h2>
          <p>
            This Privacy Policy may be updated occasionally to reflect changes in laws or platform features. Continued use of Brawvly means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-black">9. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, feel free to reach out:
          </p>
          <p>Email: <span className="font-medium text-black">dixitprince895@gmail.com</span></p>
          <p>Phone: <span className="font-medium text-black">+91-87368-52549</span></p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
