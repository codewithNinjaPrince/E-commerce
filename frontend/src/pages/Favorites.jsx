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

  /* -------- MAP FAVORITES -------- */
  useEffect(() => {
    if (products.length && favorites.length) {
      setFavoriteProducts(
        products.filter((p) => favorites.includes(p._id))
      );
    } else {
      setFavoriteProducts([]);
    }
  }, [products, favorites]);

  /* -------- LOADING -------- */
  if (favoritesLoading) {
    return (
      <div className="pt-28 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 text-sm animate-pulse">
          Loading your favorites… ❤️
        </p>
      </div>
    );
  }

  return (
    <section>
      <div
        className="
          bg-black/90
          border border-white/10
          rounded-xl
          overflow-hidden
          shadow-[0_0_40px_rgba(255,255,255,0.06)]
          mt-6 mb-6
          sm:mt-8 sm:mb-8
          lg:mt-10 lg:mb-10
        "
      >
        <div className="w-full sm:px-2 md:px-3 lg:px-4">

          {/* HEADER */}
          <div className="text-center text-white py-4 sm:py-6 md:py-8">
            <div className="text-2xl sm:text-3xl md:text-4xl">
              <Title text1="Your" text2="Favorites" />
            </div>

            <p className="mt-3 w-full sm:w-4/5 md:w-3/4 mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-gray-400">
              Products you’ve loved and saved for later ❤️  
              Revisit your favorite picks anytime and never miss out.
            </p>
          </div>

          {/* EMPTY STATE */}
          {!favoritesLoading && favoriteProducts.length === 0 && (
            <div className="flex flex-col items-center text-center py-16 text-white">
              <FaHeart className="text-5xl text-gray-500 mb-4" />
              <p className="text-xl font-semibold">No favorites yet</p>
              <p className="text-gray-400 mt-2 text-sm">
                Tap the heart icon on products you love
              </p>

              <button
                onClick={() => navigate("/collections")}
                className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
              >
                Browse Products →
              </button>
            </div>
          )}

          {/* FAVORITES GRID */}
          {favoriteProducts.length > 0 && (
            <div
              className="
                mt-6
                grid
                grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
                gap-4 sm:gap-5
              "
            >
              {favoriteProducts.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#2a2a2a] rounded-xl p-2"
                >
                  <ProductItem {...item} />
                </div>
              ))}
            </div>
          )}

          {/* FOOT SPACE */}
          <div className="pb-4 sm:pb-6 md:pb-8"></div>

        </div>
      </div>
    </section>
  );
};

export default Favorites;
