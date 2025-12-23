import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FaShareAlt, FaHeart,FaShoppingCart } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";


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
}) => {
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

  /* AUTO CALCULATED DISCOUNT */
  const discountPercent =
    actualPrice && discountedPrice
      ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
      : 0;

  const colorLabel =
    colors.length === 1 ? colors[0] : colors.length > 1 ? "Multicolor" : null;

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="product-card group relative cursor-pointer transition-all"
    >
      {/* IMAGE SECTION */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
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

    addToCart(_id, "M");

    // ✅ TOAST
    toast.success("Added to cart 🛒", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      theme: "dark",
    });
  }} className="
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

    // ✅ ensure item is in cart
    const defaultSize = "M"; 

    setBuyNowItem({
      productId: _id,
      name,
      image,
      price: discountedPrice,
      actualPrice,
      quantity: 1,
      size: defaultSize, // or selected size
    });

    // ✅ navigate AFTER adding
    navigate("/placeorder?mode=buynow");
  }}
      className="
        flex-1
        bg-white text-black
        py-2
        rounded-lg
        text-sm font-semibold
        transition-all duration-200
        hover:bg-black hover:text-white
        hover:scale-[1.02]
        active:scale-95
        cursor-pointer
      "
    >
      Buy Now
    </button>
  </div>
</div>

    </div>
  );
};

export default ProductItem;

// import React, { useContext } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { useNavigate } from "react-router-dom";
// import { FaShareAlt } from "react-icons/fa";
// import { FaStar } from "react-icons/fa6";
// import { Link } from "react-router-dom";

// const ProductItem = ({
//   _id,
//   name,
//   brandName,
//   image,
//   discountedPrice,
//   actualPrice,
//   review,
//   noOfPeopleReviewed,
// }) => {
//   const { currency } = useContext(ShopContext);
//   const navigate = useNavigate();

//   // AUTO CALCULATED DISCOUNT
//   const discountPercent =
//     actualPrice && discountedPrice
//       ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
//       : 0;

//   return (
//     <div
//       onClick={() => navigate(`/product/${_id}`)}
//       className="cursor-pointer product-card group transition-all relative"
//     >
//       {/* IMAGE SECTION */}
//       <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
//         <img
//           src={Array.isArray(image) ? image[0] : image}
//           alt={name}
//           className="w-full h-52 object-cover img-hover rounded-xl"
//         />

//         {/* SHARE BUTTON */}
//         <button
//           className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition cursor-pointer"
//           onClick={(e) => {
//             e.stopPropagation();
//             const shareUrl = `${window.location.origin}/product/${_id}`;

//             if (navigator.share) {
//               navigator.share({ title: name, url: shareUrl });
//             } else {
//               navigator.clipboard.writeText(shareUrl);
//               alert("Link copied!");
//             }
//           }}
//         >
//           <FaShareAlt size={14} />
//         </button>

//         {/* RATING BOX */}
//         <div className="absolute bottom-2 left-2 bg-black/90 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-md">
//           <FaStar className="text-yellow-500" size={12} />
//           <span className="text-sm font-semibold">{review}</span>
//           <span className="text-white text-xs">[{noOfPeopleReviewed}]</span>
//         </div>

//         {/* DISCOUNT BADGE */}
//         {discountPercent > 0 && (
//           <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-[2px] rounded-md shadow-md">
//             -{discountPercent}%
//           </span>
//         )}
//       </div>

//       {/* DETAILS */}
//       <div className="mt-2">
//         {/* BRAND NAME */}
//         <p className="text-xs text-gray-500 uppercase tracking-wide">
//           {brandName}
//         </p>

//         {/* PRODUCT TITLE */}
//         <p className="text-sm font-semibold leading-tight mt-1 line-clamp-2">
//           {name}
//         </p>

//         {/* PRICE SECTION */}
//         <div className="mt-1 flex items-center gap-2 flex-wrap">
//           {/* ACTUAL PRICE (Cut) */}
//           {actualPrice && (
//             <span className="text-gray-500 line-through text-sm">
//               {currency} {actualPrice}
//             </span>
//           )}

//           {/* DISCOUNTED PRICE */}
//           <span className="text-green-600 font-bold text-sm">
//             {currency} {discountedPrice}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductItem;
