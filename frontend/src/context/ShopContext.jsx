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

  const navigate = useNavigate();

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

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      toast.success("Item added to cart");
    }
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
    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
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

  /* ---------------------- EFFECTS ---------------------- */
  useEffect(() => {
    getProductsData();
  }, []);

 useEffect(() => {
  const saved = localStorage.getItem("token");
  if (!token && saved) {
    setToken(saved);
    getUserCart(saved);
  }
}, [token]);


  /* ---------------------- CONTEXT VALUE ---------------------- */
  const value = {
    products,
    currency,
    delivery_fee,
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
    setToken,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
