import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto pt-[50px] pb-16">

        {/* PAGE TITLE */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center 
           bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          Terms & Conditions
        </h1>

        <p className="text-center text-gray-400 mt-2 text-sm sm:text-base">
          Last Updated: January 2025
        </p>

        {/* MAIN CARD */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl p-6 sm:p-8 mt-10 space-y-8 leading-relaxed">

          {/* SECTION */}
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Definitions</h2>
            <p className="text-gray-300">
              <b>Merchant / You:</b> A registered seller using the Brawvly Merchant Platform. <br />
              <b>Customer:</b> The end-user purchasing listed products. <br />
              <b>Platform:</b> The merchant system operated by Brawvly for store and order management.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Merchant Obligations</h2>
            <p className="text-gray-300">
              Merchants must ensure accurate profile details, legal product listings, proper packaging, 
              and full compliance with GST, consumer rights, and e-commerce rules. Misleading or counterfeit 
              items are strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. KYC Verification</h2>
            <p className="text-gray-300">
              KYC completion is mandatory for accessing full features. Any fraudulent or mismatched documentation 
              may lead to account suspension or legal actions. Additional documents may be requested anytime.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Product Listing Rules</h2>
            <p className="text-gray-300">
              Merchants must ensure correct descriptions, authentic images, and legally permissible products. 
              Restricted, harmful, adult, or counterfeit goods are not allowed. The platform may remove or reject 
              products violating these rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Shipping & Delivery Policy</h2>
            <p className="text-gray-300">
              Merchants must dispatch orders on time using proper packaging.  
              Incorrect tracking, delayed shipments, or repeated issues may result in penalties or order limits.  
              If platform-managed logistics is used, pickup guidelines must be followed strictly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Return & Refund Policy</h2>
            <p className="text-gray-300">
              Legitimate customer returns (wrong, damaged, defective, or misdescribed items) must be honored.  
              Refunds are processed after the merchant approves returned items.  
              Fraudulent return claims will be reviewed and handled separately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Cancellation Policy</h2>
            <p className="text-gray-300">
              Customers may cancel orders before dispatch confirmation.  
              Orders delayed by merchants may auto-cancel. Multiple delays may lead to temporary restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Payments & Settlements</h2>
            <p className="text-gray-300">
              Payments are processed weekly to the verified bank account.  
              Settlements may pause if fraud, disputes, or KYC issues occur.  
              Chargebacks may occur if the merchant is found at fault in disputes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Privacy Policy</h2>
            <p className="text-gray-300">
              Merchant information is used for identity verification, payments, fraud prevention, and platform 
              improvement.  
              Data is never sold or misused. Merchants may request data deletion via support channels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">10. Prohibited Activities</h2>
            <p className="text-gray-300">
              Merchants must not sell illegal goods, misuse customer data, create fake orders, manipulate reviews,  
              hack the platform, or submit fake KYC. Violations result in permanent account action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">11. Intellectual Property</h2>
            <p className="text-gray-300">
              All platform assets—logos, designs, backend systems—belong to Brawvly.  
              Merchants may not copy, modify, or redistribute system components.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">12. Legal Responsibility</h2>
            <p className="text-gray-300">
              Merchants are fully responsible for legal compliance, GST filings, quality issues, shipping,  
              packaging, and customer complaints.  
              The platform is not responsible for disputes caused by merchant negligence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">13. Dispute Resolution</h2>
            <p className="text-gray-300">
              Unresolved disputes will fall under the jurisdiction of the Courts of Uttar Pradesh, India.  
              Platform decisions related to fraud or policy violations are final.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">14. Suspension & Termination</h2>
            <p className="text-gray-300">
              Accounts may be restricted or terminated for repeated customer issues, fraud, KYC failure,  
              or policy violations. Payouts may be held during investigations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">15. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By using the platform and checking the “I Agree” box, you confirm that you understand and 
              accept all the policies listed above.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
