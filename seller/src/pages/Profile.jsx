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

  // FETCH MERCHANT PROFILE
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
    } catch (err) {
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
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!merchant)
    return (
      <div className="text-gray-300 text-center py-10">Loading profile...</div>
    );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="bg-[#151515] p-6 rounded-xl border border-[#222] shadow-xl">

          {/* TOP SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
              {merchant.name?.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">{merchant.name}</h2>
              <p className="text-gray-400 text-sm break-all">{merchant.email}</p>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <FaUserEdit /> {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          <hr className="my-6 border-[#333]" />

          {/* DETAILS */}
          <div className="space-y-5">

            {/* NAME */}
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              {editMode ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0f0f0f] mt-1 p-3 rounded-lg border border-[#333]"
                />
              ) : (
                <p className="text-white mt-1 break-all">{merchant.name}</p>
              )}
            </div>

            {/* STORE NAME */}
            <div>
              <p className="text-gray-400 text-sm">Store Name</p>
              {editMode ? (
                <input
                  value={form.storeName}
                  onChange={(e) =>
                    setForm({ ...form, storeName: e.target.value })
                  }
                  className="w-full bg-[#0f0f0f] mt-1 p-3 rounded-lg border border-[#333]"
                />
              ) : (
                <p className="text-white mt-1 break-all">{merchant.storeName}</p>
              )}
            </div>

            {/* STORE DESCRIPTION */}
            <div>
              <p className="text-gray-400 text-sm">Store Description</p>
              {editMode ? (
                <textarea
                  rows={3}
                  value={form.storeDescription}
                  onChange={(e) =>
                    setForm({ ...form, storeDescription: e.target.value })
                  }
                  className="w-full bg-[#0f0f0f] mt-1 p-3 rounded-lg border border-[#333]"
                ></textarea>
              ) : (
                <p className="text-white mt-1 break-all">
                  {merchant.storeDescription}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div className="flex items-start gap-3">
              <FaPhone className="text-gray-400 mt-1" />
              {editMode ? (
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="flex-1 bg-[#0f0f0f] p-3 rounded-lg border border-[#333]"
                />
              ) : (
                <p className="break-all">{merchant.phone}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-gray-400 mt-1" />
              <p className="break-all">{merchant.email}</p>
            </div>

            {/* ADDRESS */}
            <div className="flex items-start gap-3">
              <FaMapMarkedAlt className="text-gray-400 mt-1" />
              {editMode ? (
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="flex-1 bg-[#0f0f0f] p-3 rounded-lg border border-[#333]"
                ></textarea>
              ) : (
                <p className="text-gray-300 break-all">
                  {merchant.address?.fullAddress || "No address added"}
                </p>
              )}
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
