import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";

const RelatedProducts = ({ category, subCategory, excludeId }) => {
  const { products } = useContext(ShopContext);

  const [related, setRelated] = useState([]);
  const [visible, setVisible] = useState(4);
  const [defaultVisible, setDefaultVisible] = useState(4);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  /* 🌐 Online / Offline handling */
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

  /* 🔄 Build related products */
  useEffect(() => {
    if (!products?.length) return;

    const filtered = products.filter(
      (p) =>
        p._id !== excludeId &&
        p.category === category &&
        p.subCategory === subCategory
    );

    setRelated(filtered);
  }, [products, category, subCategory]);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) {
        setVisible(4);
        setDefaultVisible(4);
      } else if (window.innerWidth < 1024) {
        setVisible(6);
        setDefaultVisible(6);
      } else {
        setVisible(5);
        setDefaultVisible(5);
      }
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  /* 🦴 Skeleton condition */
  const showSkeleton = !isOnline || !products?.length;

  useEffect(() => {
  setVisible(defaultVisible);
}, [defaultVisible, category, subCategory]);


  // 🚫 No related products → don't render section
  if (!showSkeleton && related.length === 0) {
    return (
      <div className="my-10 text-center text-gray-500 text-sm">
        Explore more products in this category soon ✨
      </div>
    );
  }

  return (
    <div className="my-10 sm:my-12 lg:my-20">
      {/* TITLE */}
      <div className="text-center text-3xl py-2 text-white">
        <Title text1="Related" text2="Products" />
      </div>

      {/* GRID */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {showSkeleton
          ? Array.from({ length: defaultVisible }).map((_, i) => (
              <ProductItemSkeleton key={i} />
            ))
          : related.slice(0, visible).map((item) => (
              <div key={item._id} className="bg-[#2a2a2a] rounded-lg p-2">
                <ProductItem
                  _id={item._id}
                  name={item.name}
                  brandName={item.brandName}
                  image={item.image}
                  actualPrice={item.actualPrice}
                  discountedPrice={item.discountedPrice}
                  review={item.review}
                  noOfPeopleReviewed={item.noOfPeopleReviewed}
                  colors={item.colors}
                  sizes={item.sizes}
                />
              </div>
            ))}
      </div>

      {/* ACTION BUTTONS */}
      {!showSkeleton && (
        <div className="flex justify-center gap-4 mt-10">
          {visible < related.length && (
            <button
              onClick={() => setVisible((v) => v + defaultVisible)}
              className="text-white border border-white/30 px-6 py-2 rounded-lg hover:bg-white hover:text-black transition cursor-pointer"
            >
              Show More
            </button>
          )}

          {visible > defaultVisible && (
            <button
              onClick={() => setVisible(defaultVisible)}
              className="text-red-400 border border-red-400 px-6 py-2 rounded-lg hover:bg-red-400 hover:text-black transition cursor-pointer"
            >
              Hide
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
