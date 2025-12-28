const ProductItemSkeleton = () => {
  return (
    <div className="animate-pulse product-card">
      {/* IMAGE */}
      <div className="w-full h-52 bg-gray-700/50 rounded-xl mb-4" />

      {/* DETAILS */}
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-700/40 rounded w-1/3" />
        <div className="h-4 bg-gray-700/50 rounded w-full" />
        <div className="h-4 bg-gray-700/40 rounded w-5/6" />

        <div className="flex gap-2 mt-3">
          <div className="h-4 bg-gray-700/40 rounded w-16" />
          <div className="h-4 bg-gray-700/50 rounded w-20" />
        </div>

        <div className="flex gap-2 mt-4 mb-4">
          <div className="w-10 h-10 bg-gray-700/50 rounded-lg" />
          <div className="flex-1 h-10 bg-gray-700/40 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductItemSkeleton;

