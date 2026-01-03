import React, { useLayoutEffect, useContext } from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";
import { ShopContext } from "../context/ShopContext";

/* ================= HOME SKELETON ================= */
const HomeSkeleton = () => {
  return (
    <main role="main" className="animate-pulse">
      {/* HERO SKELETON */}
      <section className="h-[55vh] bg-white/5 rounded-2xl mb-10" />

      {/* SECTION BLOCK */}
      {[1, 2].map((_, i) => (
        <section key={i} className="mb-14">
          <div className="h-6 w-48 bg-white/10 rounded mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/5 p-3 space-y-3"
              >
                <div className="h-40 bg-white/10 rounded-lg" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* POLICY STRIP */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-white/5"
          />
        ))}
      </section>

      {/* NEWSLETTER */}
      <section className="h-36 bg-white/5 rounded-2xl mb-10" />
    </main>
  );
};

const Home = () => {
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const { products } = useContext(ShopContext);

  if (!products || products.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <>
      {/* ================= SEO CONTEXT ================= */}
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
