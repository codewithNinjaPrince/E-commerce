import React, { useEffect, useState, useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";
import { useLayoutEffect } from "react";

const AboutSkeleton = () => (
  <div className="animate-pulse space-y-10 px-4 py-8">
    {/* Title */}
    <div className="text-center space-y-3">
      <div className="h-8 w-48 bg-gray-700/40 mx-auto rounded" />
      <div className="h-4 w-2/3 bg-gray-700/30 mx-auto rounded" />
    </div>

    {/* Hero */}
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-[420px] h-64 bg-gray-700/40 rounded-2xl" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-700/40 w-full rounded" />
        <div className="h-4 bg-gray-700/30 w-5/6 rounded" />
        <div className="h-4 bg-gray-700/30 w-4/6 rounded" />
      </div>
    </div>

    {/* Cards */}
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 bg-gray-700/30 rounded-xl" />
      ))}
    </div>
  </div>
);

export default function About() {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const valuesRef = useRef(null);
  const policyRef = useRef(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const totalImages = 3; // about_img, Vocal_for_Local, Make_In_India
  const loadedCount = useRef(0);

  const handleImageLoad = () => {
    loadedCount.current += 1;
    if (loadedCount.current >= totalImages) {
      setImagesLoaded(true);
    }
  };

  // Reveal Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("animate-reveal");
        }),
      { threshold: 0.2 }
    );

    valuesRef.current && observer.observe(valuesRef.current);
    policyRef.current && observer.observe(policyRef.current);
  }, []);

  return (
    <section className="px-2 sm:px-6 lg:px-10">
      <h1 className="sr-only">
        About Brawvly – India’s Local Online Marketplace
      </h1>
      {!imagesLoaded && <AboutSkeleton />}
      <div className={imagesLoaded ? "block" : "invisible absolute inset-0"}>
        ) : (
        <div
          className="
          bg-black/90
          border border-white/10
          rounded-xl
          overflow-hidden
          shadow-[0_0_40px_rgba(255,255,255,0.06)]

          mt-20 mb-4
          sm:mt-23 sm:mb-6
          lg:mt-26 lg:mb-8
        "
        >
          <div className="w-full sm:px-2 md:px-3 lg:px-4">
            {/* Header */}
            <div className="text-center text-white py-4 sm:py-6 md:py-8">
              <div className="text-2xl sm:text-3xl md:text-4xl">
                <Title text1="About" text2="Brawvly" />
              </div>
              <p className="text-gray-400 mt-4 text-sm md:text-base max-w-2xl mx-auto">
                The story of a local dream becoming a marketplace for every
                Indian heart.
              </p>
            </div>

            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row gap-8 items-center px-2 sm:px-4">
              <img
                src={assets.about_img}
                alt="About Brawvly – Indian online marketplace for local sellers"
                onLoad={handleImageLoad}
                className="w-full md:max-w-[420px] rounded-2xl shadow-lg"
              />

              <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                <p>
                  Brawvly was born from a simple idea —
                  <span className="text-white font-semibold">
                    {" "}
                    a marketplace that feels premium, personal, trustworthy, and
                    proudly Indian.
                  </span>
                </p>
                <p>
                  Founded in India, <strong>Brawvly</strong> serves customers
                  across the country by bringing local stores online and making
                  shopping simple, fast, and reliable.
                </p>
                <p>
                  We wanted to build a space where small businesses, homegrown
                  brands, and creators can stand tall and shine — reaching
                  customers from metros to small towns across India.
                </p>
                <p className="text-gray-300 text-sm sm:text-base max-w-4xl mx-auto mt-4">
                  <strong>Brawvly</strong> is an Indian online marketplace that
                  connects customers with local merchants selling fashion,
                  electronics, and daily-use products. Brawvly focuses on
                  quality, trust, and empowering small Indian businesses through
                  technology.
                </p>
              </div>
            </div>
          </div>

          {/* OUR STORY */}
          <div className="mt-10 bg-[#1a1a1a] border border-white/10 rounded-xl p-6 sm:p-8 mx-2 sm:mx-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-6 text-center md:text-left">
                Our Story
              </h2>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                {/* LEFT CONTENT */}
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    Every great platform starts with a problem. Ours began when
                    we saw how many local shops were unable to go online — while
                    customers struggled to find clean and trustworthy products.
                  </p>

                  <p>
                    And that’s how{" "}
                    <span className="text-white font-semibold">Brawvly</span>{" "}
                    took its first bold step.
                  </p>
                </div>

                {/* RIGHT CONTENT */}
                <div>
                  <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base">
                    <li>Premium, high-quality fashion for everyone</li>
                    <li>A powerful digital stage for local sellers</li>
                    <li>Fair pricing and trust-driven shopping</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* VOCAL FOR LOCAL */}
          <div className="mt-10 flex flex-col md:flex-row gap-8 items-center bg-[#1a1a1a] border border-white/10 rounded-xl p-6 sm:p-8 mx-2 sm:mx-4">
            <div className="space-y-4 md:w-1/2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Vocal for Local — Powered by You ❤️
              </h2>

              <p>
                At <b className="text-white">Brawvly</b>, every order supports a
                real Indian dream — small shopkeepers, creators, and families
                building their future.
              </p>

              <p>
                Together, we celebrate craftsmanship, empower communities, and
                bring the{" "}
                <span className="text-white font-semibold">
                  true Made in India
                </span>{" "}
                spirit alive.
              </p>

              <p className="font-medium text-white">
                💛 Thank you for being part of this movement.
              </p>
            </div>

            <a
              href="https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1697022&reg=3&lang=2"
              target="_blank"
              rel="noopener noreferrer"
              className="md:w-1/2 flex justify-center"
            >
              <img
                src={assets.Vocal_for_Local}
                alt="Vocal for Local"
                onLoad={handleImageLoad}
                className="w-full max-w-[360px] rounded-2xl shadow-lg hover:scale-[1.03] transition"
              />
            </a>
          </div>

          {/* MADE IN INDIA */}
          <div className="mt-10 flex flex-col md:flex-row gap-8 items-center bg-[#1a1a1a] border border-white/10 rounded-xl p-6 sm:p-8 mx-2 sm:mx-4">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <a
                href="https://www.pmindia.gov.in/en/major_initiatives/make-in-india/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group w-full md:max-w-[340px] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.08)] cursor-pointer"
              >
                {/* IMAGE */}
                <img
                  src={assets.Make_In_India}
                  alt="Make in India"
                  onLoad={handleImageLoad}
                  className="w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* OVERLAY */}
                <div
                  className="
      absolute inset-0
      bg-black/60
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-300
      flex items-center justify-center
    "
                >
                  <span
                    className="
        bg-white text-black
        px-5 py-2
        rounded-full
        text-sm font-semibold
        shadow-lg
        hover:scale-105
        transition
      "
                  >
                    Read More →
                  </span>
                </div>
              </a>

              <div className="flex flex-col gap-4 text-gray-300 md:w-2/3">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Made in India. Built for India.
                </h2>

                <p>
                  We proudly support Indian sellers — from young entrepreneurs
                  to local shopkeepers and designers.
                </p>

                <p>
                  Supporting Made in India is not just business — it’s
                  emotional, cultural, and a step toward empowering communities.
                </p>
              </div>
            </div>
          </div>

          {/* VALUES SECTION */}
          <div className="mt-10 flex flex-col md:flex-row gap-8 items-center bg-[#1a1a1a] border border-white/10 rounded-xl p-6 sm:p-8 mx-2 sm:mx-4 cursor-pointer">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Shop premium product on Brawvly",
                  desc: "Every product is verified and meets strict quality standards.",
                  link: "/collections",
                },
                {
                  title: "Easy & Smart Shopping",
                  desc: "Simple checkout, fast search, and a clean experience.",
                  link: "/collections",
                },
                {
                  title: "Friendly Support",
                  desc: "Real humans who care — not bots or scripts.",
                  link: "/contact",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="bg-black/40 border border-white/10 p-6 rounded-xl 
        transition hover:scale-[1.04] hover:shadow-xl cursor-pointer"
                >
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>

          {/* POLICY SECTION */}
          <div
            className="mt-10 bg-[#1a1a1a] border border-white/10 rounded-xl 
                p-6 sm:p-8 mx-2 sm:mx-4 "
          >
            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Transparency You Can Trust
            </h2>

            <p className="text-gray-400 mb-8 max-w-3xl">
              Explore our policies to shop with confidence. Everything is clear,
              fair, and created to give you a safe & smooth experience.
            </p>

            {/* Policy Links */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "🔒 Privacy Policy", link: "/privacy-policy" },
                {
                  label: "🚚 Shipping & Delivery Policy",
                  link: "/shipping-delivery",
                },
                { label: "🔁 Refund & Return Policy", link: "/refund-return" },
                { label: "📜 Terms & Conditions", link: "/terms-conditions" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="
          cursor-pointer
          flex items-center justify-between
          bg-black/40
          border border-white/10
          px-5 py-4
          rounded-xl
          text-gray-300
          transition-all duration-300
          hover:bg-white/10
          hover:text-white
          hover:border-white/30
          hover:translate-x-1
          hover:shadow-lg
        "
                >
                  <span>{item.label}</span>
                  <span className="opacity-60">›</span>
                </a>
              ))}
            </div>
          </div>

          <NewsLetter />
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Brawvly — India’s Local Online Marketplace
      </p>
    </section>
  );
}
