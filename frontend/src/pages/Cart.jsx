// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import CartTotal from "../components/CartTotal";

// const Cart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate } =
//     useContext(ShopContext);

//   const [cartData, setCartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // -------- LOAD CART DATA ----------
//   useEffect(() => {
//     setLoading(true);

//     if (products.length > 0) {
//       const tempData = [];

//       for (const productId in cartItems) {
//         for (const size in cartItems[productId]) {
//           if (cartItems[productId][size] > 0) {
//             tempData.push({
//               _id: productId,
//               size,
//               quantity: cartItems[productId][size],
//             });
//           }
//         }
//       }

//       setCartData(tempData);
//       setTimeout(() => setLoading(false), 500);
//     }
//   }, [cartItems, products]);

//   // If still loading
//   if (loading) {
//     return (
//       <div className="pt-20 flex flex-col items-center justify-center text-white">
//         <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
//         <p className="mt-4 text-gray-400 text-sm animate-pulse">
//           Bringing your cart to life… ✨
//         </p>
//       </div>
//     );
//   }

//   // If cart empty
//   if (!loading && cartData.length === 0) {
//     return (
//       <div className="pt-20 flex flex-col items-center text-white">
//         <img src={assets.bin_icon} className="w-14 opacity-70 mb-4" />
//         <p className="text-xl font-semibold">Your cart is empty</p>
//         <p className="text-gray-400 mt-1 text-sm">
//           Looks like you haven’t added anything yet 👀
//         </p>

//         <button
//           onClick={() => navigate("/collections")}
//           className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
//         >
//           Browse Products →
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="border-t pt-14 text-white">
//       <div className="text-3xl mb-6">
//         <Title text1="Your" text2="Cart" />
//       </div>

//       {/* CART ITEMS */}
//       <div className="space-y-6 cursor-pointer">
//         {cartData.map((item, index) => {
//           const productData = products.find(
//             (product) => product._id === item._id
//           );

//           if (!productData) return null;

//           const discountPercent = Math.round(
//             ((productData.actualPrice - productData.discountedPrice) /
//               productData.actualPrice) *
//               100
//           );

//           return (
//             <div
//               key={index}
//               className="
//                 bg-[#1a1a1a] border border-white/10
//                 p-4 rounded-xl
//                 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr]
//                 items-center gap-6
//                 hover:border-white/20 transition
//               "
//             >
//               {/* LEFT SECTION */}
//               <div className="flex items-start gap-6">
//                 <img
//                   className="w-20 h-24 object-cover rounded-lg"
//                   src={productData.image[0]}
//                   alt=""
//                 />

//                 <div>
//                   <p className="text-lg font-semibold">{productData.name}</p>

//                   {/* BRAND */}
//                   <p className="text-xs uppercase tracking-wide text-gray-400">
//                     {productData.brandName}
//                   </p>

//                   {/* PRICE SECTION */}
//                   <div className="flex items-center gap-3 mt-2">
//                     <p className="text-green-500 font-semibold">
//                       {currency}
//                       {productData.discountedPrice}
//                     </p>

//                     <p className="line-through text-gray-500 text-sm">
//                       {currency}
//                       {productData.actualPrice}
//                     </p>

//                     <p className="text-red-400 font-semibold text-sm">
//                       {discountPercent}% OFF
//                     </p>
//                   </div>

//                   {/* SIZE */}
//                   <p className="text-sm mt-2 bg-white/10 border border-white/20 px-2 py-1 rounded-md inline-block">
//                     Size: {item.size}
//                   </p>
//                 </div>
//               </div>

//               {/* QUANTITY */}
//               <input
//                 className="
//                   bg-black border border-white/20
//                   p-2 rounded-md w-16 text-center
//                   text-white
//                 "
//                 type="number"
//                 min={1}
//                 value={item.quantity}
//                 onChange={(e) => {
//                   const val = Number(e.target.value);
//                   if (val > 0) updateQuantity(item._id, item.size, val);
//                 }}
//               />

//               {/* DELETE BUTTON */}
//               <img
//                 onClick={() => updateQuantity(item._id, item.size, 0)}
//                 src={assets.bin_icon}
//                 alt="delete"
//                 className="w-6 invert cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition"
//               />
//             </div>
//           );
//         })}
//       </div>

//       {/* TOTAL SECTION */}
//       <div className="flex justify-end my-20">
//         <div className="w-full sm:w-[450px]">
//           <CartTotal />
//           <div className="w-full text-end">
//             <button
//               onClick={() => navigate("/placeorder")}
//               className="
//                 bg-white text-black text-sm my-8 px-8 py-3 rounded-lg
//                 font-semibold hover:bg-gray-300 transition cursor-pointer
//               "
//             >
//               Proceed to Checkout →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import CartTotal from "../components/CartTotal";

// const Cart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate } =
//     useContext(ShopContext);

//   const [cartData, setCartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // delete confirmation
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteItem, setDeleteItem] = useState(null);

//   // -------- LOAD CART DATA ----------
//   useEffect(() => {
//     setLoading(true);

//     if (products.length > 0) {
//       const tempData = [];

//       for (const productId in cartItems) {
//         for (const size in cartItems[productId]) {
//           if (cartItems[productId][size] > 0) {
//             tempData.push({
//               _id: productId,
//               size,
//               quantity: cartItems[productId][size],
//             });
//           }
//         }
//       }

//       setCartData(tempData);
//       setTimeout(() => setLoading(false), 400);
//     }
//   }, [cartItems, products]);

//   // -------- CONFIRM DELETE ----------
//   const confirmDelete = () => {
//     if (deleteItem) {
//       updateQuantity(deleteItem._id, deleteItem.size, 0);
//       setConfirmOpen(false);
//       setDeleteItem(null);
//     }
//   };

//   // LOADING
//   if (loading) {
//     return (
//       <div className="pt-20 flex flex-col items-center justify-center text-white">
//         <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
//         <p className="mt-4 text-gray-400 text-sm animate-pulse">
//           Bringing your cart to life… ✨
//         </p>
//       </div>
//     );
//   }

//   // EMPTY CART
//   if (!loading && cartData.length === 0) {
//     return (
//       <div className="pt-20 flex flex-col items-center text-white">
//         <img src={assets.bin_icon} className="w-14 opacity-70 mb-4" />
//         <p className="text-xl font-semibold">Your cart is empty</p>
//         <p className="text-gray-400 mt-1 text-sm">
//           Looks like you haven’t added anything yet 👀
//         </p>

//         <button
//           onClick={() => navigate("/collections")}
//           className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
//         >
//           Browse Products →
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="border-t pt-14 text-white pb-28 md:pb-0">
//         <div className="text-3xl mb-6">
//           <Title text1="Your" text2="Cart" />
//         </div>

//         {/* CART ITEMS */}
//         <div className="space-y-4">
//           {cartData.map((item, index) => {
//             const productData = products.find(
//               (product) => product._id === item._id
//             );
//             if (!productData) return null;

//             const discountPercent = Math.round(
//               ((productData.actualPrice - productData.discountedPrice) /
//                 productData.actualPrice) *
//                 100
//             );

//             return (
//               <div
//                 key={index}
//                 className="
//                   bg-[#1a1a1a] border border-white/10
//                   p-4 rounded-xl
//                   grid grid-cols-[1fr_auto_auto]
//                   items-center gap-4
//                 "
//               >
//                 {/* LEFT */}
//                 <div className="flex gap-4">
//                   <img
//                     className="w-16 h-20 object-cover rounded-lg"
//                     src={productData.image[0]}
//                     alt=""
//                   />

//                   <div>
//                     <p className="font-semibold">{productData.name}</p>
//                     <p className="text-xs uppercase text-gray-400">
//                       {productData.brandName}
//                     </p>

//                     <div className="flex gap-2 mt-1 items-center">
//                       <p className="text-green-500 font-semibold text-sm">
//                         {currency}
//                         {productData.discountedPrice}
//                       </p>
//                       <p className="line-through text-gray-500 text-xs">
//                         {currency}
//                         {productData.actualPrice}
//                       </p>
//                       <p className="text-red-400 text-xs font-semibold">
//                         {discountPercent}% OFF
//                       </p>
//                     </div>

//                     <p className="text-xs mt-1 bg-white/10 px-2 py-0.5 rounded inline-block">
//                       Size: {item.size}
//                     </p>
//                   </div>
//                 </div>

//                 {/* QUANTITY (FIXED FOR MOBILE) */}
//                 <input
//                   type="number"
//                   min={1}
//                   value={item.quantity}
//                   onChange={(e) => {
//                     const val = Number(e.target.value);
//                     if (val > 0) updateQuantity(item._id, item.size, val);
//                   }}
//                   className="
//                     w-12 sm:w-16
//                     h-9
//                     text-center
//                     bg-black border border-white/20
//                     rounded-md text-white text-sm
//                   "
//                 />

//                 {/* DELETE */}
//                 <img
//                   src={assets.bin_icon}
//                   onClick={() => {
//                     setDeleteItem(item);
//                     setConfirmOpen(true);
//                   }}
//                   className="w-5 opacity-70 hover:opacity-100 cursor-pointer"
//                 />
//               </div>
//             );
//           })}
//         </div>

//         {/* DESKTOP TOTAL */}
//         <div className="hidden md:flex justify-end my-20">
//           <div className="w-[450px]">
//             <CartTotal />
//             <div className="text-end">
//               <button
//                 onClick={() => navigate("/placeorder")}
//                 className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
//               >
//                 Proceed to Checkout →
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE FIXED CHECKOUT */}
//       <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-white/10 p-4 z-50">
//         <button
//           onClick={() => navigate("/placeorder")}
//           className="w-full bg-white text-black py-3 rounded-lg font-semibold"
//         >
//           Proceed to Checkout →
//         </button>
//       </div>

//       {/* CONFIRM DELETE MODAL */}
//       {confirmOpen && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-sm border border-white/10">
//             <p className="text-lg font-semibold text-white">
//               Remove item from cart?
//             </p>
//             <p className="text-sm text-gray-400 mt-2">
//               This item will be permanently removed.
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setConfirmOpen(false)}
//                 className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Cart;

// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import CartTotal from "../components/CartTotal";

// const Cart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate } =
//     useContext(ShopContext);

//   const [cartData, setCartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // delete confirmation
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteItem, setDeleteItem] = useState(null);

//   // -------- LOAD CART DATA ----------
//   useEffect(() => {
//     setLoading(true);

//     if (products.length > 0) {
//       const tempData = [];

//       for (const productId in cartItems) {
//         for (const size in cartItems[productId]) {
//           if (cartItems[productId][size] > 0) {
//             tempData.push({
//               _id: productId,
//               size,
//               quantity: cartItems[productId][size],
//             });
//           }
//         }
//       }

//       setCartData(tempData);
//       setTimeout(() => setLoading(false), 500);
//     }
//   }, [cartItems, products]);

//   // -------- CONFIRM DELETE ----------
//   const confirmDelete = () => {
//     if (deleteItem) {
//       updateQuantity(deleteItem._id, deleteItem.size, 0);
//       setConfirmOpen(false);
//       setDeleteItem(null);
//     }
//   };

//   // LOADING
//   if (loading) {
//     return (
//       <div className="pt-20 flex flex-col items-center justify-center text-white">
//         <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
//         <p className="mt-4 text-gray-400 text-sm animate-pulse">
//           Bringing your cart to life… ✨
//         </p>
//       </div>
//     );
//   }

//   // EMPTY CART
//   // EMPTY CART
// if (!loading && cartData.length === 0) {
//   return (
//     <div className="pt-20 flex flex-col items-center text-white">
//       <img src={assets.bin_icon} className="w-14 opacity-70 mb-4" />
//       <p className="text-xl font-semibold">Your cart is empty</p>
//       <p className="text-gray-400 mt-1 text-sm">
//         Looks like you haven’t added anything yet 👀
//       </p>

//       <button
//         onClick={() => navigate("/collections")}
//         className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
//       >
//         Browse Products →
//       </button>
//     </div>
//   );
// }

//   return (
//     <>
//       <div className="border-t pt-14 text-white pb-28 md:pb-0">
//         <div className="text-3xl mb-6">
//           <Title text1="Your" text2="Cart" />
//         </div>

//         {/* CART ITEMS */}
//         <div className="space-y-6">
//           {cartData.map((item, index) => {
//             const productData = products.find(
//               (product) => product._id === item._id
//             );
//             if (!productData) return null;

//             const discountPercent = Math.round(
//               ((productData.actualPrice - productData.discountedPrice) /
//                 productData.actualPrice) *
//                 100
//             );

//             return (
//               <div
//                 key={index}
//                 className="
//                   bg-[#1a1a1a] border border-white/10
//                   p-4 rounded-xl
//                   grid grid-cols-[4fr_1fr_0.5fr]
//                   sm:grid-cols-[4fr_2fr_0.5fr]
//                   items-center gap-6
//                   hover:border-white/20 transition
//                 "
//               >
//                 {/* LEFT SECTION (LEGACY PRESERVED) */}
//                 <div className="flex items-start gap-6">
//                   <img
//                     className="w-20 h-24 object-cover rounded-lg"
//                     src={productData.image[0]}
//                     alt={productData.name}
//                   />

//                   <div>
//                     <p className="text-lg font-semibold">
//                       {productData.name}
//                     </p>

//                     <p className="text-xs uppercase tracking-wide text-gray-400">
//                       {productData.brandName}
//                     </p>

//                     <div className="flex items-center gap-3 mt-2">
//                       <p className="text-green-500 font-semibold">
//                         {currency}
//                         {productData.discountedPrice}
//                       </p>

//                       <p className="line-through text-gray-500 text-sm">
//                         {currency}
//                         {productData.actualPrice}
//                       </p>

//                       <p className="text-red-400 font-semibold text-sm">
//                         {discountPercent}% OFF
//                       </p>
//                     </div>

//                     <p className="text-sm mt-2 bg-white/10 border border-white/20 px-2 py-1 rounded-md inline-block">
//                       Size: {item.size}
//                     </p>
//                   </div>
//                 </div>

//                 {/* QUANTITY (RESPONSIVE FIX, LEGACY SAFE) */}
//                 <input
//                   type="number"
//                   min={1}
//                   value={item.quantity}
//                   onChange={(e) => {
//                     const val = Number(e.target.value);
//                     if (val > 0)
//                       updateQuantity(item._id, item.size, val);
//                   }}
//                   className="
//                     bg-black border border-white/20
//                     rounded-md text-white text-center
//                     w-12 sm:w-16
//                     h-9 sm:h-10
//                     text-sm
//                   "
//                 />

//                 {/* DELETE WITH CONFIRM */}
//                 <img
//                   src={assets.bin_icon}
//                   alt="delete"
//                   onClick={() => {
//                     setDeleteItem(item);
//                     setConfirmOpen(true);
//                   }}
//                   className="w-6 invert cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition"
//                 />
//               </div>
//             );
//           })}
//         </div>

//         {/* DESKTOP TOTAL (UNCHANGED) */}
//         {/* CART TOTAL (MOBILE + DESKTOP) */}
// <div className="flex justify-end my-10 md:my-20">
//   <div className="w-full sm:w-[450px]">
//     <CartTotal />

//     {/* DESKTOP CHECKOUT BUTTON */}
//     <div className="hidden md:block text-end">
//       <button
//         onClick={() => navigate("/placeorder")}
//         className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
//       >
//         Proceed to Checkout →
//       </button>
//     </div>
//   </div>
// </div>

//       {/* MOBILE FIXED CHECKOUT */}
//       <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-white/10 p-4 z-50">
//         <button
//           onClick={() => navigate("/placeorder")}
//           className="w-full bg-white text-black py-3 rounded-lg font-semibold"
//         >
//           Proceed to Checkout →
//         </button>
//       </div>

//       {/* CONFIRM DELETE MODAL */}
//       {confirmOpen && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-sm border border-white/10">
//             <p className="text-lg font-semibold text-white">
//               Remove item from cart?
//             </p>
//             <p className="text-sm text-gray-400 mt-2">
//               This item will be permanently removed.
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setConfirmOpen(false)}
//                 className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Cart;

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // -------- LOAD CART DATA ----------
  useEffect(() => {
    setLoading(true);

    if (products.length > 0) {
      const tempData = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            tempData.push({
              _id: productId,
              size,
              quantity: cartItems[productId][size],
            });
          }
        }
      }

      setCartData(tempData);
      setTimeout(() => setLoading(false), 500);
    }
  }, [cartItems, products]);

  // -------- CONFIRM DELETE ----------
  const confirmDelete = () => {
    if (deleteItem) {
      updateQuantity(deleteItem._id, deleteItem.size, 0);
      setConfirmOpen(false);
      setDeleteItem(null);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 text-sm animate-pulse">
          Bringing your cart to life… ✨
        </p>
      </div>
    );
  }

  // EMPTY CART
  if (!loading && cartData.length === 0) {
    return (
      <div className="pt-20 flex flex-col items-center text-white">
        <img src={assets.bin_icon} className="w-14 opacity-70 mb-4" />
        <p className="text-xl font-semibold">Your cart is empty</p>
        <p className="text-gray-400 mt-1 text-sm">
          Looks like you haven’t added anything yet 👀
        </p>

        <button
          onClick={() => navigate("/collections")}
          className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Browse Products →
        </button>
      </div>
    );
  }

  const QuantityInput = ({ item, updateQuantity }) => {
    const [value, setValue] = useState(item.quantity);

    useEffect(() => {
      setValue(item.quantity);
    }, [item.quantity]);

    return (
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          const val = Number(value);
          if (val > 0 && val !== item.quantity) {
            updateQuantity(item._id, item.size, val);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.target.blur();
          }
        }}
        className="
        bg-black border border-white/20
        rounded-md text-white text-center
        w-12 sm:w-16
        h-9 sm:h-10
        text-sm
      "
      />
    );
  };

  return (
    <>
      <div className="border-t pt-14 text-white pb-28 md:pb-0">
        <div className="text-3xl mb-6">
          <Title text1="Your" text2="Cart" />
        </div>

        {/* CART ITEMS */}
        <div className="space-y-6">
          {cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );
            if (!productData) return null;

            const discountPercent = Math.round(
              ((productData.actualPrice - productData.discountedPrice) /
                productData.actualPrice) *
                100
            );

            return (
              <div
                key={index}
                className="
                  bg-[#1a1a1a] border border-white/10
                  p-4 rounded-xl
                  grid grid-cols-[4fr_1fr_0.5fr]
                  sm:grid-cols-[4fr_2fr_0.5fr]
                  items-center gap-6
                  hover:border-white/20 transition
                "
              >
                {/* LEFT */}
                <div className="flex items-start gap-6">
                  <img
                    className="w-20 h-24 object-cover rounded-lg"
                    src={productData.image[0]}
                    alt={productData.name}
                  />

                  <div>
                    <p className="text-lg font-semibold">{productData.name}</p>

                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      {productData.brandName}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-green-500 font-semibold">
                        {currency}
                        {productData.discountedPrice}
                      </p>

                      <p className="line-through text-gray-500 text-sm">
                        {currency}
                        {productData.actualPrice}
                      </p>

                      <p className="text-red-400 font-semibold text-sm">
                        {discountPercent}% OFF
                      </p>
                    </div>

                    <p className="text-sm mt-2 bg-white/10 border border-white/20 px-2 py-1 rounded-md inline-block">
                      Size: {item.size}
                    </p>
                  </div>
                </div>

                {/* QUANTITY */}
                <QuantityInput item={item} updateQuantity={updateQuantity} />

                {/* DELETE */}
                <img
                  src={assets.bin_icon}
                  alt="delete"
                  onClick={() => {
                    setDeleteItem(item);
                    setConfirmOpen(true);
                  }}
                  className="w-6 invert cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition"
                />
              </div>
            );
          })}
        </div>

        {/* CART TOTAL (MOBILE + DESKTOP) */}
        <div className="flex justify-end my-10 md:my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />

            {/* DESKTOP CHECKOUT BUTTON */}
            <div className="hidden md:block text-end">
              <button
                onClick={() => navigate("/placeorder")}
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FIXED CHECKOUT */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-white/10 p-4 z-50">
        <button
          onClick={() => navigate("/placeorder")}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold"
        >
          Proceed to Checkout →
        </button>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-sm border border-white/10">
            <p className="text-lg font-semibold text-white">
              Remove item from cart?
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This item will be permanently removed.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
