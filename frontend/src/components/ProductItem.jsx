import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FaShareAlt, FaHeart, FaShoppingCart } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import ProductItemSkeleton from "./ProductItemSkeleton";
import SizeSelectorModal from "./SizeSelectorModal";

const ProductItem = ({
  _id,
  name,
  brandName,
  image,
  discountedPrice,
  actualPrice,
  review,
  noOfPeopleReviewed,
  colors = [],
  sizes = [],
}) => {
  if (!_id || !name || !image) {
    return <ProductItemSkeleton />;
  }

  const {
    currency,
    favorites = [],
    addToFavorites,
    removeFromFavorites,
    token,
    addToCart,
    setBuyNowItem,
    buyNowItem,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const isFav = token && favorites.includes(_id);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const getSkeletonCount = () => {
    if (window.innerWidth < 640) return 10; // mobile
    return 15; // desktop
  };

  /* AUTO CALCULATED DISCOUNT */
  const discountPercent =
    actualPrice && discountedPrice
      ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
      : 0;

  const colorLabel =
    colors.length === 1 ? colors[0] : colors.length > 1 ? "Multicolor" : null;

  return (
    <>
      <div className="product-card group relative cursor-pointer transition-all">
        {/* IMAGE SECTION */}
        <div
          onClick={() => {
            navigate(`/product/${_id}`);
          }}
          className="relative w-full overflow-hidden rounded-xl bg-gray-100"
        >
          <img
            src={Array.isArray(image) ? image[0] : image}
            alt={name}
            className="w-full h-52 object-cover rounded-xl transition-transform group-hover:scale-105"
          />

          {/* SHARE BUTTON */}
          <button
            className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              const shareUrl = `${window.location.origin}/product/${_id}`;

              if (navigator.share) {
                navigator.share({ title: name, url: shareUrl });
              } else {
                navigator.clipboard.writeText(shareUrl);
                alert("Link copied!");
              }
            }}
          >
            <FaShareAlt size={14} />
          </button>

          {/* ❤️ FAVORITE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!token) {
                navigate("/login");
                return;
              }
              isFav ? removeFromFavorites(_id) : addToFavorites(_id);
            }}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-black/60 cursor-pointer"
          >
            <FaHeart
              size={15}
              className={isFav ? "text-red-600" : "text-white/80"}
            />
          </button>

          {/* RATING BOX */}
          <div className="absolute bottom-2 left-2 bg-black/90 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-md">
            <FaStar className="text-yellow-500" size={12} />
            <span className="text-sm font-semibold">{review}</span>
            <span className="text-white text-xs">({noOfPeopleReviewed})</span>
          </div>

          {/* DISCOUNT BADGE */}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-[2px] rounded-md shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div className="mt-2 flex flex-col h-full">
          {/* BRAND */}
          <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
            {brandName}
          </p>

          {/* NAME */}
          <p className="text-sm font-semibold leading-tight mt-1 line-clamp-2 min-h-[36px]">
            {name}
          </p>

          {/* PRICE */}
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            {actualPrice && (
              <span className="text-gray-500 line-through text-sm">
                {currency} {actualPrice}
              </span>
            )}
            <span className="text-green-600 font-bold text-sm">
              {currency} {discountedPrice}
            </span>
          </div>

          {/* COLORS */}
          {colorLabel && (
            <p className="text-xs text-gray-500 mt-1">
              Color: <span className="text-gray-700">{colorLabel}</span>
            </p>
          )}

          {/* ACTIONS */}
          <div className="mt-3 flex items-center gap-2">
            {/* CART ICON */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                if (!token) {
                  navigate("/login");
                  return;
                }

                // 🔥 always open size selector
                setActionType("add");
                setShowSizeModal(true);
              }}
              className="
    w-10 h-10
    flex items-center justify-center
    rounded-lg
    border border-black/10
    bg-white
    text-black
    transition-all duration-200
    hover:bg-black hover:text-white
    hover:scale-105
    active:scale-95
    cursor-pointer
  "
              title="Add to Cart"
            >
              <FaShoppingCart size={16} />
            </button>

            {/* BUY NOW */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!token) {
                  navigate("/login");
                  return;
                }
                setActionType("buy");
                setShowSizeModal(true);
              }}
              className="flex-1 bg-white text-black py-2 rounded-lg text-sm font-semibold hover:bg-black hover:text-white transition cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <SizeSelectorModal
        open={showSizeModal}
        sizes={sizes}
        onClose={() => {
          setShowSizeModal(false);
          setActionType(null);
        }}
        onConfirm={(selectedSize) => {
          // 🛒 ADD TO CART FLOW
          if (actionType === "add") {
            addToCart(_id, selectedSize);

            toast.success("Smile Added to cart 🛒", {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: true,
              theme: "dark",
            });

            setShowSizeModal(false);
            setActionType(null);
            return;
          }

          // 🚀 BUY NOW FLOW (NEW)
          if (actionType === "buy") {
            setBuyNowItem({
              productId: _id,
              size: selectedSize,
              quantity: 1,
            });

            setShowSizeModal(false);
            setActionType(null);

            navigate("/order-preview");

            toast.success("Great choice! Let’s checkout 🚀", {
              position: "top-center",
              autoClose: 1200,
              hideProgressBar: true,
              theme: "dark",
            });
          }
        }}
      />
    </>
  );
};

export default ProductItem;
