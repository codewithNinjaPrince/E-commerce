import React from "react";

const Legal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 pt-[90px]">
      <div className="max-w-4xl mx-auto space-y-6 bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 shadow-xl">

        <h1 className="text-3xl md:text-4xl font-bold">Legal & Compliance</h1>
        <p className="text-gray-300">
          This page outlines legal requirements, responsibilities, and platform
          compliance policies for every merchant.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Merchant Agreement</h2>
        <p className="text-gray-300">
          By selling on our platform, you agree to comply with all local, state,
          and national commerce regulations.
        </p>

        <h2 className="text-xl font-semibold mt-4">2. Prohibited Items</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-1">
          <li>Illegal or restricted products.</li>
          <li>Counterfeit items.</li>
          <li>Items violating IP or copyright laws.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">3. Document Verification</h2>
        <p className="text-gray-300">
          All KYC documents must be authentic and must belong to the merchant.
          Submitting forged documents may result in account termination.
        </p>

        <h2 className="text-xl font-semibold mt-4">4. Dispute Handling</h2>
        <p className="text-gray-300">
          For any legal disputes, the platform decision will be final as per
          agreed terms during merchant onboarding.
        </p>
      </div>
    </div>
  );
};

export default Legal;
