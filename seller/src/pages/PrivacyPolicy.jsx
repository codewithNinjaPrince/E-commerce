import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 pt-[90px]">
      <div className="max-w-4xl mx-auto space-y-6 bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 shadow-xl">

        <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-gray-300">
          This Privacy Policy describes how we collect, use, store, and protect your
          information when you use our merchant services.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-1">
          <li>Personal details such as name, phone, and email.</li>
          <li>KYC documents required for identity verification.</li>
          <li>Store and business details.</li>
          <li>Banking information for settlements.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
        <p className="text-gray-300">
          We use your information for identity verification, payment settlements,
          account security, fraud prevention, and improving our platform experience.
        </p>

        <h2 className="text-xl font-semibold mt-4">3. Data Protection</h2>
        <p className="text-gray-300">
          Your data is stored securely on encrypted servers, and we never share your
          details with third parties except as required by law.
        </p>

        <h2 className="text-xl font-semibold mt-4">4. Your Rights</h2>
        <p className="text-gray-300">
          You may request access, update, or deletion of your data anytime by
          contacting support.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
