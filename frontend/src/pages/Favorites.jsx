import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { FaHeart } from "react-icons/fa";
import ProductItemSkeleton from "../components/ProductItemSkeleton";
import { useLayoutEffect } from "react";

const FavoritesPageSkeleton = () => {
  return (
    <section>
      <div
        className="
          bg-black/90
          border border-white/10
          rounded-xl
          shadow-[0_0_40px_rgba(255,255,255,0.06)]
          mt-6 mb-6
          sm:mt-8 sm:mb-8
          lg:mt-10 lg:mb-10
        "
      >
        <div className="w-full sm:px-2 md:px-3 lg:px-4">
          {/* HEADER SKELETON */}
          <div className="text-center py-8 animate-pulse">
            <div className="h-8 w-64 mx-auto bg-gray-700/40 rounded" />
            <div className="h-4 w-3/4 mx-auto bg-gray-700/30 rounded mt-4" />
          </div>

          {/* PRODUCT GRID SKELETON */}
          <div
            className="
              mt-6
              grid
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
              gap-4 sm:gap-5
            "
          >
            {Array.from({ length: 10 }).map((_, i) => (
              
                <ProductItemSkeleton />
            ))}
          </div>

          <div className="pb-6"></div>
        </div>
      </div>
    </section>
  );
};

const Favorites = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const { products, favorites, favoritesLoading, token, navigate, appLoading } =
    useContext(ShopContext);

  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  

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

  /* -------- AUTH GUARD -------- */
  useEffect(() => {
  if (!appLoading && !token) {
    navigate("/login?redirect=/favorites");
  }
}, [appLoading, token]);


  /* -------- MAP FAVORITES -------- */
  useEffect(() => {
    if (products.length && favorites.length) {
      setFavoriteProducts(products.filter((p) => favorites.includes(p._id)));
    } else {
      setFavoriteProducts([]);
    }
  }, [products, favorites]);

  if (!isOnline || appLoading || favoritesLoading) {
  return <FavoritesPageSkeleton />;
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
              Products you’ve loved and saved for later ❤️ Revisit your favorite
              picks anytime and never miss out.
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
                <div key={item._id} className="bg-[#2a2a2a] rounded-xl p-2">
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
