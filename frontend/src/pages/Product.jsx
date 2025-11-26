// import React, { useEffect, useContext, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import RelatedProducts from "../components/RelatedProducts";
// import { toast } from "react-toastify";

// const Product = () => {
//   const navigate = useNavigate();
//   const { productId } = useParams();
//   const { products, currency, addToCart } = useContext(ShopContext);

//   const [productData, setProductData] = useState(null);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");
//   const [showFullView, setShowFullView] = useState(false);
//   const [adding, setAdding] = useState(false);

//   // -------- Fetch Product --------
//   useEffect(() => {
//     const foundProduct = products.find((item) => item._id === productId);
//     if (foundProduct) {
//       setProductData(foundProduct);
//       setImage(foundProduct.image[0]);
//     }
//   }, [productId, products]);

//   if (!productData) return <div className="opacity-0"></div>;

//   // -------- Add To Cart Loader + Toast --------
//   const handleAddToCart = () => {
//     if (!size) {
//       return toast.error("Please select a size!", {
//         position: "top-center",
//         theme: "dark",
//       });
//     }

//     setAdding(true);

//     setTimeout(() => {
//       addToCart(productData._id, size);
//       setAdding(false);

//       toast.success("Added to Cart");
//     }, 900);
//   };

//   return (
//     <div className="border-t-2 pt-10">

//       {/* ==================== MOBILE BACK BUTTON ==================== */}
//       <button
//         onClick={() => navigate(-1)}
//         className="sm:hidden mb-5 ml-3 text-white px-4 py-2 rounded-lg border border-white/20
//         bg-black/40 backdrop-blur-sm active:scale-95"
//       >
//         ← Back
//       </button>

//       {/* MAIN GRID */}
//       <div className="flex flex-col sm:flex-row gap-10">

//         {/* ============ LEFT IMAGES ============ */}
//         <div className="flex-1 flex flex-col-reverse sm:flex-row gap-4">
//           {/* Thumbnails */}
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-3 sm:w-[22%] w-full cursor-pointer">
//             {productData.image.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 onClick={() => setImage(img)}
//                 className={`rounded-xl border object-cover transition
//                   ${
//                     image === img ? "border-white scale-105" : "border-gray-300"
//                   }
//                   w-[23%] sm:w-full h-24 sm:h-auto
//                 `}
//                 alt="Thumbnail"
//               />
//             ))}
//           </div>

//           {/* MAIN IMAGE */}
//           <div className="relative sm:w-[78%] w-full">
//             <button
//               onClick={() => setShowFullView(true)}
//               className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded text-xm cursor-pointer hover:bg-black/90 transition"
//             >
//               Zoom 🔍
//             </button>

//             <img
//               src={image}
//               className="
//                 w-full
//                 h-auto
//                 max-h-[750px]
//                 rounded-xl
//                 object-contain
//                 bg-white
//                 cursor-pointer
//               "
//               onClick={() => setShowFullView(true)}
//             />
//           </div>
//         </div>

//         {/* ============ RIGHT SECTION ============ */}
//         <div className="flex-1 pr-3 text-white cursor-pointer relative">

//           {/* ==================== DESKTOP BACK BUTTON (TOP RIGHT) ==================== */}
//           <button
//             onClick={() => navigate(-1)}
//             className="
//               hidden sm:block
//               absolute -top-4 right-0
//               text-white px-4 py-2 rounded-lg
//               border border-white/20
//               bg-black/40 backdrop-blur-sm
//               hover:bg-white/60
//               hover:text-black/60
//               transition active:scale-95
//               cursor-pointer
//             "
//           >
//             ← Back
//           </button>

//           {/* BRAND */}
//           <p className="text-gray-500 uppercase text-sm tracking-wide mt-6 sm:mt-0">
//             {productData.brandName}
//           </p>

//           {/* NAME */}
//           <h1 className="font-semibold text-3xl mt-1">{productData.name}</h1>

//           {/* RATING */}
//           <div className="flex items-center gap-1 mt-3 cursor-pointer">
//             {Array(5)
//               .fill(0)
//               .map((_, i) => (
//                 <img
//                   key={i}
//                   src={
//                     i < productData.review
//                       ? assets.star_icon
//                       : assets.star_dull_icon
//                   }
//                   className="w-4"
//                   alt="rating"
//                 />
//               ))}
//             <p className="pl-2 text-sm text-gray-400">
//               ({productData.noOfPeopleReviewed})
//             </p>
//           </div>

//           {/* PRICE SECTION */}
//           <div className="flex items-center gap-4 mt-5">
//             <p className="text-3xl font-bold text-green-500">
//               {currency} {productData.discountedPrice}
//             </p>

//             <p className="line-through text-gray-400 text-xl">
//               {currency} {productData.actualPrice}
//             </p>

//             <p className="text-red-500 font-semibold text-lg">
//               {Math.round(
//                 ((productData.actualPrice - productData.discountedPrice) /
//                   productData.actualPrice) *
//                   100
//               )}
//               % OFF
//             </p>
//           </div>

//           {/* DESCRIPTION */}
//           <p className="text-gray-400 mt-5 leading-relaxed">
//             {productData.description}
//           </p>

//           {/* SIZE SELECTOR */}
//           <div className="my-8">
//             <p className="font-medium mb-4">Select Size</p>

//             <div className="flex gap-2 flex-wrap">
//               {productData.sizes.map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => setSize(item)}
//                   className={`py-2 px-5 text-black rounded-md border transition cursor-pointer hover:text-white/30 hover:bg-black/30
//                     ${
//                       size === item
//                         ? "bg-white text-black"
//                         : "bg-gray-100 text-black border-gray-300"
//                     }
//                   `}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ADD TO CART BUTTON */}
//           <button
//             onClick={handleAddToCart}
//             className="bg-white text-black px-10 py-3 rounded-lg border cursor-pointer hover:text-white hover:bg-black/30 transition active:scale-95 flex items-center justify-center gap-2"
//           >
//             {adding ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
//                 Adding...
//               </>
//             ) : (
//               "ADD TO CART"
//             )}
//           </button>

//           {adding && (
//             <p className="text-gray-400 mt-3 text-sm animate-pulse">
//               Adding this masterpiece to your cart… Hold tight 😎
//             </p>
//           )}

//           {/* EXTRA INFO */}
//           <div className="text-sm text-gray-500 mt-10">
//             <p>✔ 100% Original Product</p>
//             <p>✔ Cash on Delivery Available</p>
//             <p>✔ Easy 7-Day Return & Exchange</p>
//           </div>
//         </div>
//       </div>

//       {/* DESCRIPTION SECTION */}
//       <div className="mt-20 text-white">
//         <div className="flex border-b">
//           <b className="border px-6 py-3 text-sm cursor-pointer">Description</b>
//           <p className="border px-6 py-3 text-sm cursor-pointer">
//             Reviews ({productData.noOfPeopleReviewed})
//           </p>
//         </div>

//         <div className="border px-6 py-6 text-sm text-gray-400 cursor-pointer">
//           {productData.description}
//         </div>
//       </div>

//       {/* RELATED PRODUCTS */}
//       <RelatedProducts
//         category={productData.category}
//         subCategory={productData.subCategory}
//       />

//       {/* FULL SCREEN VIEWER */}
//       {showFullView && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
//           <div
//             className="bg-black rounded-2xl shadow-2xl p-6 relative flex flex-col items-center"
//             style={{ width: "70vw", height: "70vh" }}
//           >
//             <button
//               onClick={() => setShowFullView(false)}
//               className="absolute top-4 right-4 text-white text-2xl cursor-pointer hover:text-red-400"
//             >
//               ✖
//             </button>

//             <img
//               src={image}
//               className="w-full h-[80%] object-contain rounded-xl"
//               alt="full"
//             />

//             <div className="flex gap-3 overflow-x-auto w-full mt-4">
//               {productData.image.map((img, i) => (
//                 <img
//                   key={i}
//                   src={img}
//                   onClick={() => setImage(img)}
//                   className="w-20 h-20 rounded-xl border cursor-pointer object-cover hover:scale-105 transition"
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default Product;
// import React, { useEffect, useContext, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import RelatedProducts from "../components/RelatedProducts";
// import { toast } from "react-toastify";

// const Product = () => {
//   const navigate = useNavigate();
//   const { productId } = useParams();
//   const { products, currency, addToCart } = useContext(ShopContext);

//   const [productData, setProductData] = useState(null);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");
//   const [showFullView, setShowFullView] = useState(false);
//   const [adding, setAdding] = useState(false);

//   /* ---------------- FETCH PRODUCT ---------------- */
//   useEffect(() => {
//     const found = products.find((p) => p._id === productId);
//     if (found) {
//       setProductData(found);
//       setImage(found.image[0]);
//     }
//   }, [productId, products]);

//   if (!productData) return <div className="opacity-0"></div>;

//   /* ---------------- ADD TO CART ---------------- */
//   const handleAddToCart = () => {
//     if (!size) {
//       return toast.error("Please select a size!", {
//         position: "top-center",
//         theme: "dark",
//       });
//     }

//     setAdding(true);

//     setTimeout(() => {
//       addToCart(productData._id, size);
//       setAdding(false);
//       toast.success("Added to Cart");
//     }, 900);
//   };

//   return (
//     <div className="border-t-2 pb-16">
//       {/* ⭐ MOBILE ONLY NAVBAR ⭐ */}
//       <div className="w-full sticky top-0 z-50 bg-black/50 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-white/10 sm:hidden">
//         {/* BACK */}
//         <button
//           onClick={() => navigate(-1)}
//           className="text-white px-3 py-2 rounded-lg hover:bg-white/20 active:scale-95"
//         >
//           ←
//         </button>

//         {/* 🔥 SURPRISE CENTER BADGE */}
//         <div className="flex items-center gap-1 text-white text-sm font-semibold animate-pulse">
//           <span className="text-lg">🔥</span> Trending Now
//         </div>

//         {/* CART ICON */}
//         <button
//           onClick={() => navigate("/cart")}
//           className="text-white px-3 py-2 rounded-lg hover:bg-white/20 active:scale-95 text-lg"
//         >
//           🛍️
//         </button>
//       </div>

//       {/* ---------------- MAIN GRID ---------------- */}
//       <div className="flex flex-col sm:flex-row gap-10">
//         {/* LEFT IMAGES */}
//         <div className="flex-1 flex flex-col-reverse sm:flex-row gap-4">
//           {/* ⭐ DESKTOP: SIDE THUMBNAILS (only 4 visible) ⭐ */}
//           <div
//             className="
//               hidden sm:flex 
//               flex-col gap-3 
//               w-[22%] 
//               overflow-y-auto 
//               max-h-[420px] 
//               pr-1 custom-scrollbar cursor-pointer
//             "
//           >
//             {productData.image.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 onClick={() => setImage(img)}
//                 className={`rounded-xl border transition object-cover 
//                 ${image === img ? "border-white scale-105" : "border-gray-400"} 
//                 w-full h-24`}
//               />
//             ))}
//           </div>

//           {/* ⭐ MOBILE: SCROLLABLE 5 THUMBNAILS ⭐ */}
//           <div className="flex sm:hidden gap-3 overflow-x-auto px-2">
//             {productData.image.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 onClick={() => setImage(img)}
//                 className={`
//                   rounded-xl border w-20 h-20 object-cover transition cursor-pointer
//                   ${
//                     image === img ? "border-white scale-105" : "border-gray-500"
//                   }
//                 `}
//               />
//             ))}
//           </div>

//           {/* MAIN IMAGE */}
//           <div className="relative sm:w-[78%] w-full">
//             <button
//               onClick={() => setShowFullView(true)}
//               className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded hover:bg-black transition text-xs"
//             >
//               Zoom 🔍
//             </button>

//             <img
//               src={image}
//               className="
//                 w-full
//                 rounded-xl
//                 bg-white
//                 object-contain
//                 cursor-pointer 
//                 max-h-[320px] sm:max-h-[650px]
//               "
//               onClick={() => setShowFullView(true)}
//             />
//           </div>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="flex-1 pr-3 text-white relative">
//           {/* BRAND */}
//           <p className="text-gray-400 uppercase text-sm tracking-wide">
//             {productData.brandName}
//           </p>

//           {/* NAME */}
//           <h1 className="font-semibold text-3xl mt-1">{productData.name}</h1>

//           {/* RATING */}
//           <div className="flex items-center gap-1 mt-3">
//             {Array(5)
//               .fill(0)
//               .map((_, i) => (
//                 <img
//                   key={i}
//                   src={
//                     i < productData.review
//                       ? assets.star_icon
//                       : assets.star_dull_icon
//                   }
//                   className="w-4"
//                 />
//               ))}

//             <p className="pl-2 text-sm text-gray-400">
//               ({productData.noOfPeopleReviewed})
//             </p>
//           </div>

//           {/* PRICE */}
//           <div className="flex items-center gap-4 mt-5">
//             <p className="text-3xl font-bold text-green-500">
//               {currency} {productData.discountedPrice}
//             </p>

//             <p className="line-through text-gray-400 text-xl">
//               {currency} {productData.actualPrice}
//             </p>

//             <p className="text-red-500 font-semibold text-lg">
//               {Math.round(
//                 ((productData.actualPrice - productData.discountedPrice) /
//                   productData.actualPrice) *
//                   100
//               )}
//               % OFF
//             </p>
//           </div>

//           {/* DESCRIPTION */}
//           <p className="text-gray-400 mt-5 leading-relaxed">
//             {productData.description}
//           </p>

//           {/* SIZE SELECTOR */}
//           <div className="my-8">
//             <p className="font-medium mb-4">Select Size</p>

//             <div className="flex gap-2 flex-wrap">
//               {productData.sizes.map((s) => (
//                 <button
//                   key={s}
//                   onClick={() => setSize(s)}
//                   className={`py-2 px-5 text-black rounded-md border transition 
//                     ${
//                       size === s
//                         ? "bg-white text-black border-white"
//                         : "bg-gray-200 border-gray-400"
//                     }
//                   `}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ADD TO CART */}
//           <button
//             onClick={handleAddToCart}
//             className="bg-white text-black px-12 py-3 rounded-lg border flex items-center justify-center gap-2 
//             hover:bg-gray-200 active:scale-95 transition"
//           >
//             {adding ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
//                 Adding...
//               </>
//             ) : (
//               "ADD TO CART"
//             )}
//           </button>

//           {adding && (
//             <p className="text-gray-400 mt-3 text-sm animate-pulse">
//               Adding this masterpiece to your cart… Hold tight 😎
//             </p>
//           )}
//         </div>
//       </div>

//       {/* DESCRIPTION TAB */}
//       <div className="mt-16 text-white">
//         <div className="flex border-b border-white/10">
//           <b className="border px-6 py-3 text-sm cursor-pointer">Description</b>
//           <p className="border px-6 py-3 text-sm cursor-pointer">
//             Reviews ({productData.noOfPeopleReviewed})
//           </p>
//         </div>

//         <div className="px-6 py-6 text-sm text-gray-400">
//           {productData.description}
//         </div>
//       </div>

//       {/* RELATED PRODUCTS */}
//       <RelatedProducts
//         category={productData.category}
//         subCategory={productData.subCategory}
//       />

//       {/* FULL SCREEN VIEW */}
//       {showFullView && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
//           <div className="bg-black rounded-2xl shadow-2xl p-6 relative flex flex-col items-center w-[80vw] h-[80vh]">
//             <button
//               onClick={() => setShowFullView(false)}
//               className="absolute top-4 right-4 text-white text-2xl hover:text-red-400"
//             >
//               ✕
//             </button>

//             <img
//               src={image}
//               className="w-full h-[80%] object-contain rounded-xl"
//             />

//             <div className="flex gap-3 overflow-x-auto w-full mt-4">
//               {productData.image.map((img, i) => (
//                 <img
//                   key={i}
//                   src={img}
//                   onClick={() => setImage(img)}
//                   className="w-20 h-20 rounded-xl border cursor-pointer object-cover hover:scale-105"
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;

import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [showFullView, setShowFullView] = useState(false);
  const [adding, setAdding] = useState(false);

  /* ------------ Fetch Product ------------ */
  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (found) {
      setProductData(found);
      setImage(found.image[0]);
    }
  }, [productId, products]);

  if (!productData) return <div className="opacity-0"></div>;

  /* ------------ Add To Cart ------------ */
  const handleAddToCart = () => {
    if (!size) {
      return toast.error("Please select a size!", { position: "top-center" });
    }

    setAdding(true);

    setTimeout(() => {
      addToCart(productData._id, size);
      setAdding(false);
      toast.success("Added to cart");
    }, 900);
  };

  return (
    <div className="border-t-2 bg-black pt-0">

      {/* ⭐ MOBILE NAVBAR (CUSTOM SURPRISE NAVBAR) ⭐ */}
      <div className="w-full sticky top-0 z-50 bg-black/40 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-white/10 sm:hidden">
        
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-white px-3 py-2 rounded-lg hover:bg-white/20 active:scale-95"
        >
          ←
        </button>

        {/* Surprise Badge */}
        <div className="flex items-center gap-1 text-white text-sm font-semibold animate-pulse">
          <span className="text-lg">🔥</span> Trending Now
        </div>

        {/* Surprise Right Icon */}
        <button
          onClick={() => navigate("/collections")}
          className="text-white text-sm px-3 py-2 rounded-lg hover:bg-white/20 active:scale-95"
        >
          ✨ Explore
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="flex flex-col sm:flex-row gap-10 px-4 sm:px-8 py-10">

        {/* ============== LEFT IMAGE SECTION ============== */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-4">

          {/* ⭐ MOBILE THUMBNAILS (Horizontal Scroll) */}
          <div className="flex sm:hidden gap-3 overflow-x-auto px-1">
            {productData.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setImage(img)}
                className={`rounded-xl w-20 h-20 object-cover border ${
                  image === img ? "border-white scale-105" : "border-gray-500"
                } transition cursor-pointer`}
              />
            ))}
          </div>

          {/* ⭐ DESKTOP THUMBNAILS WITH SCROLL ARROWS ⭐ */}
          <div className="hidden sm:flex flex-col items-center w-[22%]">
            
            <button className="text-white mb-2 opacity-40 hover:opacity-100">▲</button>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[360px] custom-scrollbar w-full px-1">
              {productData.image.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setImage(img)}
                  className={`rounded-xl border object-cover transition cursor-pointer w-full h-24 ${
                    image === img ? "border-white scale-105" : "border-gray-400"
                  }`}
                />
              ))}
            </div>

            <button className="text-white mt-2 opacity-40 hover:opacity-100">▼</button>
          </div>

          {/* MAIN IMAGE */}
          <div className="relative sm:w-[78%] w-full">
            <button
              onClick={() => setShowFullView(true)}
              className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded cursor-pointer hover:bg-black/90 transition"
            >
              Zoom 🔍
            </button>

            <img
              src={image}
              className="w-full rounded-xl bg-white object-contain max-h-[420px] sm:max-h-[750px]"
              onClick={() => setShowFullView(true)}
            />
          </div>

        </div>

        {/* ============== RIGHT DETAILS SECTION ============== */}
        <div className="flex-1 text-white relative">

          {/* DESKTOP BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="
              hidden sm:block absolute -top-6 right-0 
              text-white px-4 py-2 rounded-lg 
              border border-white/20 bg-black/40 
              backdrop-blur-sm hover:bg-white/60 hover:text-black/70 
              transition active:scale-95 cursor-pointer"
          >
            ← Back
          </button>

          {/* Brand */}
          <p className="text-gray-500 uppercase text-sm tracking-wide mt-6 sm:mt-0">
            {productData.brandName}
          </p>

          {/* Name */}
          <h1 className="font-semibold text-3xl mt-1">{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <img
                  key={i}
                  src={i < productData.review ? assets.star_icon : assets.star_dull_icon}
                  className="w-4"
                />
              ))}
            <p className="pl-2 text-gray-400 text-sm">
              ({productData.noOfPeopleReviewed})
            </p>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-4 mt-6">
            <p className="text-3xl font-bold text-green-500">
              {currency} {productData.discountedPrice}
            </p>
            <p className="line-through text-gray-400 text-xl">
              {currency} {productData.actualPrice}
            </p>
            <p className="text-red-500 font-semibold text-lg">
              {Math.round(
                ((productData.actualPrice - productData.discountedPrice) /
                  productData.actualPrice) * 100
              )}
              % OFF
            </p>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-400 mt-5 leading-relaxed">
            {productData.description}
          </p>

          {/* SIZE SELECTOR */}
          <div className="my-8">
            <p className="font-medium mb-3">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 px-5 rounded-md border cursor-pointer transition ${
                    size === s
                      ? "bg-white text-black font-semibold"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="bg-white text-black px-10 py-3 rounded-lg border cursor-pointer hover:bg-black hover:text-white transition active:scale-95 flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              "ADD TO CART"
            )}
          </button>

          {adding && (
            <p className="text-gray-400 mt-3 text-sm animate-pulse">
              Adding this masterpiece… Stay stylish 😎
            </p>
          )}

          {/* EXTRA INFO */}
          <div className="text-sm text-gray-500 mt-10">
            <p>✔ 100% Original Product</p>
            <p>✔ Cash on Delivery Available</p>
            <p>✔ Easy 7-Day Return & Exchange</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="mt-20 text-white">
        <div className="flex border-b border-white/20">
          <b className="border px-6 py-3 text-sm">Description</b>
          <p className="border px-6 py-3 text-sm">
            Reviews ({productData.noOfPeopleReviewed})
          </p>
        </div>

        <div className="px-6 py-6 text-sm text-gray-400">
          {productData.description}
        </div>
      </div>

      {/* RELATED */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

      {/* FULL IMAGE VIEW */}
      {showFullView && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div
            className="bg-black p-6 rounded-xl relative flex flex-col items-center shadow-xl"
            style={{ width: "70vw", height: "70vh" }}
          >
            <button
              onClick={() => setShowFullView(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-red-400"
            >
              ✖
            </button>

            <img
              src={image}
              className="w-full h-[80%] object-contain rounded-xl"
            />

            <div className="flex gap-3 overflow-x-auto w-full mt-4">
              {productData.image.map((img, i) => (
                <img
                  key={i}
                  onClick={() => setImage(img)}
                  src={img}
                  className="w-20 h-20 rounded-lg object-cover border cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Product;

