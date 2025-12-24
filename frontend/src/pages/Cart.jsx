import React, { useContext, useEffect, useState, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, delivery_fee } =
    useContext(ShopContext);

  const cartTotalRef = useRef(null);

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpenKey, setCartOpenKey] = useState(0);
  const [cartFinalAmount, setCartFinalAmount] = useState(0);
  const [priceData, setPriceData] = useState(null);

  // delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
  const tempData = [];

  for (const productId in cartItems) {
    for (const size in cartItems[productId]) {
      const qty = cartItems[productId][size];
      if (qty > 0) {
        tempData.push({
          _id: productId,
          size,
          quantity: qty,
        });
      }
    }
  }

  setCartData(tempData);
  setLoading(false);
}, [cartItems, products]);


  // -------- LOAD CART DATA ----------
  useEffect(() => {
  const loadPreview = async () => {
    const items = [];

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const qty = cartItems[productId][size];
        if (qty > 0) {
          items.push({
            productId,
            size,
            quantity: qty,
          });
        }
      }
    }

    if (!items.length) {
      setPriceData(null);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          items,
          paymentMethod: "preview", // cart page me COD fixed
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPriceData(data);
      }
    } catch (err) {
      console.log("Cart preview failed", err);
    }
  };

  loadPreview();
}, [cartItems, products]);

  // -------- CONFIRM DELETE ----------
  const confirmDelete = () => {
    if (deleteItem) {
      updateQuantity(deleteItem._id, deleteItem.size, 0);
      setConfirmOpen(false);
      setDeleteItem(null);
    }
  };

  // ---- TOTAL FOR BOTTOM BAR ----
  const computeFinalTotal = () => {
    let discountedTotal = 0;

    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        const qty = cartItems[productId][size];
        if (qty > 0) {
          discountedTotal += product.discountedPrice * qty;
        }
      }
    }

    const FREE_LIMIT = 1000;
    const shippingFee =
  discountedTotal >= FREE_LIMIT ? 0 : delivery_fee;

    return discountedTotal + shippingFee;
  };

  const finalTotal = computeFinalTotal();

  

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

  const QuantityInput = ({ item }) => {
    const { updateQuantity } = useContext(ShopContext);

    const [value, setValue] = useState(String(item.quantity));

    // 🔄 sync when cart updates externally
    useEffect(() => {
      setValue(String(item.quantity));
    }, [item.quantity]);

    // 🔽 Commit final value safely
    const commitValue = () => {
      const num = Number(value);

      if (!num || num < 1) {
        // fallback to 1
        updateQuantity(item._id, item.size, 1);
        setValue("1");
        return;
      }

      if (num !== item.quantity) {
        updateQuantity(item._id, item.size, num);
      }
    };

    return (
      <div className="flex items-center gap-2">
        {/* MINUS */}
        <button
          type="button"
          onClick={() => {
            const newQty = Math.max(1, item.quantity - 1);
            updateQuantity(item._id, item.size, newQty);
            setValue(String(newQty));
          }}
          className="
          w-8 h-8
          flex items-center justify-center
          rounded-md
          bg-white/10
          hover:bg-white/20
          transition
          cursor-pointer
        "
        >
          −
        </button>

        {/* INPUT */}
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            // allow empty while typing
            if (/^\d*$/.test(e.target.value)) {
              setValue(e.target.value);
            }
          }}
          onBlur={commitValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="
          w-12 sm:w-14
          h-9
          bg-black
          border border-white/20
          rounded-md
          text-white
          text-center
          text-sm
          outline-none
          focus:border-white/40
        "
        />

        {/* PLUS */}
        <button
          type="button"
          onClick={() => {
            const newQty = item.quantity + 1;
            updateQuantity(item._id, item.size, newQty);
            setValue(String(newQty));
          }}
          className="
          w-8 h-8
          flex items-center justify-center
          rounded-md
          bg-white/10
          hover:bg-white/20
          transition
          cursor-pointer
        "
        >
          +
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className="
    border-t  
    pt-20  
    text-white
    pb-[110px]
    px-2 sm:px-4 md:px-6 lg:px-10
  "
      >
        <div className="text-3xl mb-4 text-center">
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
  flex flex-col gap-4
  sm:grid sm:grid-cols-[3fr_1.5fr_1.5fr]
  sm:items-center 
  hover:border-white/20 transition
"
              >
                {/* LEFT */}
                <div className="flex gap-4 sm:gap-6 items-start">
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

                    <div className="flex flex-wrap items-center gap-2 mt-2">
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

                    <p className="text-xs sm:text-sm mt-2 bg-white/10 border border-white/20 px-2 py-1 rounded-md inline-block max-w-fit">
                      Size: {item.size}
                    </p>
                  </div>
                </div>

                {/* MOBILE — QUANTITY + DELETE */}
                <div className="flex sm:hidden items-center justify-between mt-3">
                  {/* LEFT — QUANTITY */}
                  <QuantityInput item={item} />

                  {/* RIGHT — DELETE */}
                  <button
                    onClick={() => {
                      setDeleteItem(item);
                      setConfirmOpen(true);
                    }}
                    className="
      flex items-center gap-1
      text-red-400
      text-sm
      hover:text-red-500
      transition
      cursor-pointer
    "
                  >
                    <img
                      src={assets.bin_icon}
                      alt="delete"
                      className="w-5 invert opacity-80"
                    />
                    Remove
                  </button>
                </div>

                {/* DESKTOP — QUANTITY (CENTER) */}
                <div className="hidden sm:flex justify-center">
                  <QuantityInput item={item} />
                </div>

                {/* DESKTOP — DELETE (RIGHT) */}
                <div className="hidden sm:flex justify-end">
                  <img
                    src={assets.bin_icon}
                    alt="delete"
                    onClick={() => {
                      setDeleteItem(item);
                      setConfirmOpen(true);
                    }}
                    className="
      w-6
      invert
      cursor-pointer
      opacity-70
      hover:opacity-100
      hover:scale-110
      transition
    "
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* CART TOTAL (MOBILE + DESKTOP) */}
        <div className="flex justify-end my-5">
          <div
            ref={cartTotalRef}
            className="w-full sm:w-[450px] cursor-pointer"
          >
            <CartTotal
  forceOpenKey={cartOpenKey}
  priceData={priceData}
/>

          </div>
        </div>
      </div>
      {/* MOBILE FIXED CHECKOUT */}
      <div className="fixed bottom-0 left-0 w-full bg-black border-t border-white/10 px-4 py-3 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* LEFT — TOTAL (CLICKABLE) */}
          <div
            onClick={() => {
              setCartOpenKey((prev) => prev + 1); // 🔥 always changes
              cartTotalRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="
    flex flex-col
    cursor-pointer
    group
  "
          >
            <p className="text-xs text-green-400 flex items-center gap-1">
              Total Amount
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </p>

            <p className="text-lg font-bold text-white flex items-center gap-2">
              {currency}
              {priceData?.payableAmount ?? finalTotal}
              <FaChevronRight
                className="
    text-gray-400
    text-lg
    transition-all duration-200
    group-hover:text-white
    group-hover:translate-x-1
  "
              />
            </p>
          </div>

          {/* RIGHT — CTA */}
          <button
            onClick={() => navigate("/placeorder")}
            className="
        bg-white text-black
        px-6 py-3
        rounded-lg
        font-semibold
        border border-black
        transition-all duration-200
        hover:bg-black hover:text-white
        cursor-pointer
        whitespace-nowrap
      "
          >
            Proceed to Checkout →
          </button>
        </div>
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
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
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
