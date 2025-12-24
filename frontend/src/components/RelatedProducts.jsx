import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);

  const [related, setRelated] = useState([]);
  const [visible, setVisible] = useState(5);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(
        (p) => p.category === category && p.subCategory === subCategory
      );
      setRelated(filtered);
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-10 sm:my-12 lg:my-20">
      {/* TITLE */}
      <div className="text-center text-3xl py-2 text-white">
        <Title text1="Related" text2="Products" />
      </div>

      {/* GRID */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {related.slice(0, visible).map((item) => (
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
                />
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center gap-4 mt-10">
        {visible < related.length && (
          <button
            onClick={() => setVisible((v) => v + 5)}
            className="
              text-white border border-white/30 px-6 py-2 rounded-lg 
              hover:bg-white hover:text-black transition
            "
          >
            Show More
          </button>
        )}

        {visible > 5 && (
          <button
            onClick={() => setVisible(5)}
            className="
              text-red-400 border border-red-400 px-6 py-2 rounded-lg 
              hover:bg-red-400 hover:text-black transition
            "
          >
            Hide
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
