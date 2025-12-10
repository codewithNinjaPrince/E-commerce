import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 pt-[90px]">
      <div className="max-w-4xl mx-auto space-y-6 bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 shadow-xl">

        <h1 className="text-3xl md:text-4xl font-bold">Shipping & Delivery Policy</h1>
        <p className="text-gray-300">
          This policy outlines how shipping, pickup, and delivery operations work
          for merchants on our platform.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Merchant Responsibilities</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-1">
          <li>Ensure the product is packed safely for delivery.</li>
          <li>Dispatch orders within the promised time.</li>
          <li>Provide correct weight and dimensions of products.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">2. Delivery Timelines</h2>
        <p className="text-gray-300">
          Delivery times may vary based on the customer's location, courier partner
          availability, and operational conditions.
        </p>

        <h2 className="text-xl font-semibold mt-4">3. Failed Deliveries</h2>
        <p className="text-gray-300">
          If a delivery fails due to an incorrect address or buyer unavailability,
          the product may be returned to the merchant and additional charges may apply.
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
