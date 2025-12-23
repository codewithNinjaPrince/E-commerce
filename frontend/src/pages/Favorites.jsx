import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { FaHeart } from "react-icons/fa";

const Favorites = () => {
  const {
    products,
    favorites,
    favoritesLoading,
    token,
    navigate,
  } = useContext(ShopContext);

  const [favoriteProducts, setFavoriteProducts] = useState([]);

  /* -------- AUTH GUARD -------- */
  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=/favorites");
    }
  }, [token]);

  /* -------- MAP FAVORITES (LIKE CART DATA BUILD) -------- */
  useEffect(() => {
    if (products.length > 0 && favorites.length > 0) {
      const data = products.filter((p) => favorites.includes(p._id));
      setFavoriteProducts(data);
    } else {
      setFavoriteProducts([]);
    }
  }, [products, favorites]);

  /* -------- LOADING -------- */
  if (favoritesLoading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 text-sm animate-pulse">
          Loading your favorites… ❤️
        </p>
      </div>
    );
  }

  /* -------- EMPTY STATE -------- */
  if (!favoritesLoading && favoriteProducts.length === 0) {
    return (
      <div className="pt-20 flex flex-col items-center text-white text-center">
        <FaHeart className="text-5xl text-gray-500 mb-4" />
        <p className="text-xl font-semibold">No favorites yet</p>
        <p className="text-gray-400 mt-2 text-sm">
          Tap the heart icon on products you love
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

  /* -------- FAVORITES LIST -------- */
  return (
    <div className="px-2 sm:px-[2] md:px-[4] pt-6 sm:pt-[8] md:pt-[10] pb-12 sm:pb-[6] md:pb-[8] text-white">
      <div className="text-3xl mb-3 sm:mb-[5] lg:mb-8 text-center">
        <Title text1="Your" text2="Favorites" />
      </div>

      <div
        className="
          grid grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-4 sm:gap-5
        "
      >
        {favoriteProducts.map((item) => (
          <ProductItem key={item._id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
