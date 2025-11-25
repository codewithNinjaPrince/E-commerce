import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        backendUrl + "/api/user/admin/sellers",
        { headers: { token } }
      );

      if (response.data.success) {
        setSellers(response.data.sellers);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSellers();
  }, []);

  /* =============================
       PRELOADER COMPONENT
  ============================= */
  const Loader = () => (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

      <p className="mt-6 text-lg font-semibold text-gray-700">
        Fetching Sellers…
      </p>
      <p className="text-sm mt-1 text-gray-500">
        Hold on, preparing your seller dashboard
      </p>
    </div>
  );

  // Show loader
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-6 tracking-wide text-gray-900">
        All Sellers
      </h2>

      <div className="bg-white backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200">
        {sellers.length === 0 ? (
          <p className="text-gray-600 text-center py-6 text-lg">
            No sellers found.
          </p>
        ) : (
          <div className="grid gap-4">

            {sellers.map((seller) => (
              <div
                key={seller._id}
                className="p-5 rounded-xl shadow-md bg-white hover:shadow-lg transition border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{seller.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{seller.email}</p>
                </div>

                <span className="text-sm font-semibold bg-gradient-to-br from-black via-gray-900 to-black text-white px-3 py-1 rounded-full shadow">
                  {seller.shopId}
                </span>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Sellers;
