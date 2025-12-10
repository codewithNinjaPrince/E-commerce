// UpdateKycPage.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

/**
 * UpdateKycPage
 *
 * - Auto-fills fields from /api/merchant/profile
 * - Shows existing images & allows immediate delete (password confirm)
 * - Allows replacing files (camera/gallery via capture attr)
 * - Submits via PUT /api/merchant/kyc (multipart/form-data)
 * - Clears local files/previews after actions
 */

const FileBox = ({
  label,
  name,
  accept,
  capture,
  onChange,
  previewUrl,
  onRemove,
}) => {
  return (
    <div className="relative">
      <label className="file-box cursor-pointer flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/6 transition items-start">
        <span className="text-sm text-gray-300">{label}</span>

        <div className="w-full flex items-center gap-3">
          <div className="grow">
            <input
              type="file"
              name={name}
              accept={accept}
              capture={capture}
              onChange={onChange}
              className="w-full text-sm"
            />
          </div>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              className="w-16 h-12 object-cover rounded-md border border-white/10 cursor-pointer"
            />
          ) : (
            <div className="w-16 h-12 rounded-md border border-white/10 bg-white/3 flex items-center justify-center text-xs text-gray-300">
              No preview
            </div>
          )}
        </div>
      </label>

      {/* If onRemove provided, show small remove button overlay on preview */}
      {previewUrl && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md cursor-pointer"
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

const UpdateKycPage = () => {
  const token = localStorage.getItem("merchantToken");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [merchant, setMerchant] = useState(null);

  // form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "Male",
    fullAddress: "",
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

  // local file objects (File) for upload
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panFile: null,
    gstFile: null,
    passbookFile: null,
    profileImage: null,
  });

  // preview URLs for local files (created via URL.createObjectURL)
  const [localPreviews, setLocalPreviews] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panFile: null,
    gstFile: null,
    passbookFile: null,
    profileImage: null,
  });

  // password modal for immediate delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // docType string
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const passwordRef = useRef(null);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const name = e.target.name;
    const file = e.target.files?.[0];
    setFiles((p) => ({ ...p, [name]: file || null }));

    // create + set local preview
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalPreviews((p) => ({ ...p, [name]: url }));
    } else {
      // cleared
      setLocalPreviews((p) => ({ ...p, [name]: null }));
    }
  };

  // load merchant and prefill form
  const loadMerchant = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
        headers: { token },
      });
      if (!res.data.success) return;
      const m = res.data.merchant;
      setMerchant(m);
      setForm((prev) => ({
        ...prev,
        firstName: m.firstName || prev.firstName,
        lastName: m.lastName || prev.lastName,
        fatherName: m.fatherName || prev.fatherName,
        dateOfBirth: m.dateOfBirth || prev.dateOfBirth,
        gender: m.gender || prev.gender,
        fullAddress: m.address?.fullAddress || prev.fullAddress,
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
    } catch (err) {
      console.log("LOAD MERCHANT ERROR:", err);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadMerchant();
    // cleanup previews on unmount
    return () => {
      Object.values(localPreviews).forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper: get cloud preview from merchant or local preview
  const getPreview = (field) => {
    if (localPreviews[field]) return localPreviews[field];
    if (!merchant) return null;
    if (field === "profileImage") return merchant.profileImage || null;
    if (field === "passbookFile") return merchant.bank?.passbookFile || null;
    return merchant.documents?.[field] || null;
  };

  // open deletion modal for a doc
  const requestDelete = (docType) => {
    setDeleteTarget(docType);
    setPassword("");
    setConfirmOpen(true);
    setTimeout(() => passwordRef.current?.focus(), 100);
  };

  // verify password (backend) - reuses your verify-password route
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

  // perform immediate delete (after password)
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (!password) {
      toast.error("Enter your password");
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

      await axios.delete(`${backendUrl}/api/merchant/kyc/${deleteTarget}`, {
        headers: { token },
      });

      toast.success(`${deleteTarget} removed`);
      // also clear any local preview/file for that doc
      setFiles((p) => ({ ...p, [deleteTarget]: null }));
      setLocalPreviews((p) => ({ ...p, [deleteTarget]: null }));
      setConfirmOpen(false);
      setDeleteTarget(null);
      setPassword("");
      await loadMerchant();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to delete document");
      setConfirmOpen(false);
    }
  };

  // submit updated kyc (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // keep same validation you had
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
      // append only updated files
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
      navigate("/kyc");

      // clear local files + previews (reset)
      Object.values(localPreviews).forEach((u) => u && URL.revokeObjectURL(u));
      setFiles({
        aadhaarFront: null,
        aadhaarBack: null,
        panFile: null,
        gstFile: null,
        passbookFile: null,
        profileImage: null,
      });
      setLocalPreviews({
        aadhaarFront: null,
        aadhaarBack: null,
        panFile: null,
        gstFile: null,
        passbookFile: null,
        profileImage: null,
      });
      // reload merchant info from server
      await loadMerchant();
    } catch (err) {
      setLoading(false);
      console.log("UPDATE ERROR:", err);
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  // helper: reset whole form & files to server values (used when user cancels update)
  const resetToServer = async () => {
    // revoke local preview urls
    Object.values(localPreviews).forEach((u) => u && URL.revokeObjectURL(u));
    setFiles({
      aadhaarFront: null,
      aadhaarBack: null,
      panFile: null,
      gstFile: null,
      passbookFile: null,
      profileImage: null,
    });
    setLocalPreviews({
      aadhaarFront: null,
      aadhaarBack: null,
      panFile: null,
      gstFile: null,
      passbookFile: null,
      profileImage: null,
    });
    await loadMerchant();
  };

  if (!merchant)
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );

  // compute kyc state
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
      {/* LOADING overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
          <p className="mt-4 text-gray-300">Please wait...</p>
        </div>
      )}

      {/* Confirm password modal for immediate delete */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-white/6 border border-white/20 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-3">Confirm Delete</h3>
            <p className="text-sm text-gray-300 mb-4">
              Enter your password to confirm deleting{" "}
              <span className="font-semibold">{deleteTarget}</span>.
            </p>

            <input
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your account password"
              className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white outline-none mb-4"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition cursor-pointer text-white font-semibold"
              >
                {verifying ? "Verifying..." : "Confirm Delete"}
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
          Edit fields, replace files or remove them directly. Deleting a file
          requires password confirmation.
        </p>

        {/* Status + actions */}
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
                  resetToServer();
                  toast.info("Reset to server values");
                }}
                className="bg-white text-black py-2 px-4 rounded-md font-bold cursor-pointer hover:bg-gray-200 transition"
              >
                Reset
              </button>

              <button
                onClick={() => navigate("/merchant")}
                className="bg-white/6 text-white py-2 px-4 rounded-md font-bold cursor-pointer hover:bg-white/8 transition"
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6"
        >
          {/* Personal */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              placeholder="Father's Name"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Address */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea
              name="fullAddress"
              rows={3}
              value={form.fullAddress}
              onChange={handleChange}
              placeholder="Full Address *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none col-span-2"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
          </div>

          {/* IDs */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={handleChange}
              placeholder="Aadhaar Number *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="panNumber"
              value={form.panNumber}
              onChange={handleChange}
              placeholder="PAN Number *"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              placeholder="GST Number (Optional)"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
          </div>

          {/* Bank */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              placeholder="Account Holder Name"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Account Number"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="ifsc"
              value={form.ifsc}
              onChange={handleChange}
              placeholder="IFSC Code"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Bank Name"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
            <input
              name="upi"
              value={form.upi}
              onChange={handleChange}
              placeholder="UPI ID"
              className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
            />
          </div>

          {/* Upload boxes */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileBox
              label="Profile Image"
              name="profileImage"
              accept="image/*"
              capture="user"
              onChange={handleFile}
              previewUrl={getPreview("profileImage")}
              onRemove={() => requestDelete("profileImage")}
            />

            <FileBox
              label="Aadhaar Front"
              name="aadhaarFront"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              previewUrl={getPreview("aadhaarFront")}
              onRemove={() => requestDelete("aadhaarFront")}
            />
            <FileBox
              label="Aadhaar Back"
              name="aadhaarBack"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              previewUrl={getPreview("aadhaarBack")}
              onRemove={() => requestDelete("aadhaarBack")}
            />
            <FileBox
              label="PAN Card"
              name="panFile"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              previewUrl={getPreview("panFile")}
              onRemove={() => requestDelete("panFile")}
            />
            <FileBox
              label="GST (optional)"
              name="gstFile"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              previewUrl={getPreview("gstFile")}
              onRemove={() => requestDelete("gstFile")}
            />
            <FileBox
              label="Passbook First Page"
              name="passbookFile"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              previewUrl={getPreview("passbookFile")}
              onRemove={() => requestDelete("passbookFile")}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex gap-3 items-center">
            <button
              type="submit"
              className="bg-white text-black py-3 px-6 rounded-md font-bold hover:bg-gray-200 transition cursor-pointer"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => {
                resetToServer();
                toast.info("Form reset");
              }}
              className="bg-white/6 text-white py-3 px-6 rounded-md hover:bg-white/8 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* existing document gallery (for quick view & delete) */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Existing documents (server)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "aadhaarFront", title: "Aadhaar Front" },
              { key: "aadhaarBack", title: "Aadhaar Back" },
              { key: "panFile", title: "PAN" },
              { key: "passbookFile", title: "Passbook" },
              { key: "profileImage", title: "Profile Image" },
              { key: "gstFile", title: "GST" },
            ].map((item) => {
              const src =
                item.key === "profileImage"
                  ? merchant.profileImage
                  : item.key === "passbookFile"
                  ? merchant.bank?.passbookFile
                  : merchant.documents?.[item.key];

              return (
                <div
                  key={item.key}
                  className="p-4 bg-white/3 border border-white/10 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    {src && (
                      <button
                        onClick={() => requestDelete(item.key)}
                        className="text-sm text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {src ? (
                    <img
                      src={src}
                      alt={item.key}
                      className="w-full h-44 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-300 mb-2">Not uploaded</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/update-kyc")}
                      className="px-3 py-2 rounded-md bg-white text-black cursor-pointer hover:bg-gray-200 transition"
                    >
                      Replace
                    </button>
                    {src && (
                      <button
                        onClick={() => requestDelete(item.key)}
                        className="px-3 py-2 rounded-md bg-red-600 text-white cursor-pointer hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          .input { cursor: text; }
          .file-box input[type=file] { cursor: pointer; opacity: 0.999; }
          .file-box { cursor: pointer; }
          button { cursor: pointer; }
        `}</style>
      </div>
    </div>
  );
};

export default UpdateKycPage;
