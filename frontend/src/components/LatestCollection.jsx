import React, { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  const [visibleCount, setVisibleCount] = useState(15);
  const [latestProducts, setLatestProducts] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products);
    }
  }, [products]);

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
    <section className="section-top-gap">
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-black/90">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center text-white text-3xl py-8">
            <Title text1="Latest" text2="Collection" />
            <p className="w-3/4 mx-auto text-xs sm:text-base text-gray-400">
              Our latest collection brings together handpicked products from
              hardworking local shop owners in your neighbourhood. Each item
              reflects their effort, quality, and trust. When you shop here, you
              enjoy fresh arrivals and great prices while supporting real
              families behind the stores. Browse the newest additions and make
              every purchase meaningful.
            </p>
          </div>

          {/* SCROLL TARGET */}
          <div ref={scrollRef}></div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {latestProducts.slice(0, visibleCount).map((item) => (
              <div key={item._id} className="bg-[#2a2a2a] rounded-xl p-2">
                <ProductItem
                  _id={item._id}
                  name={item.name}
                  brandName={item.brandName}
                  image={item.image}
                  actualPrice={item.actualPrice}
                  discountedPrice={item.discountedPrice}
                  review={item.review}
                  noOfPeopleReviewed={item.noOfPeopleReviewed}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-10 flex justify-center gap-4">
            {visibleCount < latestProducts.length && (
              <button
                onClick={handleShowMore}
                className="text-white border border-white/30 px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
              >
                Show More
              </button>
            )}

            {visibleCount > 15 && (
              <button
                onClick={handleHide}
                className="text-red-400 border border-red-400 px-6 py-2 rounded-lg hover:bg-red-400 hover:text-black transition"
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
