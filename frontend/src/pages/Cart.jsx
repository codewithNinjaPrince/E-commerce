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

  // If still loading
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

  // If cart empty
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
          className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
        >
          Browse Products →
        </button>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 text-white">
      <div className="text-3xl mb-6">
        <Title text1="Your" text2="Cart" />
      </div>

      {/* CART ITEMS */}
      <div className="space-y-6 cursor-pointer">
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
                grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] 
                items-center gap-6
                hover:border-white/20 transition
              "
            >
              {/* LEFT SECTION */}
              <div className="flex items-start gap-6">
                <img
                  className="w-20 h-24 object-cover rounded-lg"
                  src={productData.image[0]}
                  alt=""
                />

                <div>
                  <p className="text-lg font-semibold">{productData.name}</p>

                  {/* BRAND */}
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {productData.brandName}
                  </p>

                  {/* PRICE SECTION */}
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

                  {/* SIZE */}
                  <p className="text-sm mt-2 bg-white/10 border border-white/20 px-2 py-1 rounded-md inline-block">
                    Size: {item.size}
                  </p>
                </div>
              </div>

              {/* QUANTITY */}
              <input
                className="
                  bg-black border border-white/20 
                  p-2 rounded-md w-16 text-center
                  text-white
                "
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0) updateQuantity(item._id, item.size, val);
                }}
              />

              {/* DELETE BUTTON */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                alt="delete"
                className="w-6 invert cursor-pointer opacity-70 hover:opacity-100 hover:scale-110 transition"
              />
            </div>
          );
        })}
      </div>

      {/* TOTAL SECTION */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/placeorder")}
              className="
                bg-white text-black text-sm my-8 px-8 py-3 rounded-lg 
                font-semibold hover:bg-gray-300 transition cursor-pointer
              "
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

