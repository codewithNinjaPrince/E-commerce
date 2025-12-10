// Animations
<style>
  {`
    .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
    .animate-scaleIn { animation: scaleIn 0.2s ease-out; }

    @keyframes fadeIn {
      from { opacity: 0; } 
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; } 
      to { transform: scale(1); opacity: 1; }
    }
  `}
</style>;

import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaBox } from "react-icons/fa";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("merchantToken");

      const response = await axios.get(
        `${backendUrl}/api/merchant/product/list`,
        { headers: { token } }
      );

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.log("Error loading products:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE PRODUCT (NO BROWSER ALERT ANYMORE)
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("merchantToken");

      const response = await axios.post(
        `${backendUrl}/api/merchant/product/remove`,
        { productId: id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="
    w-full max-w-[1600px] mx-auto 
    p-4 sm:p-6 text-white 
    pt-[30px] sm:pt-[60px] lg:pt-[50px]
  "
    >
      {/* WRAPPER */}
      <div className="max-w-5xl mx-auto w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FaBox className="text-blue-400" /> My Products
          </h2>

          <a
            href="/add-product"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer"
          >
            <FaPlus /> Add Product
          </a>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-400 py-20">
            <div className="w-8 h-8 mx-auto border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4">Loading products...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="bg-[#151515] border border-[#222] rounded-xl mt-10 py-20 text-center">
            <FaBox className="text-5xl mx-auto mb-4 text-gray-500" />
            <p className="text-xl font-semibold">No products found</p>
            <p className="text-gray-500 mt-1">
              Start adding your first product
            </p>

            <a
              href="/add-product"
              className="inline-block mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
            >
              Add Product
            </a>
          </div>
        )}

        {/* GRID */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-4 
                hover:border-blue-600/40 hover:scale-[1.02] transition shadow-md cursor-pointer"
              >
                <div className="w-full h-48 rounded-lg bg-[#0a0a0a] border border-[#222] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image?.[0] || "/no-image.png"}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                    onError={(e) => (e.target.src = "/no-image.png")}
                  />
                </div>

                <h3 className="text-lg font-bold mt-3">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.brandName}</p>
                <p className="mt-1 font-semibold text-blue-400">
                  ₹{product.discountedPrice}
                </p>

                <div className="flex justify-between items-center mt-4">
                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => {
                      setDeleteId(product._id);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 
                    rounded-lg text-sm cursor-pointer shadow hover:scale-[1.02] transition"
                  >
                    <FaTrash /> Delete
                  </button>

                  {/* EDIT BUTTON */}
                  <a
                    href={`/products/edit/${product._id}`}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 px-3 py-1
  rounded-lg text-sm cursor-pointer shadow hover:scale-[1.02] transition"
                  >
                    <FaEdit /> Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl w-[90%] max-w-sm shadow-xl animate-scaleIn">
            <h2 className="text-xl font-bold text-red-400">Delete Product?</h2>
            <p className="text-gray-300 mt-2">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  deleteProduct(deleteId);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
