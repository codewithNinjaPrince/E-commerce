import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

/**
 * UpdateKyc.jsx
 *
 * - Modern upload UI with cropper modal
 * - Safe delete (password confirm) that updates UI instantly
 * - No auto-submit (press Save Changes to submit)
 * - Works nicely on mobile (capture attr used)
 */

/* ----------------------
   Helper: UploadCard
   - label
   - name: field key (e.g. "aadhaarFront")
   - previewUrl: cloud or local preview
   - onPick: callback receiving event-like { target: { name, files } }
   - onRemove: optional remove handler (opens confirm)

   
   ---------------------- */

const inputClass =
  "w-full p-3 rounded-md bg-white/5 border border-white/10 outline-none focus:border-white/30 transition";

const UploadCard = ({
  label,
  name,
  previewUrl,
  onPick,
  onRemove,
  capture = null,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-xl p-3 shadow-sm hover:bg-white/8 transition">
      <div className="flex items-start gap-3">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-[#0b0b0b] flex items-center justify-center border border-white/6">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="text-gray-400 text-2xl select-none">📷</div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-300 font-semibold">{label}</p>
          <p className="text-xs text-gray-400 mt-1">
            {previewUrl
              ? "Tap Replace to change"
              : "Tap to upload (camera allowed)"}
          </p>

          <div className="mt-3 flex gap-2">
            <label
              className="px-3 py-2 bg-white/6 hover:bg-white/8 rounded-md text-sm cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? "Replace" : "Upload"}
            </label>

            {previewUrl && onRemove && (
              <button
                onClick={onRemove}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        capture={capture || undefined}
        onChange={onPick}
        className="hidden"
      />
    </div>
  );
};

/* ----------------------
   Main Component
---------------------- */
const UpdateKycPage = () => {
  const token = localStorage.getItem("merchantToken");
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(false);

  // form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "Male",
    contactName: "",
    contactPhone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    aadhaarNumber: "",
    panNumber: "",
    gstNumber: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    upi: "",
  });

  // files: keeps selected File objects (cropped)
  const [files, setFiles] = useState({
    profileImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
    panFile: null,
    gstFile: null,
    passbookFile: null,
  });

  // previews: URLs for local/cdn previews
  const [previews, setPreviews] = useState({
    profileImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
    panFile: null,
    gstFile: null,
    passbookFile: null,
  });

  // Cropper modal state
  const [cropOpen, setCropOpen] = useState(false);
  const [cropTempUrl, setCropTempUrl] = useState(null);
  const [cropField, setCropField] = useState(null);
  const cropperRef = useRef(null);

  // Delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);

  const passwordRef = useRef(null);

  // Prevent Enter auto-submit
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" && e.target?.tagName !== "TEXTAREA")
        e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Load merchant profile
  const loadMerchant = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
        headers: { token },
      });
      if (!res.data.success) {
        toast.error("Failed to load profile");
        return;
      }
      const m = res.data.merchant;
      setMerchant(m);

      // set form defaults (do not overwrite if user has typed)
      setForm((prev) => ({
        ...prev,
        firstName: m.firstName || prev.firstName,
        lastName: m.lastName || prev.lastName,
        fatherName: m.fatherName || prev.fatherName,
        dateOfBirth: m.dateOfBirth || prev.dateOfBirth,
        gender: m.gender || prev.gender,
        contactName: m.address?.contactName || prev.contactName,
        contactPhone: m.address?.contactPhone || prev.contactPhone,

        line1: m.address?.line1 || prev.line1,
        line2: m.address?.line2 || prev.line2,
        landmark: m.address?.landmark || prev.landmark,

        city: m.address?.city || prev.city,
        state: m.address?.state || prev.state,
        pincode: m.address?.pincode || prev.pincode,
        country: m.address?.country || prev.country,

        aadhaarNumber: m.aadhaarNumber || prev.aadhaarNumber,
        panNumber: m.panNumber || prev.panNumber,
        gstNumber: m.gstNumber || prev.gstNumber,
        accountName: m.bank?.accountName || prev.accountName,
        accountNumber: m.bank?.accountNumber || prev.accountNumber,
        ifsc: m.bank?.ifsc || prev.ifsc,
        bankName: m.bank?.bankName || prev.bankName,
        upi: m.bank?.upi || prev.upi,
      }));

      // set previews from cloud if no local
      setPreviews((p) => ({
        profileImage: p.profileImage || m.profileImage || null,
        aadhaarFront: p.aadhaarFront || m.documents?.aadhaarFront || null,
        aadhaarBack: p.aadhaarBack || m.documents?.aadhaarBack || null,
        panFile: p.panFile || m.documents?.panFile || null,
        gstFile: p.gstFile || m.documents?.gstFile || null,
        passbookFile: p.passbookFile || m.bank?.passbookFile || null,
      }));
    } catch (err) {
      console.error("LOAD MERCHANT ERROR:", err);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadMerchant();
    // cleanup objectURLs on unmount
    return () => {
      Object.values(previews).forEach((u) => {
        if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------
     Cropper flow
  -----------------------*/
  // Called on file input change: opens crop modal with temporary url
  const handlePickAndCrop = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCropTempUrl(url);
    setCropField(e.target.name); // which field are we cropping for
    setCropOpen(true);
  };

  // Apply cropping -> set files[field] and previews[field]
  const applyCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !cropField) {
      setCropOpen(false);
      return;
    }

    cropper.getCroppedCanvas().toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Crop failed");
          return;
        }

        const fileName = `${cropField}-${Date.now()}.jpg`;
        const croppedFile = new File([blob], fileName, { type: "image/jpeg" });

        // set file and preview
        setFiles((p) => ({ ...p, [cropField]: croppedFile }));

        // revoke old blob preview if exists
        setPreviews((p) => {
          if (p[cropField] && p[cropField].startsWith("blob:")) {
            URL.revokeObjectURL(p[cropField]);
          }
          const newUrl = URL.createObjectURL(croppedFile);
          return { ...p, [cropField]: newUrl };
        });

        // close modal and cleanup temp URL
        setCropOpen(false);
        if (cropTempUrl) {
          URL.revokeObjectURL(cropTempUrl);
        }
        setCropTempUrl(null);
        setCropField(null);
        toast.success("Image cropped & ready to upload (will send on Save)");
      },
      "image/jpeg",
      0.9
    );
  };

  const cancelCrop = () => {
    setCropOpen(false);
    if (cropTempUrl) URL.revokeObjectURL(cropTempUrl);
    setCropTempUrl(null);
    setCropField(null);
  };

  /* ----------------------
     Delete flow
     - requestDelete opens modal
     - confirmDelete verifies password and calls API
     - on success: update merchant + previews + files locally
  -----------------------*/
  const requestDelete = (field) => {
    setDeleteTarget(field);
    setPassword("");
    setConfirmOpen(true);
    setTimeout(() => passwordRef.current?.focus(), 80);
  };

  const verifyPassword = async (pw) => {
    try {
      setVerifying(true);
      const res = await axios.post(
        `${backendUrl}/api/merchant/verify-password`,
        { password: pw },
        { headers: { token } }
      );
      setVerifying(false);
      return res.data?.success;
    } catch (err) {
      setVerifying(false);
      return false;
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (!password) {
      toast.error("Enter password to confirm");
      return;
    }

    try {
      setLoading(true);

      const ok = await verifyPassword(password);
      if (!ok) {
        setLoading(false);
        toast.error("Incorrect password");
        return;
      }

      const res = await axios.delete(
        `${backendUrl}/api/merchant/kyc/${deleteTarget}`,
        { headers: { token } }
      );

      if (!res.data?.success) {
        toast.error(res.data?.message || "Delete failed");
        setLoading(false);
        setConfirmOpen(false);
        return;
      }

      toast.success(`${deleteTarget} removed`);

      // Update merchant object locally so UI immediately reflects deletion
      setMerchant((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };

        if (deleteTarget === "profileImage") {
          updated.profileImage = null;
        } else if (deleteTarget === "passbookFile") {
          if (updated.bank)
            updated.bank = { ...updated.bank, passbookFile: null };
        } else {
          updated.documents = { ...(updated.documents || {}) };
          updated.documents[deleteTarget] = null;
        }

        return updated;
      });

      // Clear local preview & file for the deleted field
      setPreviews((p) => {
        const next = { ...p };
        if (next[deleteTarget] && next[deleteTarget].startsWith("blob:")) {
          URL.revokeObjectURL(next[deleteTarget]);
        }
        next[deleteTarget] = null;
        return next;
      });

      setFiles((p) => ({ ...p, [deleteTarget]: null }));

      // reset confirm UI
      setConfirmOpen(false);
      setDeleteTarget(null);
      setPassword("");
      setLoading(false);
    } catch (err) {
      console.error("DELETE ERROR:", err);
      toast.error("Delete failed");
      setConfirmOpen(false);
      setLoading(false);
    }
  };

  /* ----------------------
     Save (PUT) handler
     - Only called when merchant presses Save Changes
  -----------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.firstName || !form.lastName) {
      toast.error("First & Last Name required");
      return;
    }
    if (!form.aadhaarNumber || !form.panNumber) {
      toast.error("Aadhaar & PAN required");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();

      Object.keys(form).forEach((k) => fd.append(k, form[k] || ""));

      // Attach only new/changed files
      Object.keys(files).forEach((k) => {
        if (files[k]) fd.append(k, files[k]);
      });

      const res = await axios.put(`${backendUrl}/api/merchant/kyc`, fd, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      if (!res.data.success) {
        toast.error(res.data.message || "Update failed");
        return;
      }

      toast.success("KYC updated! Verification may take up to 24 hours.");

      // ⏳ small delay so user sees toast
      setTimeout(() => {
        navigate("/kyc"); // 👈 change if your KYC page route is different
      }, 300);

      // revoke local blobs that were used
      Object.keys(previews).forEach((k) => {
        if (previews[k] && previews[k].startsWith("blob:")) {
          URL.revokeObjectURL(previews[k]);
        }
      });

      setFiles({
        profileImage: null,
        aadhaarFront: null,
        aadhaarBack: null,
        panFile: null,
        gstFile: null,
        passbookFile: null,
      });

      setPreviews((p) => ({
        profileImage:
          p.profileImage && !p.profileImage.startsWith("blob:")
            ? p.profileImage
            : null,
        aadhaarFront:
          p.aadhaarFront && !p.aadhaarFront.startsWith("blob:")
            ? p.aadhaarFront
            : null,
        aadhaarBack:
          p.aadhaarBack && !p.aadhaarBack.startsWith("blob:")
            ? p.aadhaarBack
            : null,
        panFile: p.panFile && !p.panFile.startsWith("blob:") ? p.panFile : null,
        gstFile: p.gstFile && !p.gstFile.startsWith("blob:") ? p.gstFile : null,
        passbookFile:
          p.passbookFile && !p.passbookFile.startsWith("blob:")
            ? p.passbookFile
            : null,
      }));
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      setLoading(false);
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  if (!merchant) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const kycStatus = merchant?.isVerified
    ? "Verified"
    : merchant?.documents?.aadhaarFront
    ? "Pending Verification"
    : "Not Submitted";

  const kycStatusColor =
    kycStatus === "Verified"
      ? "text-green-400"
      : kycStatus === "Pending Verification"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 text-white flex justify-center">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-[#0f0f0f] p-5 rounded-lg border border-white/10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-300 mb-4">
              Enter your password to confirm delete of <b>{deleteTarget}</b>.
            </p>
            <input
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Account password"
              className="w-full p-3 rounded-md bg-white/5 border border-white/10 mb-4 outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-2 rounded-md bg-white/8 hover:bg-white/12"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                {verifying ? "Verifying..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cropper modal */}
      {cropOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={cancelCrop} />
          <div className="relative bg-[#0f0f0f] p-4 rounded-lg border border-white/10 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Crop Image
            </h3>
            <div className="w-full h-[340px] bg-black">
              <Cropper
                src={cropTempUrl}
                style={{ height: 320, width: "100%" }}
                // aspectRatio can be adjusted per field; default 1:1
                aspectRatio={1}
                guides={true}
                viewMode={1}
                ref={cropperRef}
                dragMode="move"
                zoomable={true}
                scalable={true}
                modal={true}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelCrop}
                className="px-3 py-2 rounded-md bg-white/8 hover:bg-white/12"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Update KYC
        </h1>
        <p className="text-center text-gray-300 mt-2">
          Edit fields, replace files or remove them directly.
        </p>

        <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">KYC Status</h2>
              <p className={`${kycStatusColor} text-xl font-bold mt-1`}>
                {kycStatus} 🛡️
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => {
                  // reset to server values
                  loadMerchant();
                  toast.info("Reloaded server values");
                }}
                className="bg-white text-black py-2 px-4 rounded-md font-bold hover:bg-gray-200 transition"
              >
                Reset
              </button>

              <button
                onClick={() => navigate("/merchant")}
                className="bg-white/6 text-white py-2 px-4 rounded-md font-bold hover:bg-white/8 transition"
              >
                Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-300 mt-4">
            <div>
              <strong>Name:</strong> {merchant.name}
            </div>
            <div>
              <strong>Email:</strong> {merchant.email}
            </div>
            <div>
              <strong>Phone:</strong> {merchant.phone}
            </div>
            <div>
              <strong>Bank:</strong> {merchant.bank?.bankName || "Not added"}
            </div>
            <div>
              <strong>Account:</strong>{" "}
              {merchant.bank?.accountNumber || "Not added"}
            </div>
            <div>
              <strong>IFSC:</strong> {merchant.bank?.ifsc || "Not added"}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6"
        >
          {/* Personal fields */}

          <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white/90 mt-2">
            Personal Details
          </h3>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="firstName"
              value={form.firstName}
              onChange={(e) =>
                setForm((p) => ({ ...p, firstName: e.target.value }))
              }
              placeholder="First Name *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={(e) =>
                setForm((p) => ({ ...p, lastName: e.target.value }))
              }
              placeholder="Last Name *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="fatherName"
              value={form.fatherName}
              onChange={(e) =>
                setForm((p) => ({ ...p, fatherName: e.target.value }))
              }
              placeholder="Father's Name"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateOfBirth: e.target.value }))
              }
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={(e) =>
                setForm((p) => ({ ...p, gender: e.target.value }))
              }
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white/90 mt-6">
            Pickup Address
          </h3>

          {/* Address */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="contactName"
                value={form.contactName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactName: e.target.value }))
                }
                placeholder="Contact Person Name *"
                className={inputClass}
              />

              <input
                name="contactPhone"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactPhone: e.target.value }))
                }
                placeholder="Contact Phone *"
                className={inputClass}
              />
            </div>

            {/* Address lines */}
            <input
              name="line1"
              value={form.line1}
              onChange={(e) =>
                setForm((p) => ({ ...p, line1: e.target.value }))
              }
              placeholder="Address Line 1 *"
              className={inputClass}
            />

            <input
              name="line2"
              value={form.line2}
              onChange={(e) =>
                setForm((p) => ({ ...p, line2: e.target.value }))
              }
              placeholder="Address Line 2"
              className={inputClass}
            />

            <input
              name="landmark"
              value={form.landmark}
              onChange={(e) =>
                setForm((p) => ({ ...p, landmark: e.target.value }))
              }
              placeholder="Landmark"
              className={inputClass}
            />

            {/* City / State / Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                name="city"
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                placeholder="City"
                className={inputClass}
              />
              <input
                name="state"
                value={form.state}
                onChange={(e) =>
                  setForm((p) => ({ ...p, state: e.target.value }))
                }
                placeholder="State"
                className={inputClass}
              />
              <input
                name="pincode"
                value={form.pincode}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pincode: e.target.value }))
                }
                placeholder="Pincode"
                className={inputClass}
              />
            </div>
          </div>

          <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white/90 mt-6">
            Identity Details
          </h3>

          {/* IDs */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 gap-3">
            <input
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, aadhaarNumber: e.target.value }))
              }
              placeholder="Aadhaar Number *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="panNumber"
              value={form.panNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, panNumber: e.target.value }))
              }
              placeholder="PAN Number *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="gstNumber"
              value={form.gstNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, gstNumber: e.target.value }))
              }
              placeholder="GST Number (Optional)"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
          </div>

          <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white/90 mt-6">
            Bank Details
          </h3>

          {/* Bank */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="accountName"
              value={form.accountName}
              onChange={(e) =>
                setForm((p) => ({ ...p, accountName: e.target.value }))
              }
              placeholder="Account Holder Name"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, accountNumber: e.target.value }))
              }
              placeholder="Account Number"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="ifsc"
              value={form.ifsc}
              onChange={(e) => setForm((p) => ({ ...p, ifsc: e.target.value }))}
              placeholder="IFSC Code"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="bankName"
              value={form.bankName}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankName: e.target.value }))
              }
              placeholder="Bank Name"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="upi"
              value={form.upi}
              onChange={(e) => setForm((p) => ({ ...p, upi: e.target.value }))}
              placeholder="UPI ID"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
          </div>

          <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white/90 mt-6">
            Documents Upload
          </h3>

          {/* Upload cards (grid) */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
            <UploadCard
              label="Profile Image"
              name="profileImage"
              capture="user"
              previewUrl={previews.profileImage}
              onPick={handlePickAndCrop}
              onRemove={() => requestDelete("profileImage")}
            />
            <UploadCard
              label="Aadhaar Front"
              name="aadhaarFront"
              capture="environment"
              previewUrl={previews.aadhaarFront}
              onPick={handlePickAndCrop}
              onRemove={() => requestDelete("aadhaarFront")}
            />
            <UploadCard
              label="Aadhaar Back"
              name="aadhaarBack"
              capture="environment"
              previewUrl={previews.aadhaarBack}
              onPick={handlePickAndCrop}
              onRemove={() => requestDelete("aadhaarBack")}
            />
            <UploadCard
              label="PAN Card"
              name="panFile"
              capture="environment"
              previewUrl={previews.panFile}
              onPick={handlePickAndCrop}
              onRemove={() => requestDelete("panFile")}
            />
            <UploadCard
              label="GST Certificate (Optional)"
              name="gstFile"
              capture="environment"
              previewUrl={previews.gstFile}
              onPick={handlePickAndCrop}
              onRemove={() => requestDelete("gstFile")}
            />
            <UploadCard
              label="Passbook First Page"
              name="passbookFile"
              capture="environment"
              previewUrl={previews.passbookFile}
              onPick={handlePickAndCrop}
              onRemove={() => requestDelete("passbookFile")}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex gap-3 items-center mt-2">
            <button
              type="submit"
              className="bg-white text-black py-3 px-6 rounded-md font-bold hover:bg-gray-200 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                loadMerchant();
                toast.info("Reset");
              }}
              className="bg-white/6 text-white py-3 px-6 rounded-md hover:bg-white/8 transition"
            >
              Cancel
            </button>
          </div>
        </form>

        <style>{`
          .input { cursor: text; }
          button { cursor: pointer; }
        `}</style>
      </div>
    </div>
  );
};

export default UpdateKycPage;
