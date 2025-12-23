import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { toast } from "react-toastify";

const RelatedProducts = ({ category, subCategory }) => {
  const { products, addToCart } = useContext(ShopContext);

  const [related, setRelated] = useState([]);
  const [visible, setVisible] = useState(5);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(
        (p) => p.category === category && p.subCategory === subCategory
      );
      setRelated(filtered);
    }
  }, [products, category, subCategory]);

  const handleShowMore = () => setVisible((prev) => prev + 5);
  const handleHide = () => setVisible(5);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    setLoadingId(item._id);

    setTimeout(() => {
      addToCart(item._id, item.sizes?.[0]); // default first size
      setLoadingId(null);

      // ⭐ TOAST FROM TOP
      toast.success("Item added to cart!", {
        position: "top-center",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
        style: {
          marginTop: "20px",
          borderRadius: "10px",
        },
      });
    }, 900);
  };

  return (
    <div className="my-10 sm:my-12 lg:my-20">
      <div className="text-center text-3xl py-2 text-white">
        <Title text1="Related" text2="Products" />
      </div>

      {/* GRID */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {related.slice(0, visible).map((item) => {
          const discount =
            ((item.actualPrice - item.discountedPrice) / item.actualPrice) * 100;

          return (
            <Link
              to={`/product/${item._id}`}
              key={item._id}
              className="
                bg-[#1c1c1c] border border-white/10 p-3 rounded-xl 
                hover:scale-[1.03] hover:shadow-xl hover:border-white/20 
                transition cursor-pointer relative
              "
            >
              {/* CARD */}
              <ProductItem {...item} />

              {/* DISCOUNT */}
              <p className="text-red-400 font-semibold mt-2 text-sm">
                {Math.round(discount)}% OFF
              </p>

              {/* ADD BUTTON */}
              <button
                onClick={(e) => handleAddToCart(e, item)}
                className="
                  w-full mt-3 py-2 rounded-lg bg-white text-black font-semibold 
                  hover:bg-gray-300 transition cursor-pointer flex justify-center items-center
                "
              >
                {loadingId === item._id ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </Link>
          );
        })}
      </div>

      {/* BUTTONS */}
      <div className="flex justify-center gap-4 mt-10">
        {visible < related.length && (
          <button
            onClick={handleShowMore}
            className="
              text-white border border-white/30 px-6 py-2 rounded-lg 
              hover:bg-white hover:text-black cursor-pointer transition
            "
          >
            Show More
          </button>
        )}

        {visible > 5 && (
          <button
            onClick={handleHide}
            className="
              text-red-400 border border-red-400 px-6 py-2 rounded-lg 
              hover:bg-red-400 hover:text-black cursor-pointer transition
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


