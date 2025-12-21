import React, { useEffect, useState, useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

export default function About() {
  const [loading, setLoading] = useState(true);

  const valuesRef = useRef(null);
  const policyRef = useRef(null);

  // Smooth Preloader Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  // Reveal Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-reveal");
        }),
      { threshold: 0.2 }
    );

    if (valuesRef.current) observer.observe(valuesRef.current);
    if (policyRef.current) observer.observe(policyRef.current);
  }, []);

  // Preloader Screen
  if (loading) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/95">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin" />
        <p className="text-white font-semibold opacity-80 text-sm text-center">
          Brawvly — Where India shops, stories connect...
        </p>
      </div>
    </div>
  );
}


  return (
<div className="w-full flex flex-col gap-16 text-gray-300 bg-black py-6">

      {/* Header */}
      <div className="text-center text-2xl text-white">
        <Title text1="About" text2="Brawvly" />
        <p className="text-gray-400 mt-4 text-sm md:text-base max-w-2xl mx-auto">
          The story of a local dream becoming a marketplace for every Indian heart.
        </p>
      </div>

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row gap-10 items-center max-w-6xl mx-auto px-6">
        <img
          className="w-full md:max-w-[480px] rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          src={assets.about_img}
          alt="About Brawvly"
        />

        <div className="flex flex-col gap-6 text-gray-300 leading-relaxed">
          <p>
            Brawvly was born from a simple idea — 
            <span className="text-white font-semibold">
              {" "}a marketplace that feels premium, personal, trustworthy, and proudly Indian.
            </span>
          </p>
          <p>
            We wanted to build a space where small businesses, homegrown brands,
            and creators can stand tall and shine — reaching customers from
            metros to small towns across India.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="font-bold text-xl mb-4 text-white">Our Story</h2>

          <p>
            Every great platform starts with a problem. Ours began when we saw how many 
            local shops were unable to go online — while customers struggled to find
            clean and trustworthy products.
          </p>

          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Premium, high-quality fashion for everyone</li>
            <li>A powerful digital stage for local sellers</li>
            <li>Fair pricing and trust-driven shopping</li>
          </ul>

          <p className="mt-4">
            And that’s how <span className="text-white font-semibold">Brawvly</span> took its first bold step.
          </p>
        </div>
      </section>

      {/* VOCAL FOR LOCAL */}
      <section className="max-w-6xl mx-auto px-6 bg-[#1a1a1a] p-10 rounded-2xl border border-white/10 shadow-lg flex flex-col md:flex-row items-center gap-10">
        <div className="flex flex-col gap-5 md:w-1/2">
          <h2 className="text-3xl font-bold text-white">
            Vocal for Local — Powered by You ❤️
          </h2>

          <p>
            At <b className="text-white">Brawvly</b>, every order supports a real Indian dream —
            small shopkeepers, creators, and families building their future.
          </p>

          <p>
            Together, we celebrate craftsmanship, empower communities,
            and bring the <span className="text-white font-semibold">true Made in India</span> spirit alive.
          </p>

          <p className="font-medium text-white">
            💛 Thank you for being part of this movement.
          </p>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src={assets.Vocal_for_Local}
            alt="Vocal for Local"
            className="w-full max-w-[400px] rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          />
        </div>
      </section>

      {/* MADE IN INDIA */}
      <section className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-center bg-[#1a1a1a] p-10 rounded-2xl border border-white/10 shadow-lg">
        <img
          src={assets.Make_In_India}
          alt="Make in India"
          className="w-full md:max-w-[350px] rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        />

        <div className="flex flex-col gap-4 text-gray-300 md:w-2/3">
          <h2 className="text-xl font-bold text-white">
            Made in India. Built for India.
          </h2>

          <p>
            We proudly support Indian sellers — from young entrepreneurs
            to local shopkeepers and designers.
          </p>

          <p>
            Supporting Made in India is not just business — it’s emotional, cultural,
            and a step toward empowering communities.
          </p>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section
        ref={valuesRef}
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6"
      >
        {[
          { title: "Premium Quality", desc: "Every product is verified and meets strict quality standards." },
          { title: "Easy & Smart Shopping", desc: "Simple checkout, fast search, and a clean experience." },
          { title: "Friendly Support", desc: "Real humans who care — not bots or scripts." },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl 
                     transition-transform duration-500 hover:scale-[1.05] hover:shadow-xl"
          >
            <h3 className="font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* POLICY SECTION */}
      <section
        ref={policyRef}
        className="max-w-6xl mx-auto px-6 bg-[#1a1a1a] p-10 rounded-2xl border border-white/10 shadow-xl"
      >
        <h2 className="text-xl font-bold text-white mb-4">Transparency You Can Trust</h2>

        <p className="text-gray-300 mb-4">
          Explore our policies to shop with confidence. Everything is clear, fair,
          and created to give you a safe & smooth experience.
        </p>

        <div className="flex flex-col gap-3 text-base">
          {[
            { label: "🔒 Privacy Policy", link: "/privacy-policy" },
            { label: "🚚 Shipping & Delivery Policy", link: "/shipping-delivery" },
            { label: "🔁 Refund & Return Policy", link: "/refund-return" },
            { label: "📜 Terms & Conditions", link: "/terms-conditions" },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="text-gray-400 hover:text-white transition-all duration-300 ease-in-out 
                         hover:translate-x-2 hover:font-semibold"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <NewsLetter />
    </div>
  );
}

