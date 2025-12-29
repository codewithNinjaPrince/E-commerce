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

  const navigate = useNavigate();

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
        // 1️⃣ Fetch products (public)
        await getProductsData();

        if (savedToken) {
          setToken(savedToken);

          // 2️⃣ Fetch user-specific data in parallel
          await Promise.all([
            getUserCart(savedToken),
            fetchFavorites(savedToken),
          ]);
        }
      } catch (err) {
        console.error("BOOTSTRAP ERROR:", err);
      } finally {
        // 3️⃣ App is ready (even if some API failed)
        setAppLoading(false);
      }
    };

    bootstrapApp();
  }, []);

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
    setBuyNowItem,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
