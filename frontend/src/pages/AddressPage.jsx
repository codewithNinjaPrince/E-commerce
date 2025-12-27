import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useLayoutEffect } from "react";

import {
  FaArrowLeft,
  FaTimes,
  FaHome,
  FaMapMarkerAlt,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

/* ================= SKELETON ================= */
const AddressSkeleton = () => (
  <div className="p-4 rounded-xl border border-white/10 animate-pulse">
    <div className="h-4 w-32 bg-white/20 rounded mb-2" />
    <div className="h-3 w-full bg-white/10 rounded mb-1" />
    <div className="h-3 w-2/3 bg-white/10 rounded" />
  </div>
);

const AddressPage = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);

  const token = localStorage.getItem("token");

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ADDRESSES ================= */

 
  const loadAddresses = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${backendUrl}/api/address/get`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (res.data.success) {
        setAddresses(res.data.addresses || []);

        const saved =
          localStorage.getItem("selectedAddressId") ||
          res.data.selectedAddressId ||
          "";

        setSelectedId(saved);
        setPendingId(saved);
      } else {
        setError("Unable to load addresses");
      }
    } catch {
      setError("Unable to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/address/delete/${id}`, {
        headers: { token },
      });

      toast.success("Address deleted");

      setAddresses((prev) => prev.filter((a) => a.addressId !== id));

      if (selectedId === id) {
        localStorage.removeItem("selectedAddressId");
        setSelectedId("");
        setPendingId("");
      }
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [token]);

  /* ================= FILTER ================= */
  const filtered = addresses.filter((a) =>
    `
    ${a.name}
    ${a.phone}
    ${a.alternatePhone || ""}
    ${a.email || ""}
    ${a.houseNo}
    ${a.street}
    ${a.locality}
    ${a.landmark || ""}
    ${a.city}
    ${a.district || ""}
    ${a.state}
    ${a.pincode}
    ${a.country}
    ${a.type}
  `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  //   const useMyLocation = () => {
  //   if (!navigator.geolocation) {
  //     toast.error("Location not supported");
  //     return;
  //   }

  //   setLocating(true);

  //   navigator.geolocation.getCurrentPosition(
  //     async ({ coords }) => {
  //       try {
  //         const res = await axios.get(
  //           "https://nominatim.openstreetmap.org/reverse",
  //           {
  //             params: {
  //               lat: coords.latitude,
  //               lon: coords.longitude,
  //               format: "json",
  //             },
  //           }
  //         );

  //         const a = res.data.address || {};
  //         setFormData((p) => ({
  //           ...p,
  //           city: a.city || a.town || a.village || "",
  //           district: a.state_district || a.county || "",
  //           state: a.state || "",
  //         }));

  //         toast.success("Location detected. Please verify pincode.");
  //       } catch {
  //         toast.error("Failed to fetch location");
  //       }
  //       setLocating(false);
  //     },
  //     () => {
  //       toast.error("Location permission denied");
  //       setLocating(false);
  //     }
  //   );
  // };


  return (
    <section className="min-h-screen mt-4 lg:mt-0 bg-black text-white overflow-x-hidden">
      {/* ================= FIXED HEADER ================= */}
<div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
  <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">

    {/* LEFT */}
    <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
      aria-label="Go back"
    >
      <FaArrowLeft />
    </button>

    {/* CENTER SEARCH */}
    <div className="flex justify-center">
      <div className="relative w-full max-w-xl">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, area, pin code"
          className="w-full bg-[#121212] pl-9 pr-10 py-2 rounded-xl text-sm outline-none border border-white/10 focus:border-white/30 cursor-text"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <FaTimes size={12} />
          </button>
        )}
      </div>
    </div>

    {/* RIGHT */}
    <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
      aria-label="Close"
    >
      <FaTimes />
    </button>

  </div>
</div>


      {/* ================= CONTENT ================= */}
      <div className="px-2 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-6 pb-24 max-w-7xl mx-auto">
        {/* ================= USE LOCATION ================= */}
        <button
          onClick={() =>
            toast.info("Location selection available during checkout")
          }
          className="flex items-center gap-2 text-blue-400 text-sm mb-4 cursor-pointer hover:text-blue-300 transition"
        >
          📍 Use my current location
        </button>

        <hr className="border-white/10 mb-4" />

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Saved Addresses</h2>

          <button
            onClick={() => navigate("/address/add")}
            className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:scale-[1.03] active:scale-[0.97] shadow-md"
          >
            <FaPlus /> Add New Address
          </button>
        </div>

        {/* ================= ADDRESS LIST ================= */}

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <AddressSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.length === 0 && (
              <p className="text-gray-400 text-sm">No address found ! Add</p>
            )}

            {filtered.map((addr) => (
              <div
                key={addr.addressId}
                onClick={() => setPendingId(addr.addressId)}
                className={`
    p-4 rounded-xl border cursor-pointer
    transition-all duration-200
    overflow-hidden
    hover:shadow-lg hover:-translate-y-[2px]
    ${
      addr.addressId === pendingId
        ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/30"
        : "border-white/10 hover:border-white/30"
    }
  `}
              >
                <div className="flex gap-3">
                  {/* ICON */}
                  <div className="mt-1 text-lg">
                    {addr.type === "home" ? <FaHome /> : <FaMapMarkerAlt />}
                  </div>
                  

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start gap-2 min-w-0">
                      {/* TEXT */}
                      <div className="flex items-start justify-between gap-2">
  {/* NAME */}
  <p className="font-medium truncate">{addr.name}</p>

  {/* FIXED SLOT (NO LAYOUT SHIFT) */}
  <div className="min-w-[72px] flex justify-end">
    {addr.addressId === selectedId && (
      <span
        className="
          text-xs
          px-2 py-0.5
          rounded-full
          bg-green-500/20
          text-green-400
          border border-green-500/30
          whitespace-nowrap
        "
      >
        Selected
      </span>
    )}
  </div>
</div>

                    </div>
                    

                    <p className="text-sm text-gray-400 truncate">
                      {addr.houseNo}, {addr.street}, {addr.locality},{" "}
                      {addr.city} - {addr.pincode}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      📞 {addr.phone}
                    </p>

                    {/* ACTIONS (BOTTOM) */}
                    <div className="mt-3 flex justify-between bottom-3">
                      {/* DELETE (LEFT) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(addr.addressId);
                        }}
                        className="
      inline-flex items-center gap-1
      px-3 py-1.5
      text-xs sm:text-sm
      rounded-lg
      border border-red-500/40
      text-red-400
      hover:text-red-300
      hover:border-red-500
      hover:bg-red-500/10
      transition
      cursor-pointer
      active:scale-95
    "
                        aria-label="Delete address"
                      >
                        <FaTrash />
                        <span className="leading-none">Delete</span>
                      </button>

                      {/* EDIT (RIGHT – SAME AS BEFORE) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/address/edit/${addr.addressId}`);
                        }}
                        className="
      inline-flex items-center gap-1
      px-3 py-1.5
      text-xs sm:text-sm
      rounded-lg
      border border-white/20
      text-gray-300
      hover:text-white
      hover:border-white/40
      hover:bg-white/5
      transition
      cursor-pointer
      active:scale-95
    "
                        aria-label="Edit address"
                      >
                        <FaEdit className="text-sm leading-none" />
                        <span className="leading-none">Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= CONFIRM BAR ================= */}
      {pendingId && pendingId !== selectedId && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-white/10 z-50">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 bg-green-500 text-black rounded-xl font-semibold hover:bg-green-400 transition cursor-pointer"
          >
            Deliver to this address
          </button>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-[#121212] rounded-2xl p-5 w-[90%] max-w-sm border border-white/10">
            <h3 className="text-lg font-semibold mb-2">
              Change delivery address?
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to deliver to this address?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setSelectedId(pendingId);
                  localStorage.setItem("selectedAddressId", pendingId);
                  setShowConfirm(false);
                  toast.success("Delivery address updated");
                }}
                className="flex-1 py-2 rounded-xl bg-green-400 text-black font-medium hover:bg-green-600 transition cursor-pointer"
              >
                Yes, confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
          <div className="bg-[#121212] rounded-2xl p-5 w-[90%] max-w-sm border border-white/10">
            <h3 className="text-lg font-semibold mb-2 text-red-400">
              Delete address?
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              This address will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 rounded-xl bg-red-500 text-black font-medium hover:bg-red-600 transition cursor-pointer"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddressPage;
