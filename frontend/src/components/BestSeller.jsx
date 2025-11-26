import React, { useState, useEffect, useContext, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const [visibleCount, setVisibleCount] = useState(10);
  const [bestSeller, setBestSeller] = useState([]);

  // Scroll reference (scrolls just above the grid)
  const scrollRef = useRef(null);

  // Load bestseller products
  useEffect(() => {
    const bestProducts = products.filter((item) => item.bestseller);
    setBestSeller(bestProducts);
  }, [products]);

  // Load next 10
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Hide to initial (10) and scroll to top of grid
  const handleHide = () => {
    setVisibleCount(10);

    setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <div className="my-0">
      {/* FULL WIDTH DARK SECTION */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-black/90 shadow-[0_0_40px_rgba(255,255,255,0.04)] py-16">
        {/* CENTERED CONTENT */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* TITLE */}
          <div className="text-center text-white text-3xl py-8">
            <Title text1="Best" text2="Seller" />
            <p className="w-3/4 mx-auto text-xs sm:text-base text-gray-400">
              Top-selling essentials and trending favourites curated from
              trusted local shops.
            </p>
          </div>

          {/* 🔥 SCROLL TARGET (just above product grid) */}
          <div ref={scrollRef}></div>

          {/* PRODUCT GRID */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {bestSeller.slice(0, visibleCount).map((item) => {
              const discount = item.actualPrice
                ? Math.round(
                    ((item.actualPrice - item.discountedPrice) /
                      item.actualPrice) *
                      100
                  )
                : null;

              return (
                <div
                  key={item._id}
                  className="
                    bg-[#2a2a2a] 
                    rounded-xl 
                    shadow-md 
                    hover:shadow-xl 
                    transition 
                    border 
                    border-white/10 
                    p-2
                  "
                >
                  <ProductItem
                    _id={item._id}
                    name={item.name}
                    brandName={item.brandName}
                    image={item.image?.[0]}
                    actualPrice={item.actualPrice}
                    discountedPrice={item.discountedPrice}
                    discount={discount}
                    review={item.review}
                    noOfPeopleReviewed={item.noOfPeopleReviewed}
                  />
                </div>
              );
            })}
          </div>

          {/* SHOW MORE & HIDE BUTTONS */}
          <div className="text-center mt-10 flex justify-center gap-4">
            {visibleCount < bestSeller.length && (
              <button
                onClick={handleShowMore}
                className="
                  text-white 
                  border 
                  border-white/30 
                  px-6 
                  py-2 
                  rounded-lg 
                  hover:bg-white 
                  hover:text-black 
                  transition 
                  cursor-pointer 
                  font-medium
                "
              >
                Show More
              </button>
            )}

            {visibleCount > 10 && (
              <button
                onClick={handleHide}
                className="
                  text-red-400 
                  border 
                  border-red-400 
                  px-6 
                  py-2 
                  rounded-lg 
                  hover:bg-red-400 
                  hover:text-black 
                  transition 
                  cursor-pointer 
                  font-medium
                "
              >
                Hide
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
