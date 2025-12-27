import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="bg-[#0e0e0e] text-white animate-pulse">
      <div
        className="
          w-full
          2xl:max-w-[1800px] 2xl:mx-auto
          px-[6px] py-[6px]
          md:px-[5px] md:py-[5px]
        "
      >
        <div className="flex flex-col lg:flex-row gap-5">
          {/* LEFT IMAGE AREA */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Thumbnails */}
            <div className="hidden sm:flex flex-col gap-3 w-[70px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-14 aspect-square bg-white/10 rounded-lg"
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full lg:w-[520px] h-[520px] lg:h-[700px] bg-white/10 rounded-xl" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Brand */}
            <div className="h-4 w-32 bg-white/10 rounded" />

            {/* Title */}
            <div className="h-8 w-3/4 bg-white/10 rounded" />

            {/* Rating */}
            <div className="h-4 w-40 bg-white/10 rounded" />

            {/* Price */}
            <div className="flex gap-4">
              <div className="h-8 w-28 bg-white/10 rounded" />
              <div className="h-6 w-20 bg-white/10 rounded" />
            </div>

            {/* Size selector */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-16 bg-white/10 rounded-md"
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <div className="h-14 flex-1 bg-white/10 rounded-md" />
              <div className="h-14 flex-1 bg-white/10 rounded-md" />
            </div>

            {/* Description */}
            <div className="space-y-2 mt-4">
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-5/6 bg-white/10 rounded" />
              <div className="h-4 w-4/6 bg-white/10 rounded" />
            </div>

            {/* Delivery info */}
            <div className="h-4 w-64 bg-white/10 rounded mt-4" />
          </div>
        </div>

        {/* RELATED PRODUCTS PLACEHOLDER */}
        <div className="mt-10">
          <div className="h-6 w-40 bg-white/10 rounded mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-white/10 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
