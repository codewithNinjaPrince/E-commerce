import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";
import { useLayoutEffect } from "react";

const Home = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {/* ================= SEO CONTEXT ================= */}
      {/* 🔒 Hidden H1 – does NOT affect UI */}
      <h1 className="sr-only">
        Brawvly – Buy Fashion, Electronics & Local Products Online in India
      </h1>

      {/* ================= MAIN CONTENT ================= */}
      <main role="main">
        {/* HERO */}
        <section aria-label="Brawvly marketplace hero section">
          <Hero />
        </section>

        {/* LATEST COLLECTION */}
        <section aria-labelledby="latest-collection-heading">
          <h2 id="latest-collection-heading" className="sr-only">
            Latest Products from Local Sellers
          </h2>
          <LatestCollection />
        </section>

        {/* BEST SELLERS */}
        <section aria-labelledby="best-seller-heading">
          <h2 id="best-seller-heading" className="sr-only">
            Best Selling Products on Brawvly
          </h2>
          <BestSeller />
        </section>

        {/* POLICIES */}
        <section aria-labelledby="policy-heading">
          <h2 id="policy-heading" className="sr-only">
            Why Shop on Brawvly
          </h2>
          <OurPolicy />
        </section>

        {/* NEWSLETTER */}
        <section aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className="sr-only">
            Subscribe for Offers and Updates
          </h2>
          <NewsLetter />
        </section>
      </main>
    </>
  );
};

export default Home;
