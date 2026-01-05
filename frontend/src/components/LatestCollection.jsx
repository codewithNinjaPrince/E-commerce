import React, { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  const [visibleCount, setVisibleCount] = useState(15);
  const [latestProducts, setLatestProducts] = useState([]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const scrollRef = useRef(null);

  /* 🌐 ONLINE / OFFLINE */
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  /* 🆕 LATEST PRODUCTS FILTER */
  useEffect(() => {
    if (!products || products.length === 0) {
      setLatestProducts([]);
      return;
    }

    const sorted = [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setLatestProducts(sorted);
  }, [products]);

  const skeletonCount = window.innerWidth < 640 ? 8 : 15;
  const showSkeleton =
    !isOnline || (products.length === 0 && latestProducts.length === 0);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  const handleHide = () => {
    setVisibleCount(15);
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <section>
      <div className="bg-black/90 border border-white/10 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.06)] mt-4 mb-4 sm:mt-6 sm:mb-6 lg:mt-8 lg:mb-8">
        <div className="w-full sm:px-2 md:px-3 lg:px-4">
          {/* HEADER */}
          <div className="text-center text-white py-4 sm:py-6 md:py-8">
            {showSkeleton ? (
              <>
                <div className="h-8 w-40 bg-gray-700/40 rounded mx-auto mb-4 animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-700/30 rounded mx-auto mb-2 animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-700/30 rounded mx-auto animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl">
                  <Title text1="Latest" text2="Collection" />
                </div>
                <p className="mt-3 w-full sm:w-4/5 md:w-3/4 mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-gray-400">
                  Our latest collection brings together handpicked products from
                  hardworking local shop owners in your neighbourhood. 🏪🤝 Each
                  item reflects their effort, quality, and trust. ✨🧵 When you
                  shop here, you enjoy fresh arrivals and great prices while
                  supporting real families behind the stores. 🆕💰👨‍👩‍👧‍👦 Browse the
                  newest additions and make every purchase meaningful. 🛍️❤️
                </p>
              </>
            )}
          </div>
          {/* SEO CONTEXT (SCREEN-READER ONLY) */}
          {!showSkeleton && latestProducts.length > 0 && (
            <p className="sr-only">
              Browse the latest collection on Brawvly, featuring newly added
              fashion, electronics, and lifestyle products from trusted Indian
              merchants. Discover fresh arrivals, trending items, and new deals
              added regularly to support local businesses across India.
            </p>
          )}

          {/* SCROLL TARGET */}
          <div ref={scrollRef}></div>

          {/* PRODUCTS GRID */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {/* 🦴 SKELETON UI */}

            {showSkeleton
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <ProductItemSkeleton key={i} />
                ))
              : latestProducts.slice(0, visibleCount).map((item) => (
                  <div key={item._id} className="bg-[#2a2a2a] rounded-xl p-2">
                    <ProductItem {...item} />
                  </div>
                ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="text-center mt-8 sm:mt-10 pb-2 sm:pb-4 md:pb-6 flex justify-center gap-4">
            {visibleCount < latestProducts.length && (
              <button
                onClick={handleShowMore}
                className="
                  text-white
                  border border-white/30
                  px-6 py-2
                  rounded-lg
                  hover:bg-white hover:text-black
                  transition
                  cursor-pointer
                "
              >
                Show More
              </button>
            )}

            {visibleCount > 15 && (
              <button
                onClick={handleHide}
                className="
                  text-red-400
                  border border-red-400
                  px-6 py-2
                  rounded-lg
                  hover:bg-red-400 hover:text-black
                  transition cursor-pointer
                "
              >
                Hide
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
