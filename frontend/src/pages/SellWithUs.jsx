import React, { useState } from "react";

const SellWithUs = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const handleRegister = () => {
    window.location.href = "https://e-commerce-merchant-two.vercel.app/";
  };

  const faqs = [
    {
      q: "Who can sell on Brawvly?",
      a: "Any individual, small business, or brand can sell on Brawvly. You don’t need a registered company to start.",
    },
    {
      q: "Is there any registration fee?",
      a: "No. Creating a merchant account on Brawvly is completely free.",
    },
    {
      q: "How do payments work?",
      a: "Payments are securely processed and settled directly to the merchant’s bank account.",
    },
    {
      q: "Do I manage my own delivery?",
      a: "Yes. Merchants have full control over delivery, pricing, and order fulfillment.",
    },
    {
      q: "Is KYC mandatory?",
      a: "Yes. KYC helps us keep the platform secure and trustworthy for everyone.",
    },
  ];

  return (
    <>
      {/* ================= SEO ================= */}
      <title>Sell on Brawvly | Become a Merchant & Grow Online</title>
      <meta
        name="description"
        content="Sell your products online with Brawvly. Register as a merchant, manage products, orders, and grow your business independently."
      />
      <meta
        name="keywords"
        content="sell online, become a merchant, seller registration, brawvly merchant, online marketplace india"
      />
      <meta property="og:title" content="Sell on Brawvly" />
      <meta
        property="og:description"
        content="Join Brawvly as a merchant and grow your business with full control."
      />
      <section className="pt-20 sm:pt-22 lg:pt-26 pb-16 px-2 sm:px-4 md:px-6">
        <div
          className="
      max-w-9xl mx-auto
      bg-black/90
      border border-white/10
      rounded-2xl
      shadow-[0_0_40px_rgba(255,255,255,0.06)]
      overflow-hidden
    "
        >
          <div className="px-4 sm:px-6 md:px-10 py-12">
            {/* HERO */}
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Sell Online with Brawvly 🚀
              </h1>
              <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg">
                Brawvly helps independent merchants sell online without losing
                control. You manage your store, products, and delivery — we
                power the platform.
              </p>

              <button
                onClick={handleRegister}
                className="mt-10 bg-white text-black px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition cursor-pointer"
              >
                Register as a Merchant
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Free registration • No upfront cost
              </p>
            </div>

            {/* FEATURES */}
            <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Full Control 🧠",
                  desc: "You control pricing, inventory, and fulfillment.",
                },
                {
                  title: "Grow Independently 📈",
                  desc: "Build your brand without dependency on discounts.",
                },
                {
                  title: "Merchant Dashboard 🛠️",
                  desc: "Manage orders, products, payments & KYC easily.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl text-center"
                >
                  <h3 className="text-2xl text-white font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* HOW IT WORKS */}
            <div className="max-w-5xl mx-auto mt-20 text-center">
              <h2 className="text-3xl font-semibold text-white mb-12">
                How It Works 🔄
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  "Register",
                  "Complete KYC",
                  "Add Products",
                  "Start Selling",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl"
                  >
                    <div className="text-3xl font-bold text-white mb-2">
                      {i + 1}
                    </div>
                    <p className="text-gray-400">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ SECTION */}
            <div className="max-w-4xl mx-auto mt-20">
              <h2 className="text-3xl font-semibold text-white text-center mb-10">
                Frequently Asked Questions ❓
              </h2>

              <div className="flex flex-col gap-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1a1a] border border-white/10 rounded-xl"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-5 py-4 flex justify-between items-center"
                    >
                      <span className="text-white font-medium">{faq.q}</span>
                      <span className="text-gray-400">
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>

                    {openFaq === i && (
                      <div className="px-5 pb-5 text-gray-400 text-sm">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FINAL CTA */}
            <div className="max-w-5xl mx-auto mt-20 p-8 sm:p-10 md:p-12 rounded-2xl">
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border border-white/10 p-12 rounded-2xl text-center">
                <h3 className="text-3xl font-semibold text-white mb-4">
                  Start Selling on Brawvly Today 💼
                </h3>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join a platform built for merchants, not middlemen.
                </p>

                <button
                  onClick={handleRegister}
                  className="bg-white text-black px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition cursor-pointer"
                >
                  Create Merchant Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SellWithUs;
