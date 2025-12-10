import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 pt-[90px]">
      <div className="max-w-4xl mx-auto space-y-6 bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 shadow-xl">

        <h1 className="text-3xl md:text-4xl font-bold">Refund & Return Policy</h1>
        <p className="text-gray-300">
          This policy explains return eligibility, refund process, and merchant obligations.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Return Eligibility</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-1">
          <li>Damaged or defective items.</li>
          <li>Incorrect product delivered.</li>
          <li>Products not matching the listing description.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">2. Merchant Responsibilities</h2>
        <p className="text-gray-300">
          Merchants must verify return claims fairly and process refunds within
          the policy timeline.
        </p>

        <h2 className="text-xl font-semibold mt-4">3. Refund Timeline</h2>
        <p className="text-gray-300">
          Refunds are normally processed within 5–7 business days after approval.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
