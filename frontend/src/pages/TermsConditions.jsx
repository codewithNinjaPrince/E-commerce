import React from "react";
import Title from "../components/Title";
import { useLayoutEffect } from "react";


const TermsConditions = () => {
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
            <Title text1="Terms &" text2="Conditions" />
          </div>

      <div className="max-w-7xl mx-auto space-y-8 text-sm md:text-base leading-7 text-gray-200">

        <p>
          Welcome to <span className="font-semibold text-white">Brawvly</span> ("we", "our", "us").  
          By accessing or using our website and services, you agree to comply with and be bound by the 
          following Terms & Conditions. Please read them carefully before using our platform.
        </p>

        {/* Section 1 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            1. Platform Overview
          </h3>
          <p>
            Brawvly is an online marketplace connecting customers with local sellers 
            offering fashion, apparel, and lifestyle products. We act as a facilitator 
            and are not the manufacturer or direct seller of most listed items.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            2. User Eligibility
          </h3>
          <p>
            By using this website, you confirm that you are at least 18 years old or 
            using the platform under supervision of a legal guardian. You agree to 
            provide accurate and complete account details.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            3. User Responsibilities
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users must provide true and accurate personal information.</li>
            <li>Users must not misuse the platform for illegal activities.</li>
            <li>Any attempt to harm the website, its data, or its users is strictly prohibited.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            4. Orders & Cancellation
          </h3>
          <p>
            Once an order is placed, it can only be cancelled if it has not been 
            dispatched. Brawvly reserves the right to cancel any order due to 
            stock unavailability, pricing errors, or suspicious activity.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            5. Pricing & Payments
          </h3>
          <p>
            All prices are in INR unless stated otherwise. Payments must be made 
            through our authorized payment gateways. Brawvly is not responsible 
            for third-party payment failures.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            6. Shipping & Delivery
          </h3>
          <p>
            Shipping timelines may vary depending on your location and seller. 
            Delivery delays caused by logistics partners, natural disasters, or 
            government restrictions are beyond our control.
          </p>
        </div>

        {/* Section 7 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            7. Returns & Refunds
          </h3>
          <p>
            Our refund and return policies are detailed separately on the Refund & 
            Return page. By using our services, you agree to those terms.
          </p>
        </div>

        {/* Section 8 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            8. Intellectual Property Rights
          </h3>
          <p>
            All content on Brawvly including logos, images, graphics, and text 
            belongs to Brawvly or its partners and is protected under Indian 
            copyright and trademark laws.
          </p>
        </div>

        {/* Section 9 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            9. Limitation of Liability
          </h3>
          <p>
            Brawvly will not be liable for indirect or incidental damages arising 
            from the use or inability to use our platform or services.
          </p>
        </div>

        {/* Section 10 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            10. Account Suspension
          </h3>
          <p>
            We reserve the right to suspend or terminate accounts involved in fraud, 
            misuse, illegal activities, or violation of our policies.
          </p>
        </div>

        {/* Section 11 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            11. Governing Law
          </h3>
          <p>
            These terms shall be governed and interpreted under the laws of India. 
            Any disputes shall be subject to the jurisdiction of courts in Uttar Pradesh, India.
          </p>
        </div>

        {/* Section 12 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            12. Updates to Terms
          </h3>
          <p>
            We may update these Terms & Conditions at any time without prior notice. 
            Continued use of our website implies acceptance of updated terms.
          </p>
        </div>

        {/* Contact */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                13. Contact Us
              </h3>
              <p className="text-gray-300">
                For any questions regarding these terms, you may contact us at:
              </p>
              <p className="mt-3 text-gray-200">
                📧 Email:{" "}
                <a
                  href="mailto:support@brawvly.com"
                  className="hover:text-blue-400 font-medium"
                >
                  support@brawvly.com
                </a>
                <br />
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

export default TermsConditions;
