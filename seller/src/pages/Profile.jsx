import { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaPhone,
  FaEnvelope,
  FaMapMarkedAlt,
} from "react-icons/fa";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Profile = () => {
  const token = localStorage.getItem("merchantToken");

  const [merchant, setMerchant] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    storeName: "",
    storeDescription: "",
    address: "",
  });

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
        headers: { token },
      });

      if (res.data.success) {
        setMerchant(res.data.merchant);

        setForm({
          name: res.data.merchant.name || "",
          phone: res.data.merchant.phone || "",
          email: res.data.merchant.email || "",
          storeName: res.data.merchant.storeName || "",
          storeDescription: res.data.merchant.storeDescription || "",
          address: res.data.merchant.address?.fullAddress || "",
        });
      }
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/merchant/update-profile`,
        form,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Profile Updated!");
        setEditMode(false);
        fetchProfile();
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  if (!merchant)
    return (
      <div className="text-gray-300 text-center py-10">Loading profile...</div>
    );

  return (
    <div
      className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 
     overflow-x-hidden 
     pt-[30px] sm:pt-[60px] lg:pt-[50px]
     overflow-y-auto 
     min-h-[calc(100vh-75px)]"
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-6 text-white">My Profile</h1>

        {/* CARD */}
        <div className="bg-[#151515] p-6 sm:p-7 rounded-xl border border-[#222] shadow-xl w-full">
          {/* TOP SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
              {merchant.name?.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white break-words">
                {merchant.name}
              </h2>
              <p className="text-gray-400 text-sm break-all mt-1">
                {merchant.email}
              </p>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <FaUserEdit />
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          <hr className="my-6 border-[#333]" />

          {/* DETAILS */}
          <div className="space-y-6">
            {/* NAME */}
            <div className="w-full">
              <p className="text-gray-400 text-sm">Full Name</p>
              <div className="min-h-[48px] flex items-center">
                {editMode ? (
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#0f0f0f] p-3 rounded-lg border border-[#333]"
                  />
                ) : (
                  <p className="text-white break-words">{merchant.name}</p>
                )}
              </div>
            </div>

            {/* STORE NAME */}
            <div className="w-full">
              <p className="text-gray-400 text-sm">Store Name</p>
              <div className="min-h-[48px] flex items-center">
                {editMode ? (
                  <input
                    value={form.storeName}
                    onChange={(e) =>
                      setForm({ ...form, storeName: e.target.value })
                    }
                    className="w-full bg-[#0f0f0f] p-3 rounded-lg border border-[#333]"
                  />
                ) : (
                  <p className="text-white break-words">{merchant.storeName}</p>
                )}
              </div>
            </div>

            {/* STORE DESCRIPTION */}
            <div className="w-full">
              <p className="text-gray-400 text-sm">Store Description</p>
              {editMode ? (
                <textarea
                  rows={3}
                  value={form.storeDescription}
                  onChange={(e) =>
                    setForm({ ...form, storeDescription: e.target.value })
                  }
                  className="w-full bg-[#0f0f0f] p-3 mt-1 rounded-lg border border-[#333]"
                ></textarea>
              ) : (
                <p className="text-white mt-1 break-words">
                  {merchant.storeDescription}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div className="flex gap-3 items-center">
              <FaPhone className="text-gray-400 flex-shrink-0 mt-[2px]" />
              <div className="flex-1">
                {editMode ? (
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full bg-[#0f0f0f] p-3 rounded-lg border border-[#333]"
                  />
                ) : (
                  <p className="text-white break-all">{merchant.phone}</p>
                )}
              </div>
            </div>

            {/* EMAIL ALWAYS STATIC */}
            <div className="flex gap-3 items-center">
              <FaEnvelope className="text-gray-400 flex-shrink-0 mt-[2px]" />
              <p className="text-gray-300 break-all">{merchant.email}</p>
            </div>

            {/* ADDRESS */}
            <div className="flex gap-3 items-start">
              <FaMapMarkedAlt className="text-gray-400 mt-[6px]" />
              <div className="flex-1">
                {editMode ? (
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full bg-[#0f0f0f] p-3 rounded-lg border border-[#333]"
                  ></textarea>
                ) : (
                  <p className="text-gray-300 break-words">
                    {merchant.address?.fullAddress || "No address added"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          {editMode && (
            <button
              onClick={updateProfile}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold cursor-pointer"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
