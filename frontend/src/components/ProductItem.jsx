import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ProductItem = ({
  _id,
  name,
  brandName,
  image,
  discountedPrice,
  actualPrice,
  review,
  noOfPeopleReviewed,
}) => {
  const { currency } = useContext(ShopContext);
  const navigate = useNavigate();

  // AUTO CALCULATED DISCOUNT
  const discountPercent =
    actualPrice && discountedPrice
      ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
      : 0;

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="cursor-pointer product-card group transition-all relative"
    >
      {/* IMAGE SECTION */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={Array.isArray(image) ? image[0] : image}
          alt={name}
          className="w-full h-52 object-cover img-hover rounded-xl"
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

        {/* RATING BOX */}
        <div className="absolute bottom-2 left-2 bg-black/90 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-md">
          <FaStar className="text-yellow-500" size={12} />
          <span className="text-sm font-semibold">{review}</span>
          <span className="text-white text-xs">[{noOfPeopleReviewed}]</span>
        </div>

        {/* DISCOUNT BADGE */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-[2px] rounded-md shadow-md">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="mt-2">
        {/* BRAND NAME */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {brandName}
        </p>

        {/* PRODUCT TITLE */}
        <p className="text-sm font-semibold leading-tight mt-1 line-clamp-2">
          {name}
        </p>

        {/* PRICE SECTION */}
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {/* ACTUAL PRICE (Cut) */}
          {actualPrice && (
            <span className="text-gray-500 line-through text-sm">
              {currency} {actualPrice}
            </span>
          )}

          {/* DISCOUNTED PRICE */}
          <span className="text-green-600 font-bold text-sm">
            {currency} {discountedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
