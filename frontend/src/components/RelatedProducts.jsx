// import React, { useContext, useEffect } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { useState } from "react";
// import Title from "./Title";
// import ProductItem from "./ProductItem";

// const RelatedProducts = ({ category, subCategory }) => {
//   const { products } = useContext(ShopContext);
//   const [related, setRelated] = useState([]);

//   useEffect(() => {
//     if (products.length > 0) {
//       let productsCopy = products.slice();

//       productsCopy = productsCopy.filter((item) => category === item.category);
//       productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

//       setRelated(productsCopy.slice(0, 5)); // Limit to 5 related products

//     }
//   }, [products]);

//   return (
//   <div className="my-24">
//    <div className="text-center text-3xl py-2">
//       <Title text1={'Related'} text2={'products'}/>
//    </div>
//    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
//       {related.map((item,index)=>(
//          <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
//       ))}

//    </div>

//   </div>
//   )
// };

// export default RelatedProducts;

// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "./Title";
// import ProductItem from "./ProductItem";
// import { assets } from "../assets/assets";

// const RelatedProducts = ({ category, subCategory }) => {
//   const { products } = useContext(ShopContext);
//   const [related, setRelated] = useState([]);
//   const [visible, setVisible] = useState(5);

//   useEffect(() => {
//     if (products.length > 0) {
//       let filtered = products.filter(
//         (item) =>
//           item.category === category && item.subCategory === subCategory
//       );

//       setRelated(filtered);
//     }
//   }, [products, category, subCategory]);

//   const handleShowMore = () => {
//     setVisible((prev) => prev + 5);
//   };

//   const handleHide = () => {
//     setVisible(5);
//   };

//   const handleShare = (item) => {
//     const url = `${window.location.origin}/product/${item._id}`;

//     navigator.clipboard.writeText(url);
//     alert("Product link copied to clipboard!");
//   };

//   return (
//     <div className="my-24">
//       {/* Title */}
//       <div className="text-center text-3xl py-2 text-white">
//         <Title text1="Related" text2="Products" />
//       </div>

//       {/* Product Grid */}
//       <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//         {related.slice(0, visible).map((item, index) => {
//           const discount =
//             ((item.actualPrice - item.discountedPrice) /
//               item.actualPrice) *
//             100;

//           return (
//             <div
//               key={index}
//               className="
//                 bg-[#1c1c1c] border border-white/10 p-3 rounded-xl
//                 hover:scale-[1.03] hover:shadow-xl
//                 hover:border-white/20 transition cursor-pointer
//               "
//             >
//               {/* PRODUCT ITEM MAIN */}
//               <ProductItem
//                 id={item._id}
//                 name={item.name}
//                 brandName={item.brandName}
//                 image={item.image}
//                 actualPrice={item.actualPrice}
//                 discountedPrice={item.discountedPrice}
//                 review={item.review}
//                 reviews={item.noOfPeopleReviewed}
//               />

//               {/* DISCOUNT */}
//               <p className="text-red-400 font-semibold mt-2 text-sm">
//                 {Math.round(discount)}% OFF
//               </p>

//               {/* SHARE BUTTON */}
//               <button
//                 onClick={() => handleShare(item)}
//                 className="
//                   w-full mt-3 py-2 rounded-lg
//                   bg-white text-black font-semibold
//                   hover:bg-gray-300 transition
//                   cursor-pointer
//                 "
//               >
//                 Share 🔗
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {/* SHOW MORE / HIDE BUTTONS */}
//       <div className="flex justify-center gap-4 mt-10">
//         {visible < related.length && (
//           <button
//             onClick={handleShowMore}
//             className="
//               text-white border border-white/30 px-6 py-2
//               rounded-lg hover:bg-white hover:text-black
//               transition cursor-pointer
//             "
//           >
//             Show More
//           </button>
//         )}

//         {visible > 5 && (
//           <button
//             onClick={handleHide}
//             className="
//               text-red-400 border border-red-400 px-6 py-2
//               rounded-lg hover:bg-red-400 hover:text-black
//               transition cursor-pointer
//             "
//           >
//             Hide
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RelatedProducts;

// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { Link } from "react-router-dom";
// import Title from "./Title";
// import ProductItem from "./ProductItem";

// const RelatedProducts = ({ category, subCategory }) => {
//   const { products, addToCart } = useContext(ShopContext);

//   const [related, setRelated] = useState([]);
//   const [visible, setVisible] = useState(5);

//   useEffect(() => {
//     if (products.length > 0) {
//       const filtered = products.filter(
//         (p) => p.category === category && p.subCategory === subCategory
//       );
//       setRelated(filtered);
//     }
//   }, [products, category, subCategory]);

//   const handleShowMore = () => setVisible((prev) => prev + 5);
//   const handleHide = () => setVisible(5);

//   return (
//     <div className="my-24">
//       <div className="text-center text-3xl py-2 text-white">
//         <Title text1="Related" text2="Products" />
//       </div>

//       {/* Product Grid */}
//       <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//         {related.slice(0, visible).map((item) => {
//           const discount =
//             ((item.actualPrice - item.discountedPrice) / item.actualPrice) *
//             100;

//           return (
//             <Link
//               to={`/product/${item._id}`}
//               key={item._id}
//               className="
//                 bg-[#1c1c1c] border border-white/10 p-3 rounded-xl 
//                 hover:scale-[1.03] hover:shadow-xl hover:border-white/20 
//                 transition cursor-pointer relative
//               "
//             >
//               {/* PRODUCT ITEM */}
//               <ProductItem {...item} />

//               {/* DISCOUNT */}
//               <p className="text-red-400 font-semibold mt-2 text-sm">
//                 {Math.round(discount)}% OFF
//               </p>

//               {/* ADD TO CART BUTTON (INSIDE CARD) */}
//               <button
//                 onClick={(e) => {
//                   e.preventDefault(); // prevents opening product page

//                   addToCart(item._id, item.sizes?.[0]);

//                   toast.success("Item added to cart!", {
//                     position: "bottom-center",
//                     autoClose: 1200,
//                     hideProgressBar: true,
//                     closeOnClick: true,
//                     pauseOnHover: false,
//                     draggable: false,
//                     theme: "dark",
//                   });
//                 }}
//                 className="
//                w-full mt-3 py-2 rounded-lg 
//               bg-white text-black font-semibold
//               hover:bg-gray-300 transition cursor-pointer"
//               >
//                 Add to Cart
//               </button>
//             </Link>
//           );
//         })}
//       </div>

//       {/* Show More / Hide */}
//       <div className="flex justify-center gap-4 mt-10">
//         {visible < related.length && (
//           <button
//             onClick={handleShowMore}
//             className="
//               text-white border border-white/30 px-6 py-2 rounded-lg 
//               hover:bg-white hover:text-black cursor-pointer transition
//             "
//           >
//             Show More
//           </button>
//         )}

//         {visible > 5 && (
//           <button
//             onClick={handleHide}
//             className="
//               text-red-400 border border-red-400 px-6 py-2 rounded-lg 
//               hover:bg-red-400 hover:text-black cursor-pointer transition
//             "
//           >
//             Hide
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RelatedProducts;


// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { Link } from "react-router-dom";
// import Title from "./Title";
// import ProductItem from "./ProductItem";
// import { toast } from "react-toastify";

// const RelatedProducts = ({ category, subCategory }) => {
//   const { products, addToCart } = useContext(ShopContext);

//   const [related, setRelated] = useState([]);
//   const [visible, setVisible] = useState(5);
//   const [loadingId, setLoadingId] = useState(null); // ⭐ track button loader

//   useEffect(() => {
//     if (products.length > 0) {
//       const filtered = products.filter(
//         (p) => p.category === category && p.subCategory === subCategory
//       );
//       setRelated(filtered);
//     }
//   }, [products, category, subCategory]);

//   const handleShowMore = () => setVisible((prev) => prev + 5);
//   const handleHide = () => setVisible(5);

//   const handleAddToCart = (e, item) => {
//     e.preventDefault(); // prevent navigation  
//     setLoadingId(item._id); // show loader on specific btn   

//     setTimeout(() => {
//       addToCart(item._id, item.sizes?.[0]); // default size  
//       setLoadingId(null);

//       toast.success("Item added to cart!", {
//         position: "bottom-center",
//         autoClose: 1200,
//         hideProgressBar: true,
//         pauseOnHover: false,
//         theme: "dark",
//       });
//     }, 900);
//   };

//   return (
//     <div className="my-24">
//       <div className="text-center text-3xl py-2 text-white">
//         <Title text1="Related" text2="Products" />
//       </div>

//       {/* Product Grid */}
//       <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//         {related.slice(0, visible).map((item) => {
//           const discount =
//             ((item.actualPrice - item.discountedPrice) / item.actualPrice) * 100;

//           return (
//             <Link
//               to={`/product/${item._id}`}
//               key={item._id}
//               className="
//                 bg-[#1c1c1c] border border-white/10 p-3 rounded-xl 
//                 hover:scale-[1.03] hover:shadow-xl hover:border-white/20 
//                 transition cursor-pointer relative
//               "
//             >
//               {/* PRODUCT CARD */}
//               <ProductItem {...item} />

//               {/* DISCOUNT */}
//               <p className="text-red-400 font-semibold mt-2 text-sm">
//                 {Math.round(discount)}% OFF
//               </p>

//               {/* ADD TO CART WITH LOADER */}
//               <button
//                 onClick={(e) => handleAddToCart(e, item)}
//                 className="
//                   w-full mt-3 py-2 rounded-lg bg-white text-black font-semibold 
//                   hover:bg-gray-300 transition cursor-pointer flex justify-center items-center
//                 "
//               >
//                 {loadingId === item._id ? (
//                   <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
//                 ) : (
//                   "Add to Cart"
//                 )}
//               </button>
//             </Link>
//           );
//         })}
//       </div>

//       {/* Show More / Hide */}
//       <div className="flex justify-center gap-4 mt-10">
//         {visible < related.length && (
//           <button
//             onClick={handleShowMore}
//             className="
//               text-white border border-white/30 px-6 py-2 rounded-lg 
//               hover:bg-white hover:text-black cursor-pointer transition
//             "
//           >
//             Show More
//           </button>
//         )}

//         {visible > 5 && (
//           <button
//             onClick={handleHide}
//             className="
//               text-red-400 border border-red-400 px-6 py-2 rounded-lg 
//               hover:bg-red-400 hover:text-black cursor-pointer transition
//             "
//           >
//             Hide
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RelatedProducts;

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
    <div className="my-24">
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


