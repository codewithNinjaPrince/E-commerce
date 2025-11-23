import React from "react";

const RefundReturnPolicy = () => {
  return (
    <div className="my-10 px-4 sm:px-10">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Refund & Return Policy
      </h1>

      <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-7">

        <p>
          Thank you for shopping with <span className="font-semibold text-black">Brawvly</span>.  
          We aim to provide you the best quality products and a smooth shopping experience.  
          If something doesn’t go as expected, our easy **7-day return policy** ensures you’re covered.
        </p>

        <h2 className="text-xl font-semibold text-black">1. Eligibility for Returns</h2>
        <ul className="list-disc ml-6">
          <li>You can return products within <span className="font-semibold">7 days</span> of delivery.</li>
          <li>The item must be unused, unworn, and in its original condition.</li>
          <li>All tags, labels, and packaging must be intact.</li>
          <li>Products that appear used or damaged will not be accepted.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black">2. Non-Returnable Items</h2>
        <p>The following items cannot be returned:</p>
        <ul className="list-disc ml-6">
          <li>Innerwear, hygiene-related items</li>
          <li>Gift cards or discounted offers (if clearly mentioned)</li>
          <li>Products damaged after delivery due to misuse</li>
        </ul>

        <h2 className="text-xl font-semibold text-black">3. Refund Process</h2>
        <p>Once your return is approved:</p>
        <ul className="list-disc ml-6">
          <li>Refunds are processed within <span className="font-semibold">5–7 working days</span>.</li>
          <li>Refund method: original payment method or wallet credit.</li>
          <li>You will receive a confirmation email once refund is issued.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black">4. Exchange Policy</h2>
        <p>
          We currently support exchanges only for size issues (if the product is available).
        </p>

        <h2 className="text-xl font-semibold text-black">5. Wrong or Damaged Product</h2>
        <p>
          If you received a damaged, defective, or wrong product, report it within  
          <span className="font-semibold"> 48 hours</span> with pictures. We will arrange a replacement or refund.
        </p>

        <h2 className="text-xl font-semibold text-black">6. Contact for Returns</h2>
        <p>
          Email: <span className="font-semibold">dixitprince895@gmail.com</span>  
        </p>
      </div>
    </div>
  );
};

export default RefundReturnPolicy;
