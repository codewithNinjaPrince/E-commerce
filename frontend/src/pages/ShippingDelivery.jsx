import React from "react";

const ShippingDelivery = () => {
  return (
    <div className="my-10 px-4 sm:px-10">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Shipping & Delivery
      </h1>

      <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-7">

        <p>
          At <span className="font-semibold text-black">Brawvly</span>, we work with trusted delivery
          partners to ensure your orders reach you safely and on time.  
          Here’s everything you need to know about our shipping process.
        </p>

        <h2 className="text-xl font-semibold text-black">1. Delivery Time</h2>
        <ul className="list-disc ml-6">
          <li>
            Standard delivery time: <span className="font-semibold">3–7 business days</span>.
          </li>
          <li>
            Remote or rural areas may take slightly longer depending on courier availability.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-black">2. Shipping Charges</h2>
        <ul className="list-disc ml-6">
          <li>Free delivery on orders above a certain value (if applicable).</li>
          <li>Standard shipping fee shown at checkout for smaller orders.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black">3. Order Tracking</h2>
        <p>
          Once your order is shipped, you will receive an email/SMS with a tracking link.  
          You can check real-time delivery updates anytime.
        </p>

        <h2 className="text-xl font-semibold text-black">4. Delivery Attempts</h2>
        <p>
          If you miss the delivery, our courier partner will make <span className="font-semibold">2 more attempts</span>.
        </p>

        <h2 className="text-xl font-semibold text-black">5. Delays</h2>
        <p>
          In rare cases such as festivals, weather conditions, or logistics issues, delivery may take longer.  
          We will always keep you informed.
        </p>

        <h2 className="text-xl font-semibold text-black">6. Incorrect Address</h2>
        <p>
          If the provided address is incorrect or unreachable, your order may be returned to us.  
          Additional charges may apply for reshipping.
        </p>

        <h2 className="text-xl font-semibold text-black">7. Contact for Delivery Issues</h2>
        <p>
          Email: <span className="font-semibold">dixitprince895@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default ShippingDelivery;
