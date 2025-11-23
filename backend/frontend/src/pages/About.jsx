import React, { useEffect, useState, useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

// New, premium, emotional, Made-in-India inspired About Page
export default function About() {
  const [loading, setLoading] = useState(true);

  const valuesRef = useRef(null);
  const policyRef = useRef(null);

  // Custom Preloader Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (valuesRef.current) observer.observe(valuesRef.current);
    if (policyRef.current) observer.observe(policyRef.current);
  }, []);

  // Preloader Screen
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 rounded-full border-4 border-[#C8A165] border-t-transparent animate-spin mb-6"></div>
        <p className="text-gray-700 font-semibold animate-pulse">
          Brawvly-Where India shops, stories connect...
        </p>
      </div>
    );
  }

  return (
    <div className="cursor-pointer w-full flex flex-col gap-16">
      {/* Header */}
      <div className="text-2xl text-center pt-10 border-t">
        <Title text1="About" text2="Brawvly" />
        <p className="text-gray-600 mt-4 text-sm md:text-base max-w-2xl mx-auto">
          The story of a local dream becoming a marketplace for every Indian
          heart.
        </p>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <img
          className="w-full md:max-w-[480px] rounded-2xl shadow-md"
          src={assets.about_img}
          alt="About Brawvly"
        />
        <div className="flex flex-col gap-6 md:w-2/3 text-gray-700 leading-relaxed">
          <p>
            Brawvly was born from a very simple idea — *what if we build
            something that feels personal, trustworthy, premium, and yet deeply
            rooted in the everyday life of Indian shoppers?* Not another generic
            marketplace… but a platform that feels like home.
          </p>
          <p>
            We wanted to create a space where local sellers, small businesses,
            craftspeople, and new-age brands could stand proudly next to each
            other — reaching customers from metro cities to the smallest towns.
            A platform made in India, for India, with love, passion, and a
            little bit of that “desi jugaad”.
          </p>
        </div>
      </div>

      {/* Core Story Section */}
      <div className="flex flex-col gap-10 text-gray-700 leading-relaxed">
        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
          <h2 className="font-bold text-xl mb-4 text-gray-900">Our Story</h2>
          <p>
            Every great platform starts with a problem. Ours started when we
            noticed how many local shops were unable to go online, and how many
            people still struggled to find trustworthy, clean, well-curated
            products. So we decided to build a bridge — an online marketplace
            where:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Shoppers get premium, high-quality fashion and accessories.</li>
            <li>Local sellers and small brands get a stage to shine.</li>
            <li>
              Every Indian, no matter where they live, gets access to great
              products.
            </li>
          </ul>
          <p className="mt-4">
            And that’s how *Brawvly* took its first step — bold, confident, and
            full of heart.
          </p>
        </div>

        {/* Vocal for Local Section */}
        {/* Vocal for Local Section */}
        <div className="my-20 bg-white px-6 py-12 rounded-2xl shadow-md border flex flex-col md:flex-row items-center gap-12">
          {/* Left Text Section */}
          <div className="flex flex-col gap-5 md:w-1/2 text-gray-700">
            <h2 className="text-3xl font-bold text-gray-900">
              Vocal for Local — Powered by You ❤️
            </h2>

            <p className="leading-relaxed">
              At <b>Brawvly</b>, we proudly champion India's heart — the small
              shopkeepers, homegrown creators, and everyday entrepreneurs who
              make our streets vibrant and our markets meaningful. Each purchase
              you make here isn't just a transaction… it's support for a dream,
              a family, a livelihood.
            </p>

            <p className="leading-relaxed">
              Your choice to shop local fuels progress, strengthens communities,
              and brings true <b>Made in India</b> spirit alive. Together, we
              celebrate Indian craftsmanship, empower local sellers, and build a
              marketplace that feels personal, honest, and rooted in trust.
            </p>

            <p className="leading-relaxed font-medium text-gray-900">
              💛 Thank you for being a part of this movement — one order at a
              time.
            </p>
          </div>

          {/* Right Image Section */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={assets.Vocal_for_Local}
              alt="Vocal for Local"
              className="w-full max-w-[400px] rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Made in India Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center bg-white p-8 rounded-2xl shadow-sm border">
          <img
            src={assets.Make_In_India}
            alt="Make in India"
            className="w-full md:max-w-[350px] rounded-2xl shadow"
          />
          <div className="flex flex-col gap-4 text-gray-700 md:w-2/3">
            <h2 className="text-xl font-bold text-gray-900">
              Made in India. Built for India.
            </h2>
            <p>
              We strongly believe in the power of Indian creativity. From young
              entrepreneurs to local shopkeepers, from trendy fashion designers
              to homegrown accessory makers — Brawvly is a stage for all.
            </p>
            <p>
              Supporting Indian sellers is not just a business choice — it’s an
              emotional one. It means lifting our communities, empowering
              families, and celebrating the incredible talent our country has.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        <div
          className="border p-8 rounded-2xl shadow-sm 
                  transition-transform duration-500 ease-in-out 
                  hover:scale-[1.05] hover:shadow-lg"
        >
          <h3 className="font-bold text-gray-900 mb-2">Premium Quality</h3>
          <p className="text-gray-600">
            Every product is checked, verified, and listed only after meeting
            our quality standards.
          </p>
        </div>

        <div
          className="border p-8 rounded-2xl shadow-sm 
                  transition-transform duration-500 ease-in-out 
                  hover:scale-[1.05] hover:shadow-lg"
        >
          <h3 className="font-bold text-gray-900 mb-2">
            Easy & Smart Shopping
          </h3>
          <p className="text-gray-600">
            Clean UI, simple checkout, quick search — shopping should feel
            effortless and joyful.
          </p>
        </div>

        <div
          className="border p-8 rounded-2xl shadow-sm 
                  transition-transform duration-500 ease-in-out 
                  hover:scale-[1.05] hover:shadow-lg"
        >
          <h3 className="font-bold text-gray-900 mb-2">Friendly Support</h3>
          <p className="text-gray-600">
            Our support team is always here — not robots, not complicated chats,
            just real humans who genuinely care.
          </p>
        </div>
      </div>

      {/* Policy Pages Mention */}
      <div
        className="bg-gray-50 p-10 rounded-2xl shadow-sm flex flex-col gap-4 
                text-gray-700 mt-10
                transition-all duration-500 ease-in-out
                hover:shadow-lg hover:scale-[1.01]"
      >
        <h2 className="text-xl font-bold text-gray-900">
          Transparency You Can Trust
        </h2>

        <p>
          For transparency, trust, and a smooth shopping experience, you can
          explore our policy pages below. These ensure clarity and confidence in
          every purchase you make with Brawvly. We keep everything clear — from
          orders to returns. You can read about our policies anytime:
        </p>

        <div className="flex flex-col gap-3 text-base">
          <a
            href="/privacy-policy"
            className="transition-all duration-400 ease-in-out 
                 hover:translate-x-2 hover:text-blue-800 
                 hover:font-semibold"
          >
            🔒 Privacy Policy
          </a>

          <a
            href="/shipping-delivery"
            className="transition-all duration-400 ease-in-out 
                 hover:translate-x-2 hover:text-blue-800 
                 hover:font-semibold"
          >
            🚚 Shipping & Delivery Policy
          </a>

          <a
            href="/refund-return"
            className="transition-all duration-400 ease-in-out 
                 hover:translate-x-2 hover:text-blue-800 
                 hover:font-semibold"
          >
            🔁 Refund & Return Policy
          </a>

          <a
            href="/terms-conditions"
            className="transition-all duration-400 ease-in-out 
                 hover:translate-x-2 hover:text-blue-800 
                 hover:font-semibold"
          >
            📜 Terms & Conditions
          </a>
        </div>
      </div>

      <NewsLetter />
    </div>
  );
}
