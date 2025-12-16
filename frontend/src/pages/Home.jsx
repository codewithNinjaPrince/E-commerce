import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <main>

      {/* SEO H1 (VERY IMPORTANT) */}
      <h1 className="sr-only">
        Brawvly – Your Local Market Online
      </h1>

      <Hero />

      {/* SEO SECTION */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          Shop from Trusted Local Sellers
        </h2>
        <p className="text-gray-400 mt-2">
          Brawvly connects you with nearby sellers for fashion, electronics,
          daily essentials and more – all at one place.
        </p>
      </section>

      <LatestCollection />
      <BestSeller />

      {/* SEO CATEGORIES */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Popular Categories</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          <li>Fashion</li>
          <li>Electronics</li>
          <li>Footwear</li>
          <li>Watches</li>
          <li>Accessories</li>
          <li>Local Essentials</li>
        </ul>
      </section>

      <OurPolicy />
      <NewsLetter />
    </main>
  );
};


export default Home
