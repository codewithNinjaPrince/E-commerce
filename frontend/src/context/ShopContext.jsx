import React, { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 49;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [savedForLater, setSavedForLater] = useState([]);

  const navigate = useNavigate();

  // 🔒 SAFE BUY NOW SETTER (checkout-persistent)
  const setBuyNowSafe = (item) => {
    setBuyNowItem(item);

    if (item) {
      sessionStorage.setItem("buyNowItem", JSON.stringify(item));
    } else {
      sessionStorage.removeItem("buyNowItem");
    }
  };

  /* ---------------------- LOGOUT ---------------------- */
  const logout = () => {
    // 🔥 LocalStorage clear
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");

    // 🔥 Reset all user-related state
    setToken("");
    setCartItems({});
    setFavorites([]);
    setSearch("");
    setShowSearch(false);
    setSavedForLater([]);

    toast.success("Logged out successfully 👋");
  };

  /* ---------------------- ADD TO CART ---------------------- */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);

    const storedToken = localStorage.getItem("token"); // ✅ FIX

    if (storedToken) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token: storedToken } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to save cart");
      }
    }
  };

  /* ---------------- ADD TO FAVORITES ---------------- */
  const addToFavorites = async (productId) => {
    if (!token) {
      toast.info("Please login to save favorites ❤️");
      navigate("/login");
      return;
    }

    if (favorites.includes(productId)) return;

    setFavorites((prev) => [...prev, productId]); // optimistic

    try {
      await axios.post(
        `${backendUrl}/api/favorites/add`,
        { productId },
        { headers: { token } }
      );
    } catch (error) {
      setFavorites((prev) => prev.filter((id) => id !== productId)); // rollback
    }
  };

  /* ---------------- REMOVE FROM FAVORITES ---------------- */
  const removeFromFavorites = async (productId) => {
    if (!token) return;

    setFavorites((prev) => prev.filter((id) => id !== productId));

    try {
      await axios.post(
        `${backendUrl}/api/favorites/remove`,
        { productId },
        { headers: { token } }
      );
    } catch (error) {
      setFavorites((prev) => [...prev, productId]); // rollback
    }
  };

  const getFavoriteCount = () => {
    return favorites.length;
  };

  /* ---------------------- CART COUNT ---------------------- */
  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          totalCount += cartItems[productId][size];
        }
      }
    }
    return totalCount;
  };

  /* ---------------------- UPDATE QUANTITY ---------------------- */
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      // ❌ remove size
      delete cartData[itemId]?.[size];

      // ❌ if no sizes left, remove productId
      if (cartData[itemId] && Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      // ✅ normal update
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token: storedToken } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to update cart");
      }
    }
  };

  /* ---------------------- TOTAL CART AMOUNT (UPDATED MODEL) ---------------------- */
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const itemInfo = products.find((p) => p._id === productId);

      if (!itemInfo) continue;

      // NEW MODEL SUPPORT
      const itemPrice =
        itemInfo.discountedPrice || itemInfo.actualPrice || itemInfo.price || 0;

      for (const size in cartItems[productId]) {
        const qty = cartItems[productId][size];
        if (qty > 0) {
          totalAmount += itemPrice * qty;
        }
      }
    }

    return totalAmount;
  };

  /* ---------------------- PRODUCT FETCH ---------------------- */
  const getProductsData = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/product/list");

      if (response.data.success) {
        const cleaned = response.data.products.map((p) => ({
          ...p,
          _id: typeof p._id === "object" && p._id.$oid ? p._id.$oid : p._id,
        }));
        cleaned.sort((a, b) => b.date - a.date);
        setProducts(cleaned);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  /* ---------------------- USER CART FETCH ---------------------- */
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  /* ---------------------- FETCH FAVORITES ---------------------- */
  /* ---------------- FETCH FAVORITES (CART-STYLE) ---------------- */
  const fetchFavorites = async (authToken) => {
    if (!authToken) return;

    setFavoritesLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/favorites/get`,
        {},
        { headers: { token: authToken } }
      );

      if (res.data.success) {
        setFavorites(res.data.favorites || []);
      }
    } catch (error) {
      console.error("FETCH FAVORITES ERROR:", error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const fetchSavedForLater = async (authToken) => {
    if (!authToken) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/save-for-later/get`,
        {},
        { headers: { token: authToken } }
      );

      if (res.data.success) {
        setSavedForLater(res.data.items || []);
      }
    } catch (err) {
      console.error("FETCH SAVED FOR LATER ERROR", err);
    }
  };

  const removeSavedForLater = async (productId, size) => {
  try {
    await axios.post(
      `${backendUrl}/api/cart/save-for-later/remove`,
      { productId, size },
      { headers: { token } }
    );

    setSavedForLater((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  } catch (err) {
    toast.error("Failed to remove item");
  }
};

const moveSavedToCart = async (item) => {
  try {
    // 1️⃣ Add to cart
    await updateQuantity(item.productId, item.size, item.quantity);

    // 2️⃣ Remove from saved (backend + local)
    await removeSavedForLater(item.productId, item.size);

    toast.success("Moved to cart");
  } catch {
    toast.error("Failed to move item");
  }
};


  //  useEffect(() => {
  //   const saved = localStorage.getItem("token");
  //   if (saved && products.length > 0) {
  //     setToken(saved);
  //     getUserCart(saved);
  //   }
  // }, [products]);

  // useEffect(() => {
  //   const saved = localStorage.getItem("token");
  //   if (saved) {
  //     fetchFavorites(saved);
  //   }
  // }, []);

  useEffect(() => {
    const bootstrapApp = async () => {
      const savedToken = localStorage.getItem("token");

      try {
        await getProductsData();

        if (savedToken) {
          setToken(savedToken);
          await Promise.all([
            getUserCart(savedToken),
            fetchFavorites(savedToken),
            fetchSavedForLater(savedToken),
          ]);
        }

        // ✅ BUY NOW RECOVERY
        const storedBuyNow = sessionStorage.getItem("buyNowItem");
        if (storedBuyNow) {
          setBuyNowItem(JSON.parse(storedBuyNow));
        }
      } catch (err) {
        console.error("BOOTSTRAP ERROR:", err);
      } finally {
        setAppLoading(false);
      }
    };

    bootstrapApp();
  }, []);

  const saveForLater = async (item) => {
    if (!token) {
      toast.info("Please login to save items");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/cart/save-for-later`,
        {
          productId: item._id,
          size: item.size,
          quantity: item.quantity,
        },
        { headers: { token } }
      );

      // remove from cart
      updateQuantity(item._id, item.size, 0);

      // add locally (instant UI)
      setSavedForLater((prev) => {
        const exists = prev.some(
          (p) => p.productId === item._id && p.size === item.size
        );

        if (exists) return prev;

        return [
          ...prev,
          {
            productId: item._id,
            size: item.size,
            quantity: item.quantity,
          },
        ];
      });

      toast.success("Saved for later");
    } catch (err) {
      toast.error("Failed to save item");
    }
  };

  /* ---------------------- CONTEXT VALUE ---------------------- */
  const value = {
    products,
    currency,
    delivery_fee,
    appLoading,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    getUserCart,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    logout,
    setToken,
    setCartItems,
    favorites,
    favoritesLoading,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    getFavoriteCount,
    buyNowItem,
    setBuyNowSafe,
    savedForLater,
    fetchSavedForLater,
    saveForLater,
    removeSavedForLater,
    moveSavedToCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
