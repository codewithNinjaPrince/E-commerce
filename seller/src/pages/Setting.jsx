import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { backendUrl } from "../App";

const Setting = () => {
  const getPasswordStrength = (password) => {
    if (!password) return "";
    let strength = 0;

    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password) || /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return "weak";
    if (strength === 2 || strength === 3) return "medium";
    if (strength >= 4) return "strong";
  };

  const token = localStorage.getItem("merchantToken");

  const [merchant, setMerchant] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch merchant profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
          headers: { token },
        });

        if (res.data.success) {
          setMerchant(res.data.merchant);
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // Update password

  const updatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters.");
    }

    try {
      setIsUpdatingPassword(true); // 🔥 START LOADING

      const res = await axios.post(
        `${backendUrl}/api/merchant/update-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Password updated! Please login again.");

        localStorage.removeItem("merchantToken");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setIsUpdatingPassword(false); // 🔥 STOP LOADING
    }
  };

  return (
    <div
      className="
    flex bg-gradient-to-br from-black via-gray-900 to-black 
    min-h-screen text-white 
    pt-[30px] sm:pt-[60px] lg:pt-[50px]
  "
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="w-full max-w-[1600px] mx-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto w-full space-y-10">
          {/* PAGE TITLE */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-4 
            bg-gradient-to-r from-white via-gray-300 to-gray-500 
            bg-clip-text text-transparent"
          >
            ⚙️ Settings
          </h1>

          {/* PROFILE OVERVIEW */}
          <section className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/10 shadow-lg space-y-3">
            <h3 className="text-xl font-semibold mb-4">👤 Profile Details</h3>

            {merchant ? (
              <div className="space-y-2">
                <p>
                  <b>Name:</b> {merchant.name}
                </p>
                <p>
                  <b>Email:</b> {merchant.email}
                </p>
                <p>
                  <b>Phone:</b> {merchant.phone}
                </p>
                <p>
                  <b>Store:</b> {merchant.storeName}
                </p>
                <p>
                  <b>Description:</b> {merchant.storeDescription}
                </p>

                <button
                  onClick={() => setEditOpen(!editOpen)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg cursor-pointer font-semibold mt-3"
                >
                  {editOpen ? "Close Edit" : "Edit Profile"}
                </button>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </section>

          {/* EDIT PROFILE SECTION */}
          {editOpen && merchant && (
            <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg space-y-4">
              <h3 className="text-xl font-semibold">✏️ Edit Profile</h3>

              <input
                className="input-dark"
                value={merchant.name}
                onChange={(e) =>
                  setMerchant({ ...merchant, name: e.target.value })
                }
              />

              <input
                className="input-dark"
                value={merchant.phone}
                onChange={(e) =>
                  setMerchant({ ...merchant, phone: e.target.value })
                }
              />

              <input
                className="input-dark"
                value={merchant.storeName}
                onChange={(e) =>
                  setMerchant({ ...merchant, storeName: e.target.value })
                }
              />

              <input
                className="input-dark"
                placeholder="Full Address"
                value={merchant.address?.fullAddress || ""}
                onChange={(e) =>
                  setMerchant({
                    ...merchant,
                    address: {
                      ...merchant.address,
                      fullAddress: e.target.value,
                    },
                  })
                }
              />

              <textarea
                className="input-dark"
                value={merchant.storeDescription}
                onChange={(e) =>
                  setMerchant({ ...merchant, storeDescription: e.target.value })
                }
              />

              {/* SAVE CHANGES BUTTON — FIXED */}
              <button
                className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg cursor-pointer font-semibold"
                onClick={async () => {
                  try {
                    const payload = {
                      name: merchant.name,
                      phone: merchant.phone,
                      storeName: merchant.storeName,
                      storeDescription: merchant.storeDescription,
                      fullAddress: merchant.address?.fullAddress,
                    };

                    const res = await axios.post(
                      `${backendUrl}/api/merchant/update-profile`,
                      payload,
                      { headers: { token } }
                    );

                    if (res.data.success) {
                      toast.success("Profile updated!");
                      setEditOpen(false);
                    } else {
                      toast.error(res.data.message);
                    }
                  } catch {
                    toast.error("Profile update failed");
                  }
                }}
              >
                Save Changes
              </button>
            </section>
          )}

          {/* PASSWORD SECTION */}
          <section className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/10 shadow-lg space-y-4">
            <h3 className="text-xl font-semibold mb-3">Change Password</h3>

            {/* OLD PASSWORD */}
            <input
              className="input-dark"
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            {/* NEW PASSWORD */}
            <input
              className="input-dark"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* PASSWORD STRENGTH */}
            {newPassword && (
              <p
                className={
                  getPasswordStrength(newPassword) === "weak"
                    ? "text-red-400"
                    : getPasswordStrength(newPassword) === "medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }
              >
                Strength: {getPasswordStrength(newPassword)}
              </p>
            )}

            {/* CONFIRM PASSWORD */}
            <input
              className="input-dark"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* UPDATE BUTTON */}
            <button
              onClick={updatePassword}
              disabled={isUpdatingPassword}
              className={`
    px-5 py-3 rounded-lg font-semibold w-full
    flex items-center justify-center gap-3
    transition cursor-pointer
    ${
      isUpdatingPassword
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-yellow-600 hover:bg-yellow-700"
    }
  `}
            >
              {isUpdatingPassword ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </section>

          {/* DANGER ZONE */}
          <section className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-xl border border-red-600/40 shadow-lg">
            <h3 className="text-xl font-semibold text-red-400">
              ⚠️ Danger Zone
            </h3>
            <p className="text-gray-400 mt-2">
              Deactivating your account will permanently remove dashboard
              access.
            </p>

            <button
              onClick={() => setShowDeactivateModal(true)}
              className="bg-red-600 hover:bg-red-700 px-5 py-3 mt-4 rounded-lg cursor-pointer font-semibold w-full"
            >
              Deactivate Account
            </button>
          </section>
        </div>
      </main>

      {/* DEACTIVATE CONFIRMATION MODAL */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[999]">
          <div className="bg-gray-900 p-6 rounded-xl border border-red-600/40 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-3">
              We don't want to lose you 😔
            </h2>

            <p className="text-gray-300">
              If you still want to leave, please let us know your reason.
            </p>

            <div className="flex gap-4 mt-6">
              <button
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg w-full"
                onClick={() => setShowDeactivateModal(false)}
              >
                No, Keep My Account
              </button>

              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-full"
                onClick={() => (window.location.href = "/support")}
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
