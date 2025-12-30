import React, { useContext, useEffect, useState, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useLayoutEffect } from "react";
import AddressPage from "./AddressPage";
import { FaArrowLeft, FaTimes, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const CartPageSkeleton = () => {
  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-10 animate-pulse">
      {/* TITLE */}
      <div className="h-8 w-40 bg-gray-700/40 rounded mx-auto mb-8" />

      {/* ITEMS */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] border border-white/10 p-4 rounded-xl"
          >
            <div className="flex gap-4">
              <div className="w-20 h-24 bg-gray-700/40 rounded-lg" />

              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 bg-gray-700/40 rounded" />
                <div className="h-3 w-1/3 bg-gray-700/30 rounded" />
                <div className="h-4 w-1/2 bg-gray-700/40 rounded" />
                <div className="h-6 w-20 bg-gray-700/30 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-8 max-w-md ml-auto">
        <div className="h-48 bg-[#111111] border border-white/10 rounded-2xl" />
      </div>
    </div>
  );
};

const Cart = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    delivery_fee,
    addToFavorites,
    removeFromFavorites,
    buyNowItem,
    favorites = [],
    setBuyNowSafe,
    saveForLater,
    savedForLater,
    removeSavedForLater,
    moveSavedToCart,
  } = useContext(ShopContext);

  const cartTotalRef = useRef(null);

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpenKey, setCartOpenKey] = useState(0);
  const [cartFinalAmount, setCartFinalAmount] = useState(0);
  const [priceData, setPriceData] = useState(null);
  const [confirmSavedOpen, setConfirmSavedOpen] = useState(false);
  const [savedDeleteItem, setSavedDeleteItem] = useState(null);

  // delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const location = useLocation();

  const safeCartBack = () => {
    // 🚫 If cart was entered from checkout flow → always go collections
    if (
      location.state?.from === "cart-checkout" ||
      document.referrer.includes("/order-preview") ||
      document.referrer.includes("/payment")
    ) {
      navigate("/collections", { replace: true });
      return;
    }

    // 🧠 Normal browsing back
    navigate(-1);
  };

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

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
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/order/preview`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"),
            },
            body: JSON.stringify({
              items,
              paymentMethod: "preview", // cart page me COD fixed
            }),
          }
        );

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
    const shippingFee = discountedTotal >= FREE_LIMIT ? 0 : delivery_fee;

    return discountedTotal + shippingFee;
  };

  const finalTotal = computeFinalTotal();

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
          onClick={(e) => {
            e.stopPropagation();
            const newQty = Math.max(1, item.quantity - 1);
            updateQuantity(item._id, item.size, newQty);
            setValue(String(newQty));
          }}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition cursor-pointer"
        >
          −
        </button>

        {/* INPUT */}
        <input
          onClick={(e) => e.stopPropagation()}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) setValue(e.target.value);
          }}
          onBlur={commitValue}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className="w-12 sm:w-14 h-9 bg-black border border-white/20 rounded-md text-white text-center text-sm outline-none focus:border-white/40"
        />

        {/* PLUS */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const newQty = item.quantity + 1;
            updateQuantity(item._id, item.size, newQty);
            setValue(String(newQty));
          }}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition cursor-pointer"
        >
          +
        </button>
      </div>
    );
  };

  const isCartLoading =
    !isOnline ||
    loading ||
    !products.length ||
    (cartItems && Object.keys(cartItems).length > 0 && !priceData);

  if (isCartLoading) {
    return <CartPageSkeleton />;
  }

  return (
    <>
      <section className="min-h-screen bg-black text-white pt-[64px] pb-28">
        {/* ================= CART HEADER ================= */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* BACK */}
            <button
              onClick={safeCartBack}
              className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>

            {/* TITLE */}
            <div className="text-center">
              <p className="font-semibold text-medium text-xm">Your Cart</p>
            </div>

            {/* CLOSE → COLLECTIONS */}
            <button
              onClick={() => navigate("/collections")}
              className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Close cart"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* EMPTY CART MESSAGE */}
        {cartData.length === 0 && savedForLater.length === 0 && (
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
        )}

        <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-6 mt-4 sm:mt-6">
          {/* CART ITEMS */}
          {cartData.length > 0 && (
          <div className="space-y-6">
            {cartData.map((item, index) => {
              const isFavorited = favorites.includes(item._id);
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
                  className="relative bg-[#1a1a1a] border border-white/10 rounded-xl p-4 space-y-4 hover:border-white/40 transition cursor-pointer"
                >
                  {/* TOP RIGHT ACTIONS — COLUMN (sm+) */}
                  <div
                    className="
                    hidden sm:flex
                    absolute top-4 right-4
                    flex-col
                    items-end
                    gap-3
                    "
                  >
                    {/* REMOVE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteItem(item);
                        setConfirmOpen(true);
                      }}
                      className="
                      flex justify-between items-center gap-1
                      text-red-400 hover:text-red-500
                      transition
                      cursor-pointer
                      group sm:pb-10 lg:pb-12
                      "
                    >
                      <FaTrash className="group-hover:scale-110 transition" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>

                    {/* QUANTITY */}
                    <QuantityInput item={item} />
                  </div>

                  {/* TOP — IMAGE + DETAILS */}
                  <div
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="flex gap-4 cursor-pointer"
                  >
                    <img
                      src={productData.image[0]}
                      alt={productData.name}
                      className="w-20 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {productData.name}
                      </p>
                      <p className="text-xs uppercase text-gray-400">
                        {productData.brandName}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-green-500 font-semibold">
                          {currency}
                          {productData.discountedPrice}
                        </span>
                        <span className="line-through text-gray-500 text-sm">
                          {currency}
                          {productData.actualPrice}
                        </span>
                        <span className="text-red-400 text-sm font-semibold">
                          {discountPercent}% OFF
                        </span>
                      </div>

                      <span className="inline-block mt-2 text-xs bg-white/10 border border-white/20 px-2 py-1 rounded">
                        Size: {item.size}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE — MOBILE ONLY */}
                  <div className="flex sm:hidden justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteItem(item);
                        setConfirmOpen(true);
                      }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-500 transition cursor-pointer group"
                    >
                      <FaTrash className="group-hover:scale-110 transition" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>

                    <QuantityInput item={item} />
                  </div>
                  {/* BOTTOM — ACTIONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* SAVE FOR LATER */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveForLater(item);
                      }}
                      className="py-2 rounded-lg border border-white/20 text-sm text-gray-300 hover:bg-white/5 transition cursor-pointer"
                    >
                      Save for later
                    </button>

                    {/* BUY THIS NOW */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        setBuyNowSafe({
                          productId: item._id,
                          size: item.size,
                          quantity: item.quantity,
                          source: "cart",
                        });

                        navigate("/order-preview", {
                          state: { from: "cart" },
                        });
                      }}
                      className="py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition cursor-pointer"
                    >
                      Buy this now
                    </button>

                    {/* MOVE TO WISHLIST (future-ready) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (isFavorited) {
                          removeFromFavorites(item._id);
                        } else {
                          addToFavorites(item._id);
                        }
                      }}
                      className={`
                        py-2 rounded-lg text-sm font-medium transition
                        border
                        ${
                          isFavorited
                            ? "bg-pink-500/20 text-pink-400 border-pink-400 hover:bg-pink-500/30"
                            : "border-white/20 text-pink-400 hover:bg-pink-500/10 hover:border-pink-400"
                        }
                        cursor-pointer
                        `}
                    >
                      {isFavorited
                        ? "Remove from Favorites 💔"
                        : "Add to Favorites ❤️"}
                    </button>

                    {isFavorited && (
                      <span className="text-xs text-pink-400 mt-1 block">
                        Saved to your favorites
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {savedForLater?.length > 0 && (
            <div className="mt-10">
              <div className="space-y-4">
                {savedForLater?.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-4">
                      Saved for Later ({savedForLater.length})
                    </h2>

                    <div className="space-y-4">
                      {savedForLater.map((item, idx) => {
                        const product = products.find(
                          (p) => p._id === item.productId
                        );

                        if (!product) return null;

                        return (
                          <div
                            key={idx}
                            className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                          >
                            {/* LEFT */}
                            <div className="flex gap-4">
                              <img
                                src={product.image[0]}
                                alt={product.name}
                                className="w-20 h-24 object-cover rounded-lg"
                              />

                              <div>
                                <p className="font-semibold text-white">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-400 uppercase">
                                  {product.brandName}
                                </p>

                                <p className="text-sm text-gray-300 mt-1">
                                  Size:{" "}
                                  <span className="font-medium">
                                    {item.size}
                                  </span>
                                </p>

                                <p className="text-sm text-gray-300">
                                  Qty:{" "}
                                  <span className="font-medium">
                                    {item.quantity}
                                  </span>
                                </p>

                                <p className="text-green-400 font-semibold mt-1">
                                  {currency}
                                  {product.discountedPrice}
                                </p>
                              </div>
                            </div>

                            {/* RIGHT ACTIONS */}
                            <div className="flex gap-3">
                              {/* MOVE TO CART */}
                              <button
                                onClick={() => moveSavedToCart(item)}
                                className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
                              >
                                Move to Cart
                              </button>

                              {/* REMOVE PERMANENTLY */}
                              <button
                                onClick={() => {
                                  setSavedDeleteItem(item);
                                  setConfirmSavedOpen(true);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CART TOTAL (MOBILE + DESKTOP) */}
          <div className="flex justify-end my-5">
            <div
              ref={cartTotalRef}
              className="w-full sm:w-[450px] cursor-pointer"
            >
              <CartTotal forceOpenKey={cartOpenKey} priceData={priceData} />
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
              onClick={(e) => {
                e.stopPropagation();

                // 🔥 IMPORTANT: Cart checkout must clear Buy Now
                setBuyNowSafe(null);

                navigate("/order-preview", {
                  state: { from: "cart-checkout" },
                });
              }}
              className=" bg-white text-black px-6 py-3 rounded-lg font-semibold
              border border-black transition-all duration-200 hover:bg-black
              hover:text-white cursor-pointer whitespace-nowrap "
            >
              {" "}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete();
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {confirmSavedOpen && savedDeleteItem && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div
              className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-sm
                    border border-white/10 shadow-xl"
            >
              <p className="text-lg font-semibold text-white">Remove item?</p>

              <p className="text-sm text-gray-400 mt-2">
                Are you sure you want to remove this item from saved for later?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                {/* CANCEL */}
                <button
                  onClick={() => {
                    setConfirmSavedOpen(false);
                    setSavedDeleteItem(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white
                     hover:bg-white/20 transition cursor-pointer"
                >
                  Cancel
                </button>

                {/* CONFIRM REMOVE */}
                <button
                  onClick={() => {
                    removeSavedForLater(
                      savedDeleteItem.productId,
                      savedDeleteItem.size
                    );
                    setConfirmSavedOpen(false);
                    setSavedDeleteItem(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white
                     hover:bg-red-600 transition cursor-pointer"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Cart;
