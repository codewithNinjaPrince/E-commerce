import React, { useEffect, useContext, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import { FaShareAlt, FaHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { useLayoutEffect } from "react";
import ProductSkeleton from "../components/ProductSkeleton";
import SizeSelectorModal from "../components/SizeSelectorModal";

const showCartToast = (message = "Added to cart 🛒") => {
  const isMobile = window.innerWidth < 768;

  toast.success(message, {
    position: isMobile ? "bottom-center" : "top-right",
    autoClose: 1800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: "dark",
    style: {
      marginBottom: isMobile ? "90px" : "0px", // 👈 sticky bar se upar
      borderRadius: "14px",
      background: "#111",
      color: "#fff",
      fontWeight: 500,
      boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
    },
  });
};

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [productId]);

  const {
    products,
    currency,
    addToCart,
    favorites = [],
    addToFavorites,
    removeFromFavorites,
    buyNowItem,
    setBuyNowItem,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [adding, setAdding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullView, setShowFullView] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const isDesktop = window.innerWidth >= 1024;

  const LENS_SIZE = 120;

  const [lens, setLens] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const location = useLocation();
  const fromOrderPreview =
    new URLSearchParams(location.search).get("from") === "orderpreview";

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: productData.description?.slice(0, 100),
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled → ignore
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Product link copied!", { autoClose: 2000 });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDesktop) return;

    const rect = e.currentTarget.getBoundingClientRect();

    let x = e.clientX - rect.left - LENS_SIZE / 2;
    let y = e.clientY - rect.top - LENS_SIZE / 2;

    x = Math.max(0, Math.min(x, rect.width - LENS_SIZE));
    y = Math.max(0, Math.min(y, rect.height - LENS_SIZE));

    setLens({ x, y });

    setZoomPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const touchStartX = useRef(0);

  // const [showFullView, setShowFullView] = useState(false);

  const token = localStorage.getItem("token");
  const isFav = token && favorites.includes(productId);

  const goNext = () => {
    if (images.length <= 1) return;
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    setImage(images[next]);
  };

  const goPrev = () => {
    if (images.length <= 1) return;
    const prev = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prev);
    setImage(images[prev]);
  };

  const getDeliveryDateRange = () => {
    const start = new Date();
    const end = new Date();

    start.setDate(start.getDate() + 7);
    end.setDate(end.getDate() + 10);

    const options = { day: "numeric", month: "short" };

    return `${start.toLocaleDateString(
      "en-IN",
      options
    )} – ${end.toLocaleDateString("en-IN", options)}`;
  };

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (!found) return;

    setProductData(null);
    setImage("");
    setSize("");
    setCurrentIndex(0);
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      setProductData(found);
      const imgs = Array.isArray(found.image) ? found.image : [found.image];
      setImage(imgs[0]);
    });

    setProductData(found);

    const imgs = Array.isArray(found.image) ? found.image : [found.image];

    setCurrentIndex(0);
    setImage(imgs[0]);
  }, [productId, products]);

  /* ---------------- SEO META ---------------- */
  useEffect(() => {
    if (!productData) return;

    document.title = `${productData.name} | Brawvly`;

    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = productData.description?.slice(0, 150) || "";
  }, [productData]);

  /* ---------------- SCHEMA ---------------- */
  useEffect(() => {
    if (!productData) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: productData.name,
      image: Array.isArray(productData.image)
        ? productData.image
        : [productData.image],
      description: productData.description,
      brand: {
        "@type": "Brand",
        name: productData.brandName || "Brawvly",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: productData.discountedPrice,
        availability: "https://schema.org/InStock",
      },
    });

    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [productData]);

  /* ---------------- CANONICAL ---------------- */
  useEffect(() => {
    if (!productData) return;

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `https://www.brawvly.com/product/${productData._id}`;
  }, [productData]);

  /* ---------------- GUARD ---------------- */
  if (!productData) {
    return <ProductSkeleton />;
  }

  /* ---------------- SAFE DERIVED VALUES ---------------- */
  const images = Array.isArray(productData.image)
    ? productData.image
    : [productData.image];

  const rating = Number.isFinite(Number(productData.review))
    ? Math.min(5, Math.floor(Number(productData.review)))
    : 0;

  /* ---------------- HANDLERS ---------------- */
  const handleAddToCartClick = () => {
    if (!token) {
      navigate(`/login?redirect=/product/${productId}`);
      return;
    }

    if (!size) {
      setActionType("add");
      setShowSizeModal(true);
      return;
    }

    addToCart(productData._id, size);
    showCartToast("Added to cart 🛒");
  };

  const handleBuyNowClick = () => {
    if (!token) {
      navigate(`/login?redirect=/product/${productId}`);
      return;
    }

    if (!size) {
      setActionType("buy");
      setShowSizeModal(true);
      return;
    }

    setBuyNowItem({
      productId: productData._id,
      size,
      quantity: 1,
    });

    showCartToast("Item added • Taking you to cart");

    setTimeout(() => {
      navigate("/order-preview");
    }, 600); // 👈 toast feel aane do
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="bg-[#0e0e0e] text-white">
        <div
          className="
          w-full
          2xl:max-w-[1800px] 2xl:mx-auto
          px-[6px] py-[6px]
          md:px-[5px] md:py-[5px]
          "
        >
          {/* MAIN GRID */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* ============== LEFT IMAGE SECTION ============== */}
            <div
              className="
              flex flex-col-reverse
              sm:flex-row
              gap-2
              
              lg:flex-none
              lg:max-w-[680px]
              xl:max-w-[720px]
              2xl:max-w-[760px]
              "
            >
              {/* ⭐ MOBILE THUMBNAILS (Horizontal Scroll) */}
              <div className="flex sm:hidden gap-3 overflow-x-auto px-1">
                {productData.image.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImage(img)}
                    className={`
                    w-14 aspect-square rounded-xl overflow-hidden
                    border transition cursor-pointer
                    ${
                      image === img
                        ? "border-white scale-105"
                        : "border-gray-500"
                    }
                    `}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* ⭐ DESKTOP THUMBNAILS (Hover changes main image) */}
              <div className="hidden sm:flex flex-col items-center w-[70px]">
                <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar w-full pt-3 md:pt-5 lg:pt-1 px-1">
                  {productData.image.map((img, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={() => setImage(img)} // 🖱 hover support
                      onClick={() => setImage(img)} // 👆 click support
                      className={`
                      w-14 aspect-square rounded-[12%]
                      overflow-hidden border transition
                      cursor-pointer
                      ${
                        image === img
                          ? "border-white scale-105"
                          : "border-gray-400 hover:border-white/70"
                      }
                      `}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* MAIN IMAGE */}
              <div className="relative w-full pt-3 md:pt-5 lg:pt-0">
                <div
                  className="
                  relative
                  w-full
                  
                  /* 📱 Mobile / Tablet */
                  aspect-[3/4]
                  
                  /* 🖥 Desktop overrides */
                  lg:aspect-auto
                  lg:w-[520px]
                  lg:min-w-[520px]
                  lg:max-w-[520px]
                  lg:min-h-[700px]
                  lg:max-h-[700px]
                  
                  bg-[#0e0e0e]
                  rounded-[10px]
                  overflow-hidden
                  
                  flex items-center justify-center
                  "
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    const diff =
                      e.changedTouches[0].clientX - touchStartX.current;
                    if (diff > 50) goPrev();
                    if (diff < -50) goNext();
                  }}
                >
                  {/* IMAGE */}
                  <div
                    className="relative w-full cursor-pointer"
                    onMouseEnter={() => isDesktop && setIsHovering(true)}
                    onMouseLeave={() => isDesktop && setIsHovering(false)}
                    onMouseMove={handleMouseMove}
                  >
                    {/* IMAGE – MOBILE & TABLET */}
                    <img
                      src={image}
                      alt={productData.name}
                      className="
                      block lg:hidden
                      w-full h-full
                      object-cover
                      bg-[#0e0e0e]
                      "
                    />

                    {/* IMAGE – DESKTOP (hover zoom enabled) */}
                    <div
                      className="hidden lg:block relative w-full h-full"
                      onMouseEnter={() => setShowZoom(true)}
                      onMouseLeave={() => setShowZoom(false)}
                      onMouseMove={handleMouseMove}
                    >
                      <img
                        src={image}
                        alt={productData.name}
                        className={`w-full h-full object-contain transition ${
                          showZoom ? "scale-[1.02] opacity-80" : ""
                        }`}
                      />

                      {/* LENS */}
                      {showZoom && (
                        <div
                          className="absolute border border-white rounded-lg bg-white/10 pointer-events-none"
                          style={{
                            width: 120,
                            height: 120,
                            left: lens.x,
                            top: lens.y,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* FULL VIEW (MOBILE ONLY) */}
                  <button
                    onClick={() => setShowFullView(true)}
                    className="
                    lg:hidden
                    absolute top-3 left-3
                    bg-black/60 text-white
                    px-2 py-1
                    rounded-md
                    text-sm
                    z-20
                    cursor-pointer
                    "
                  >
                    ⛶
                  </button>

                  {/* SHARE */}
                  <button
                    onClick={handleShare}
                    className="
                    absolute top-3 right-3
                    bg-black/60 p-2 rounded-full
                    hover:bg-black/80 hover:scale-110
                    transition z-10 cursor-pointer
                    "
                  >
                    <FaShareAlt />
                  </button>

                  {/* FAVORITE */}
                  <button
                    onClick={() => {
                      if (!token) {
                        toast.error("Please login to continue");
                        navigate(`/login?redirect=/product/${productId}`);
                        return;
                      }

                      isFav
                        ? removeFromFavorites(productId)
                        : addToFavorites(productId);
                    }}
                    className="
                    absolute bottom-3 right-3
                    bg-black/60 p-2 rounded-full
                    hover:scale-110 transition z-10
                    cursor-pointer
                    "
                  >
                    <FaHeart
                      size={18}
                      className={isFav ? "text-red-500" : "text-white"}
                    />
                  </button>

                  {/* RATING */}
                  <div
                    className="
                    lg:hidden absolute bottom-3 left-3
                    bg-black/90 px-2 py-1 rounded-md
                    flex items-center gap-1
                    hover:scale-105 transition z-10
                    "
                  >
                    <FaStar className="text-yellow-500" size={12} />
                    <span className="text-sm font-semibold">
                      {Number.isFinite(Number(productData.review))
                        ? Number(productData.review).toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-white text-xs">
                      ({productData.noOfPeopleReviewed || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* ================= FULL SCREEN IMAGE VIEW (MOBILE) ================= */}
            {showFullView && (
              <div
                className="
              fixed inset-0 z-[999]
              bg-black
              flex flex-col
              justify-between
              
              px-3 py-4   /* 👈 mobile safe padding */
              "
              >
                {/* ❌ CLOSE BUTTON */}
                <button
                  onClick={() => setShowFullView(false)}
                  className="absolute top-4 right-4 text-red-500 text-3xl z-50"
                >
                  ✕
                </button>

                {/* 🖼 MAIN IMAGE */}
                <div
                  className="flex-1 flex items-center justify-center overflow-hidden"
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    const diff =
                      e.changedTouches[0].clientX - touchStartX.current;
                    if (diff > 50) goPrev();
                    if (diff < -50) goNext();
                  }}
                >
                  <img
                    src={images[currentIndex]}
                    alt="Full view"
                    className="
                    w-full h-full
                    object-cover
                    rounded-md
                    select-none
                    "
                  />
                </div>

                {/* 👇 THUMBNAILS STRIP */}
                <div
                  className="
                  mt-4
                  flex gap-3
                  overflow-x-auto
                  pb-2
                  "
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setImage(img);
                      }}
                      className={`
                      w-16 h-20
                      flex-shrink-0
                      rounded-md
                      overflow-hidden
                      border
                      ${
                        idx === currentIndex
                          ? "border-white scale-105"
                          : "border-white/30"
                      }
                      `}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ============== RIGHT DETAILS SECTION ============== */}
            <div
              className="
              flex-1
              text-white
              relative
              
              flex flex-col
              lg:min-h-full
              "
            >
              {/* ================= DESKTOP ZOOM VIEW ================= */}
              {isDesktop && showZoom ? (
                <div
                  className="
                w-full
                rounded-lg
                border border-white/10
                bg-black
                
                lg:min-h-[700px]
                lg:max-h-[700px]
                "
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "200%",
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
              ) : (
                <>
                  {/* ========== TOP CONTENT ========== */}
                  <div className="flex flex-col gap-6">
                    {/* Brand */}
                    <p
                      className="text-xl uppercase text-gray-400 cursor-pointer"
                      onClick={() =>
                        navigate(`/seller/${productData.brandName || "store"}`)
                      }
                    >
                      {productData.brandName}
                    </p>

                    {/* Name */}
                    <h1 className="font-semibold text-2xl leading-tight">
                      {productData.name}
                    </h1>

                    {/* RATING (DESKTOP) */}
                    <div className="hidden lg:flex items-center gap-1.5">
                      {Array.from({ length: rating }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" size={16} />
                      ))}
                      <p className="pl-3 text-gray-400 text-sm">
                        ({productData.noOfPeopleReviewed})
                      </p>
                    </div>

                    <p className="text-sm uppercase tracking-wide text-green-400">
                      Discounted Price
                    </p>

                    {/* PRICE */}
                    <div className="flex items-center gap-4">
                      <p className="text-3xl font-bold text-green-500">
                        {currency} {productData.discountedPrice}
                      </p>
                      <p className="line-through text-gray-400 text-xl">
                        {currency} {productData.actualPrice}
                      </p>
                      <p className="text-red-500 font-semibold text-lg">
                        {Math.round(
                          ((productData.actualPrice -
                            productData.discountedPrice) /
                            productData.actualPrice) *
                            100
                        )}
                        % OFF
                      </p>
                    </div>

                    {/* SIZE SELECTOR */}
                    <div className="flex flex-col gap-3">
                      <p className="font-medium">Select Size</p>

                      <div className="flex gap-4 flex-wrap">
                        {productData.sizes.map((s) => {
                          const isSelected = size === s;

                          return (
                            <button
                              key={s}
                              onClick={() =>
                                setSize((prev) => (prev === s ? "" : s))
                              }
                              className={`
                              py-2 px-5 rounded-md border
                              cursor-pointer
                              transition-all duration-200
                              
                              ${
                                isSelected
                                  ? "bg-white text-black font-semibold scale-105 border-white"
                                  : "bg-black text-white border-gray-500"
                              }
                              
                              /* 🖥 Desktop hover */
                              hover:scale-105
                              hover:border-white
                              hover:bg-white
                              hover:text-black
                              
                              /* 📱 Mobile tap */
                              active:scale-95
                              `}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* MOBILE & TABLET STICKY ACTION BAR */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 flex">
                      <button
                        onClick={handleAddToCartClick}
                        className="w-1/2 py-4 text-center font-semibold bg-white text-black active:scale-95 cursor-pointer"
                      >
                        ADD TO CART
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNowClick();
                        }}
                        className="w-1/2 py-4 text-center font-semibold bg-orange-500 text-black active:scale-95"
                      >
                        BUY NOW
                      </button>
                    </div>

                    {/* DESKTOP ACTION BUTTONS */}
                    <div className="hidden lg:flex gap-4 cursor-pointer">
                      <button
                        onClick={handleAddToCartClick}
                        className="flex-1 py-4 font-semibold bg-white text-black rounded-md hover:scale-[1.05] transition cursor-pointer  hover:text-black/80 hover:bg-white/80"
                      >
                        ADD TO CART
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNowClick();
                        }}
                        className="flex-1 py-4 font-semibold bg-orange-500 text-black rounded-md hover:scale-[1.05] transition cursor-pointer hover:text-black/80 hover:bg-orange-400/80"
                      >
                        BUY NOW
                      </button>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-gray-400 leading-relaxed">
                      {productData.description}
                    </p>

                    {/* DELIVERY INFO */}
                    <div className="flex items-start gap-2 md:text-2xl text-gray-400">
                      <span className="text-green-400 font-medium">
                        🚚 Delivery:
                      </span>
                      <span>
                        Expected by{" "}
                        <span className="text-white font-medium">
                          {getDeliveryDateRange()}
                        </span>
                      </span>
                    </div>

                    {adding && (
                      <p className="text-gray-400 text-sm animate-pulse">
                        Adding this masterpiece… Stay stylish 😎
                      </p>
                    )}
                  </div>

                  {/* ========== BOTTOM CONTENT (ALIGNED WITH IMAGE BOTTOM) ========== */}
                  <div className="text-sm text-gray-500 mt-5">
                    <p>✔ 100% Original Product</p>
                    <p>✔ Cash on Delivery Available</p>
                    <p>✔ Easy 7-Day Return & Exchange</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RELATED */}
          <RelatedProducts
            category={productData.category}
            subCategory={productData.subCategory}
          />
        </div>
      </div>
      <SizeSelectorModal
        open={showSizeModal}
        sizes={productData.sizes}
        onClose={() => {
          setShowSizeModal(false);
          setActionType(null);
        }}
        onConfirm={(selectedSize) => {
          setShowSizeModal(false);
          setSize(selectedSize);

          if (actionType === "add") {
            addToCart(productData._id, selectedSize);
            showCartToast("Added to cart 🛒");
          }

          if (actionType === "buy") {
            setBuyNowItem({
              productId: productData._id,
              size: selectedSize,
              quantity: 1,
            });
            showCartToast("Perfect fit selected 🖤");
          }

          if (actionType === "buy") {
            setTimeout(() => navigate("/order-preview"), 600);
          }

          setActionType(null);
        }}
      />
    </>
  );
};

export default Product;
