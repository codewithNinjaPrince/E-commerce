// // KycPage.jsx
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { backendUrl } from "../App";
// import { useNavigate } from "react-router-dom";

// /**
//  * FileBox - shows label, file input and preview.
//  * Accepts capture prop (for camera support on mobile).
//  * Shows a preview image and (optionally) a floating delete button (handled outside).
//  */
// const FileBox = ({
//   label,
//   name,
//   accept,
//   capture,
//   onChange,
//   previewUrl,
//   local,
//   onLocalRemove,
// }) => {
//   return (
//     <label className="file-box relative cursor-pointer flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/6 transition items-start">
//       <span className="text-sm text-gray-300">{label}</span>

//       <div className="w-full flex items-center gap-3">
//         <div className="grow">
//           <input
//             type="file"
//             name={name}
//             accept={accept}
//             capture={capture}
//             onChange={onChange}
//             className="w-full text-sm"
//             // keep native input visible for mobile camera/gallery picker
//           />
//         </div>

//         {previewUrl ? (
//           <div className="relative">
//             <img
//               src={previewUrl}
//               alt={label}
//               className="w-16 h-12 object-cover rounded-md border border-white/10 cursor-pointer"
//             />
//             {/* local: small 'x' to remove local-only file quickly */}
//             {local && (
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onLocalRemove && onLocalRemove();
//                 }}
//                 className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow"
//                 title="Remove selected file"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="w-16 h-12 rounded-md border border-white/10 bg-white/3 flex items-center justify-center text-xs text-gray-300">
//             No preview
//           </div>
//         )}
//       </div>
//     </label>
//   );
// };

// const emptyForm = {
//   firstName: "",
//   lastName: "",
//   fatherName: "",
//   dateOfBirth: "",
//   gender: "Male",
//   fullAddress: "",
//   city: "",
//   state: "",
//   pincode: "",
//   country: "India",
//   aadhaarNumber: "",
//   panNumber: "",
//   gstNumber: "",
//   accountName: "",
//   accountNumber: "",
//   ifsc: "",
//   bankName: "",
//   upi: "",
// };

// const initialFiles = {
//   aadhaarFront: null,
//   aadhaarBack: null,
//   panFile: null,
//   gstFile: null,
//   passbookFile: null,
//   profileImage: null,
// };

// const Kyc = () => {
//   const token = localStorage.getItem("merchantToken");
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [merchant, setMerchant] = useState(null);

//   const [form, setForm] = useState({ ...emptyForm });
//   const [files, setFiles] = useState({ ...initialFiles });

//   // modal & delete state
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmMode, setConfirmMode] = useState("all"); // "all" | "single"
//   const [targetDoc, setTargetDoc] = useState(null);
//   const [password, setPassword] = useState("");
//   const [verifying, setVerifying] = useState(false);
//   const [agree, setAgree] = useState(false);

//   const passwordRef = useRef(null);

//   // Keep track of optimistic deletions on UI so preview hides instantly.
//   // A Set of doc keys e.g. "aadhaarFront"
//   const [removedDocs, setRemovedDocs] = useState(new Set());

//   // Toggle body overflow to prevent navbar shift when modal is open
//   useEffect(() => {
//     document.body.style.overflow = confirmOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [confirmOpen]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleFile = (e) => {
//     const name = e.target.name;
//     const file = e.target.files?.[0] || null;
//     setFiles((prev) => ({ ...prev, [name]: file }));
//     // If user re-selects file for a doc previously removed from cloud, ensure removedDocs doesn't hide it
//     setRemovedDocs((prevSet) => {
//       if (prevSet.has(name)) {
//         const next = new Set(prevSet);
//         next.delete(name);
//         return next;
//       }
//       return prevSet;
//     });
//   };

//   // local preview URL helper
//   const localPreview = (file) => (file ? URL.createObjectURL(file) : null);

//   // Helper: get preview URL prefer local file then merchant cloud URL unless removed
//   const getPreview = (field) => {
//     // if user removed cloud doc via UI -> don't show cloud preview
//     if (removedDocs.has(field)) return localPreview(files[field]) || null;

//     if (files[field]) return localPreview(files[field]);
//     if (!merchant) return null;

//     if (field === "profileImage") return merchant.profileImage || null;
//     if (field === "passbookFile") return merchant.bank?.passbookFile || null;
//     return merchant.documents?.[field] || null;
//   };

//   // Load merchant & prefill form
//   const loadMerchant = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
//         headers: { token },
//       });
//       if (!res.data.success) return;
//       setMerchant(res.data.merchant);

//       // Fill form non-destructively
//       const m = res.data.merchant;
//       setForm((prev) => ({
//         ...prev,
//         firstName: m.firstName || prev.firstName,
//         lastName: m.lastName || prev.lastName,
//         fatherName: m.fatherName || prev.fatherName,
//         dateOfBirth: m.dateOfBirth || prev.dateOfBirth,
//         gender: m.gender || prev.gender,
//         fullAddress: m.address?.fullAddress || prev.fullAddress,
//         city: m.address?.city || prev.city,
//         state: m.address?.state || prev.state,
//         pincode: m.address?.pincode || prev.pincode,
//         country: m.address?.country || prev.country,
//         aadhaarNumber: m.aadhaarNumber || prev.aadhaarNumber,
//         panNumber: m.panNumber || prev.panNumber,
//         gstNumber: m.gstNumber || prev.gstNumber,
//         accountName: m.bank?.accountName || prev.accountName,
//         accountNumber: m.bank?.accountNumber || prev.accountNumber,
//         ifsc: m.bank?.ifsc || prev.ifsc,
//         bankName: m.bank?.bankName || prev.bankName,
//         upi: m.bank?.upi || prev.upi,
//       }));
//     } catch (err) {
//       console.log("LOAD MERCHANT ERROR:", err);
//     }
//   };

//   useEffect(() => {
//     loadMerchant();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Reset local form + files to completely empty initial state
//   const resetFormToEmpty = () => {
//     setForm({ ...emptyForm });
//     setFiles({ ...initialFiles });
//     setRemovedDocs(new Set());
//   };

//   // Reset to merchant prefills and clear only local files
//   const resetLocalFiles = () => {
//     setFiles({ ...initialFiles });
//     setRemovedDocs(new Set());
//     // keep the form as prefilled from merchant
//     if (merchant) {
//       setForm((prev) => ({
//         ...prev,
//         firstName: merchant.firstName || prev.firstName,
//         lastName: merchant.lastName || prev.lastName,
//         fatherName: merchant.fatherName || prev.fatherName,
//         dateOfBirth: merchant.dateOfBirth || prev.dateOfBirth,
//         gender: merchant.gender || prev.gender,
//         fullAddress: merchant.address?.fullAddress || prev.fullAddress,
//         city: merchant.address?.city || prev.city,
//         state: merchant.address?.state || prev.state,
//         pincode: merchant.address?.pincode || prev.pincode,
//         country: merchant.address?.country || prev.country,
//         aadhaarNumber: merchant.aadhaarNumber || prev.aadhaarNumber,
//         panNumber: merchant.panNumber || prev.panNumber,
//         gstNumber: merchant.gstNumber || prev.gstNumber,
//         accountName: merchant.bank?.accountName || prev.accountName,
//         accountNumber: merchant.bank?.accountNumber || prev.accountNumber,
//         ifsc: merchant.bank?.ifsc || prev.ifsc,
//         bankName: merchant.bank?.bankName || prev.bankName,
//         upi: merchant.bank?.upi || prev.upi,
//       }));
//     }
//   };

//   // Submit KYC (same logic you already had, with clearing local state afterwards)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.firstName || !form.lastName) {
//       toast.error("First & Last Name required");
//       return;
//     }

//     if (!form.aadhaarNumber || !form.panNumber) {
//       toast.error("Aadhaar & PAN required");
//       return;
//     }

//     if (!agree) {
//       return toast.error(
//         "You must agree to the terms & Conditions before submitting KYC."
//       );
//     }

//     // allow if cloud already has them
//     const hasAadhaar =
//       merchant?.documents?.aadhaarFront && merchant?.documents?.aadhaarBack;
//     const hasPan = merchant?.documents?.panFile;
//     if (!files.aadhaarFront && !files.aadhaarBack && !files.panFile) {
//       if (!hasAadhaar || !hasPan) {
//         toast.error("Aadhaar front/back & PAN required");
//         return;
//       }
//     }

//     try {
//       setLoading(true);

//       const f = new FormData();
//       Object.keys(form).forEach((key) => f.append(key, form[key]));
//       Object.keys(files).forEach((key) => {
//         if (files[key]) f.append(key, files[key]);
//       });

//       const res = await axios.post(`${backendUrl}/api/merchant/kyc`, f, {
//         headers: { token, "Content-Type": "multipart/form-data" },
//       });

//       setLoading(false);
//       if (!res.data.success) {
//         toast.error(res.data.message || "KYC submit failed");
//         return;
//       }

//       toast.success("KYC submitted! Verification may take up to 24 hours.");
//       // after success: reload merchant, clear local files and removed flags
//       await loadMerchant();
//       resetLocalFiles();
//     } catch (err) {
//       setLoading(false);
//       toast.error(err?.response?.data?.message || "KYC failed");
//     }
//   };

//   // open confirm dialog for single or all
//   const openConfirm = (mode = "all", doc = null) => {
//     setConfirmMode(mode);
//     setTargetDoc(doc);
//     setPassword("");
//     setConfirmOpen(true);
//     setTimeout(() => passwordRef.current?.focus(), 120);
//   };

//   // For local-only file removal (not uploaded cloud)
//   const removeLocalFile = (field) => {
//     setFiles((prev) => ({ ...prev, [field]: null }));
//   };

//   // If user clicks the floating delete on a preview:
//   // - if preview refers to a local newly selected file -> remove immediately
//   // - if preview refers to an existing cloud file -> open confirm (single)
//   const onPreviewDeleteClick = (field) => {
//     const isLocal = !!files[field];
//     if (isLocal) {
//       removeLocalFile(field);
//       return;
//     }

//     // if not local and there's a cloud url show confirm for backend delete
//     const existsCloud =
//       field === "passbookFile"
//         ? !!merchant?.bank?.passbookFile
//         : field === "profileImage"
//         ? !!merchant?.profileImage
//         : !!merchant?.documents?.[field];

//     if (!existsCloud) {
//       // nothing to delete
//       setRemovedDocs((prev) => {
//         const s = new Set(prev);
//         s.delete(field);
//         return s;
//       });
//       return;
//     }

//     // Optimistic UI: hide preview instantly, but still confirm password+backend deletion
//     setRemovedDocs((prev) => new Set(prev).add(field));
//     openConfirm("single", field);
//   };

//   // verify password endpoint (you already have)
//   const verifyPassword = async (pw) => {
//     try {
//       setVerifying(true);
//       const res = await axios.post(
//         `${backendUrl}/api/merchant/verify-password`,
//         { password: pw },
//         { headers: { token } }
//       );
//       setVerifying(false);
//       return res.data?.success;
//     } catch (err) {
//       setVerifying(false);
//       return false;
//     }
//   };

//   // perform the delete operation (single or all) after verifying password
//   const performDelete = async () => {
//     if (!password) {
//       toast.error("Enter password to confirm");
//       return;
//     }

//     try {
//       setLoading(true);
//       const ok = await verifyPassword(password);
//       if (!ok) {
//         setLoading(false);
//         toast.error("Incorrect password");
//         // revert optimistic removes for single delete
//         if (confirmMode === "single" && targetDoc) {
//           setRemovedDocs((prev) => {
//             const s = new Set(prev);
//             s.delete(targetDoc);
//             return s;
//           });
//         }
//         return;
//       }

//       if (confirmMode === "all") {
//         // delete each existing doc that is present in merchant
//         const docs = [
//           "aadhaarFront",
//           "aadhaarBack",
//           "panFile",
//           "gstFile",
//           "passbookFile",
//           "profileImage",
//         ];

//         for (let doc of docs) {
//           const exists =
//             doc === "passbookFile"
//               ? !!merchant?.bank?.passbookFile
//               : doc === "profileImage"
//               ? !!merchant?.profileImage
//               : !!merchant?.documents?.[doc];

//           if (!exists) continue;

//           await axios.delete(`${backendUrl}/api/merchant/kyc/${doc}`, {
//             headers: { token },
//           });
//         }

//         toast.success("All KYC documents deleted!");
//         // clear local files & removed flags
//         resetFormToEmpty();
//         await loadMerchant();
//       } else {
//         // single delete
//         if (!targetDoc) {
//           toast.error("No document selected");
//           setLoading(false);
//           return;
//         }

//         await axios.delete(`${backendUrl}/api/merchant/kyc/${targetDoc}`, {
//           headers: { token },
//         });

//         toast.success(`${targetDoc} deleted`);
//         // clear removed flag for that doc (it is already removed from cloud)
//         setRemovedDocs((prev) => {
//           const s = new Set(prev);
//           s.delete(targetDoc);
//           return s;
//         });
//         // clear local file if any
//         setFiles((prev) => ({ ...prev, [targetDoc]: null }));
//         await loadMerchant();
//       }

//       setConfirmOpen(false);
//       setLoading(false);
//     } catch (err) {
//       console.error("DELETE ERROR:", err);
//       setLoading(false);
//       setConfirmOpen(false);
//       toast.error("Failed to delete KYC document(s)");
//       // reload merchant to sync UI
//       await loadMerchant();
//       setRemovedDocs(new Set());
//     }
//   };

//   // Reset before navigating to Update KYC page (user wanted cleared formdata when navigating)
//   const resetAndGoToUpdate = () => {
//     resetFormToEmpty();
//     // small delay to ensure form cleared before navigation (UI wise)
//     setTimeout(() => navigate("/update-kyc"), 50);
//   };

//   // KYC status logic (user asked what switches status to Verified)
//   // NOTE: Verification status is controlled by backend. We'll show:
//   // Verified -> merchant.isVerified === true
//   // Pending -> at least aadhaarFront exists but isVerified === false
//   // Not Submitted -> no aadhaarFront
//   const kycStatus = merchant?.isVerified
//     ? "Verified"
//     : merchant?.documents?.aadhaarFront
//     ? "Pending Verification"
//     : "Not Submitted";

//   const kycStatusColor =
//     kycStatus === "Verified"
//       ? "text-green-400"
//       : kycStatus === "Pending Verification"
//       ? "text-yellow-400"
//       : "text-red-400";

//   if (!merchant) {
//     return (
//       <div className="min-h-screen text-white flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div
//       className="
//     min-h-screen
//     bg-gradient-to-br from-black via-gray-900 to-black
//     p-4 md:p-6 text-white flex justify-center
//     pt-[30px] sm:pt-[60px] lg:pt-[50px]
//   "
//     >
//       {/* LOADING OVERLAY */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
//           <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
//           <p className="mt-4 text-gray-300">Please wait...</p>
//         </div>
//       )}

//       {/* CONFIRM PASSWORD MODAL */}
//       {confirmOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/60"
//             onClick={() => setConfirmOpen(false)}
//           />
//           <div className="relative bg-white/6 border border-white/20 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
//             <h3 className="text-xl font-semibold mb-3">Confirm Delete</h3>
//             <p className="text-sm text-gray-300 mb-4">
//               Enter your password to confirm{" "}
//               {confirmMode === "all"
//                 ? "deleting all KYC documents"
//                 : `deleting ${targetDoc}`}
//               .
//             </p>

//             <input
//               ref={passwordRef}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               type="password"
//               placeholder="Your account password"
//               className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white outline-none mb-4"
//             />

//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => {
//                   setConfirmOpen(false);
//                   /* revert any optimistic single remove */ if (
//                     confirmMode === "single" &&
//                     targetDoc
//                   )
//                     setRemovedDocs((p) => {
//                       const s = new Set(p);
//                       s.delete(targetDoc);
//                       return s;
//                     });
//                 }}
//                 className="px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 transition cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={performDelete}
//                 className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition cursor-pointer text-white font-semibold"
//               >
//                 {verifying ? "Verifying..." : "Confirm Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MAIN CARD */}
//       <div
//         className="
//     w-full max-w-5xl
//     bg-white/5 border border-white/10 rounded-2xl
//     p-6 md:p-8 shadow-xl sm:mt-10 lg:mt-8
//   "
//       >
//         <h1 className="text-3xl md:text-4xl font-bold text-center">
//           Merchant KYC
//         </h1>
//         <p className="text-center text-gray-300 mt-2">
//           Check status or submit KYC to unlock full merchant features.
//         </p>

//         {/* STATUS PANEL */}
//         <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10 cursor-default">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h2 className="text-lg font-semibold">KYC Status</h2>
//               <p className={`${kycStatusColor} text-xl font-bold mt-1`}>
//                 {kycStatus} 🛡️
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-300">
//               <div>
//                 <strong>Name:</strong> {merchant.name}
//               </div>
//               <div>
//                 <strong>Email:</strong> {merchant.email}
//               </div>
//               <div>
//                 <strong>Phone:</strong> {merchant.phone}
//               </div>
//               <div>
//                 <strong>Bank:</strong> {merchant.bank?.bankName || "Not added"}
//               </div>
//               <div>
//                 <strong>Account:</strong>{" "}
//                 {merchant.bank?.accountNumber || "Not added"}
//               </div>
//               <div>
//                 <strong>IFSC:</strong> {merchant.bank?.ifsc || "Not added"}
//               </div>
//             </div>
//           </div>

//           {/* ACTION BUTTONS BASED ON KYC STATUS */}
//           {kycStatus === "Verified" ? (
//             <div className="flex gap-3 mt-4">
//               <button
//                 className="bg-white text-black py-2 px-4 rounded-md font-bold cursor-pointer hover:bg-gray-200 transition"
//                 onClick={resetAndGoToUpdate}
//               >
//                 Update KYC
//               </button>

//               <button
//                 className="bg-red-500 text-white py-2 px-4 rounded-md font-bold cursor-pointer hover:bg-red-600 transition"
//                 onClick={() => openConfirm("all")}
//               >
//                 Delete KYC
//               </button>
//             </div>
//           ) : kycStatus === "Pending Verification" ? (
//             <p className="mt-4 text-yellow-400 font-semibold">
//               Your KYC has been submitted and is currently under review.
//               Verification may take up to 24 hours.
//             </p>
//           ) : (
//             <p className="mt-4 text-gray-300">
//               Please submit your KYC to unlock full merchant features.
//             </p>
//           )}
//         </div>

//         {/* FORM / Existing docs */}
//         {kycStatus === "Not Submitted" && (
//           <>
//             <h2 className="text-2xl font-semibold mt-6">Submit KYC</h2>

//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4"
//             >
//               {/* Personal */}
//               <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   name="firstName"
//                   placeholder="First Name *"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.firstName}
//                 />
//                 <input
//                   name="lastName"
//                   placeholder="Last Name *"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.lastName}
//                 />
//                 <input
//                   name="fatherName"
//                   placeholder="Father's Name"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.fatherName}
//                 />
//                 <input
//                   type="date"
//                   name="dateOfBirth"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.dateOfBirth}
//                 />
//                 <select
//                   name="gender"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.gender}
//                 >
//                   <option>Male</option>
//                   <option>Female</option>
//                   <option>Other</option>
//                 </select>
//               </div>

//               {/* Address */}
//               <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <textarea
//                   name="fullAddress"
//                   rows={3}
//                   placeholder="Full Address *"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none col-span-2"
//                   onChange={handleChange}
//                   value={form.fullAddress}
//                 />
//                 <input
//                   name="city"
//                   placeholder="City"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.city}
//                 />
//                 <input
//                   name="state"
//                   placeholder="State"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.state}
//                 />
//                 <input
//                   name="pincode"
//                   placeholder="Pincode"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.pincode}
//                 />
//               </div>

//               {/* IDs */}
//               <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <input
//                   name="aadhaarNumber"
//                   placeholder="Aadhaar Number *"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.aadhaarNumber}
//                 />
//                 <input
//                   name="panNumber"
//                   placeholder="PAN Number *"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.panNumber}
//                 />
//                 <input
//                   name="gstNumber"
//                   placeholder="GST Number (Optional)"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.gstNumber}
//                 />
//               </div>

//               {/* Bank */}
//               <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   name="accountName"
//                   placeholder="Account Holder Name"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.accountName}
//                 />
//                 <input
//                   name="accountNumber"
//                   placeholder="Account Number"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.accountNumber}
//                 />
//                 <input
//                   name="ifsc"
//                   placeholder="IFSC Code"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.ifsc}
//                 />
//                 <input
//                   name="bankName"
//                   placeholder="Bank Name"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.bankName}
//                 />
//                 <input
//                   name="upi"
//                   placeholder="UPI ID"
//                   className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
//                   onChange={handleChange}
//                   value={form.upi}
//                 />
//               </div>

//               {/* Uploads */}
//               <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="relative">
//                   <FileBox
//                     label="Profile Image *"
//                     name="profileImage"
//                     accept="image/*"
//                     capture="user"
//                     onChange={handleFile}
//                     previewUrl={getPreview("profileImage")}
//                     local={!!files.profileImage}
//                     onLocalRemove={() => removeLocalFile("profileImage")}
//                   />
//                   {getPreview("profileImage") &&
//                     !files.profileImage &&
//                     !removedDocs.has("profileImage") && (
//                       <button
//                         title="Delete"
//                         onClick={() => onPreviewDeleteClick("profileImage")}
//                         className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow"
//                       >
//                         ×
//                       </button>
//                     )}
//                 </div>

//                 <div className="relative">
//                   <FileBox
//                     label="Aadhaar Front *"
//                     name="aadhaarFront"
//                     accept="image/*"
//                     capture="environment"
//                     onChange={handleFile}
//                     previewUrl={getPreview("aadhaarFront")}
//                     local={!!files.aadhaarFront}
//                     onLocalRemove={() => removeLocalFile("aadhaarFront")}
//                   />
//                   {/* floating delete for cloud preview */}
//                   {getPreview("aadhaarFront") &&
//                     !files.aadhaarFront &&
//                     !removedDocs.has("aadhaarFront") && (
//                       <button
//                         title="Delete"
//                         onClick={() => onPreviewDeleteClick("aadhaarFront")}
//                         className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
//                       >
//                         ×
//                       </button>
//                     )}
//                 </div>

//                 <div className="relative">
//                   <FileBox
//                     label="Aadhaar Back *"
//                     name="aadhaarBack"
//                     accept="image/*"
//                     capture="environment"
//                     onChange={handleFile}
//                     previewUrl={getPreview("aadhaarBack")}
//                     local={!!files.aadhaarBack}
//                     onLocalRemove={() => removeLocalFile("aadhaarBack")}
//                   />
//                   {getPreview("aadhaarBack") &&
//                     !files.aadhaarBack &&
//                     !removedDocs.has("aadhaarBack") && (
//                       <button
//                         title="Delete"
//                         onClick={() => onPreviewDeleteClick("aadhaarBack")}
//                         className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
//                       >
//                         ×
//                       </button>
//                     )}
//                 </div>

//                 <div className="relative">
//                   <FileBox
//                     label="PAN Card *"
//                     name="panFile"
//                     accept="image/*"
//                     capture="environment"
//                     onChange={handleFile}
//                     previewUrl={getPreview("panFile")}
//                     local={!!files.panFile}
//                     onLocalRemove={() => removeLocalFile("panFile")}
//                   />
//                   {getPreview("panFile") &&
//                     !files.panFile &&
//                     !removedDocs.has("panFile") && (
//                       <button
//                         title="Delete"
//                         onClick={() => onPreviewDeleteClick("panFile")}
//                         className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
//                       >
//                         ×
//                       </button>
//                     )}
//                 </div>

//                 <div className="relative">
//                   <FileBox
//                     label="GST File (Optional)"
//                     name="gstFile"
//                     accept="image/*"
//                     capture="environment"
//                     onChange={handleFile}
//                     previewUrl={getPreview("gstFile")}
//                     local={!!files.gstFile}
//                     onLocalRemove={() => removeLocalFile("gstFile")}
//                   />
//                   {getPreview("gstFile") &&
//                     !files.gstFile &&
//                     !removedDocs.has("gstFile") && (
//                       <button
//                         title="Delete"
//                         onClick={() => onPreviewDeleteClick("gstFile")}
//                         className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black-600 text-white flex items-center justify-center shadow"
//                       >
//                         ×
//                       </button>
//                     )}
//                 </div>

//                 <div className="relative">
//                   <FileBox
//                     label="Passbook First Page *"
//                     name="passbookFile"
//                     accept="image/*"
//                     capture="environment"
//                     onChange={handleFile}
//                     previewUrl={getPreview("passbookFile")}
//                     local={!!files.passbookFile}
//                     onLocalRemove={() => removeLocalFile("passbookFile")}
//                   />
//                   {getPreview("passbookFile") &&
//                     !files.passbookFile &&
//                     !removedDocs.has("passbookFile") && (
//                       <button
//                         title="Delete"
//                         onClick={() => onPreviewDeleteClick("passbookFile")}
//                         className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow"
//                       >
//                         ×
//                       </button>
//                     )}
//                 </div>
//               </div>
//               {/* TERMS CHECKBOX */}
//               <div className="col-span-1 md:col-span-2 mt-2">
//                 <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={agree}
//                     onChange={(e) => setAgree(e.target.checked)}
//                     className="w-4 h-4 mt-1 cursor-pointer accent-green-500"
//                     required
//                   />

//                   <span className="leading-relaxed">
//                     I agree to the{" "}
//                     <a
//                       href="/terms"
//                       className="text-blue-400  hover:text-blue-200 transition-colors"
//                     >
//                       Terms & Conditions
//                     </a>
//                     ,{" "}
//                     <a
//                       href="/privacy-policy"
//                       className="text-blue-400 hover:text-blue-200 transition-colors"
//                     >
//                       Privacy Policy
//                     </a>
//                     ,{" "}
//                     <a
//                       href="/shipping-policy"
//                       className="text-blue-400 hover:text-blue-200 transition-colors"
//                     >
//                       Shipping & Delivery Policy
//                     </a>
//                     ,{" "}
//                     <a
//                       href="/refund-policy"
//                       className="text-blue-400 hover:text-blue-200 transition-colors"
//                     >
//                       Refund & Return Policy
//                     </a>{" "}
//                     and{" "}
//                     <a
//                       href="/legal"
//                       className="text-blue-400 hover:text-blue-200 transition-colors"
//                     >
//                       Legal Guidelines
//                     </a>
//                     . I confirm that all information and documents provided are
//                     true and correct.
//                   </span>
//                 </label>
//               </div>

//               <button
//                 className="col-span-1 md:col-span-2 bg-white text-black py-3 rounded-md font-bold hover:bg-black hover:text-white transition cursor-pointer"
//                 type="submit"
//               >
//                 Submit KYC
//               </button>
//             </form>
//           </>
//         )}

//         <style>{`
//           .input { cursor: text; }
//           .file-box input[type=file] { cursor: pointer; opacity: 0.999; } /* ensure pointer on mobile */
//           .file-box { cursor: pointer; }
//           button { cursor: pointer; }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default Kyc;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

/**
 * FileBox - shows label, file input and preview.
 * Accepts capture prop (for camera support on mobile).
 * Shows a preview image and (optionally) a floating delete button (handled outside).
 */
const FileBox = ({
  label,
  name,
  accept,
  capture,
  onChange,
  previewUrl,
  local,
  onLocalRemove,
}) => {
  return (
    <label className="file-box relative cursor-pointer flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/6 transition items-start">
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
          <div className="relative">
            <img
              src={previewUrl}
              alt={label}
              className="w-16 h-12 object-cover rounded-md border border-white/10 cursor-pointer"
            />
            {local && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLocalRemove && onLocalRemove();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow"
                title="Remove selected file"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="w-16 h-12 rounded-md border border-white/10 bg-white/3 flex items-center justify-center text-xs text-gray-300">
            No preview
          </div>
        )}
      </div>
    </label>
  );
};

const emptyForm = {
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
};

const initialFiles = {
  aadhaarFront: null,
  aadhaarBack: null,
  panFile: null,
  gstFile: null,
  passbookFile: null,
  profileImage: null,
};

const Kyc = () => {
  const token = localStorage.getItem("merchantToken");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [merchant, setMerchant] = useState(null);

  const [form, setForm] = useState({ ...emptyForm });
  const [files, setFiles] = useState({ ...initialFiles });

  // Delete KYC modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState("all"); // "all" | "single"
  const [targetDoc, setTargetDoc] = useState(null);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Update KYC flow state
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [updatePasswordOpen, setUpdatePasswordOpen] = useState(false);
  const [updatePassword, setUpdatePassword] = useState("");

  // terms checkbox
  const [agree, setAgree] = useState(false);

  const passwordRef = useRef(null);
  const updatePasswordRef = useRef(null);

  // Track optimistic deletions for previews
  const [removedDocs, setRemovedDocs] = useState(new Set());

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyModalOpen = confirmOpen || updateConfirmOpen || updatePasswordOpen;
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [confirmOpen, updateConfirmOpen, updatePasswordOpen]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const name = e.target.name;
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [name]: file }));

    setRemovedDocs((prevSet) => {
      if (prevSet.has(name)) {
        const next = new Set(prevSet);
        next.delete(name);
        return next;
      }
      return prevSet;
    });
  };

  const localPreview = (file) => (file ? URL.createObjectURL(file) : null);

  const getPreview = (field) => {
    if (removedDocs.has(field)) return localPreview(files[field]) || null;

    if (files[field]) return localPreview(files[field]);
    if (!merchant) return null;

    if (field === "profileImage") return merchant.profileImage || null;
    if (field === "passbookFile") return merchant.bank?.passbookFile || null;
    return merchant.documents?.[field] || null;
  };

  const loadMerchant = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/merchant/profile`, {
        headers: { token },
      });
      if (!res.data.success) return;

      setMerchant(res.data.merchant);
      const m = res.data.merchant;

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
    }
  };

  useEffect(() => {
    loadMerchant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFormToEmpty = () => {
    setForm({ ...emptyForm });
    setFiles({ ...initialFiles });
    setRemovedDocs(new Set());
    setAgree(false);
  };

  const resetLocalFiles = () => {
    setFiles({ ...initialFiles });
    setRemovedDocs(new Set());
    setAgree(false);

    if (merchant) {
      setForm((prev) => ({
        ...prev,
        firstName: merchant.firstName || prev.firstName,
        lastName: merchant.lastName || prev.lastName,
        fatherName: merchant.fatherName || prev.fatherName,
        dateOfBirth: merchant.dateOfBirth || prev.dateOfBirth,
        gender: merchant.gender || prev.gender,
        fullAddress: merchant.address?.fullAddress || prev.fullAddress,
        city: merchant.address?.city || prev.city,
        state: merchant.address?.state || prev.state,
        pincode: merchant.address?.pincode || prev.pincode,
        country: merchant.address?.country || prev.country,
        aadhaarNumber: merchant.aadhaarNumber || prev.aadhaarNumber,
        panNumber: merchant.panNumber || prev.panNumber,
        gstNumber: merchant.gstNumber || prev.gstNumber,
        accountName: merchant.bank?.accountName || prev.accountName,
        accountNumber: merchant.bank?.accountNumber || prev.accountNumber,
        ifsc: merchant.bank?.ifsc || prev.ifsc,
        bankName: merchant.bank?.bankName || prev.bankName,
        upi: merchant.bank?.upi || prev.upi,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName) {
      toast.error("First & Last Name required");
      return;
    }

    if (!form.aadhaarNumber || !form.panNumber) {
      toast.error("Aadhaar & PAN required");
      return;
    }

    if (!agree) {
      toast.error(
        "You must agree to the terms & policies before submitting KYC."
      );
      return;
    }

    const hasAadhaar =
      merchant?.documents?.aadhaarFront && merchant?.documents?.aadhaarBack;
    const hasPan = merchant?.documents?.panFile;

    if (!files.aadhaarFront && !files.aadhaarBack && !files.panFile) {
      if (!hasAadhaar || !hasPan) {
        toast.error("Aadhaar front/back & PAN required");
        return;
      }
    }

    try {
      setLoading(true);

      const f = new FormData();
      Object.keys(form).forEach((key) => f.append(key, form[key]));
      Object.keys(files).forEach((key) => {
        if (files[key]) f.append(key, files[key]);
      });

      const res = await axios.post(`${backendUrl}/api/merchant/kyc`, f, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      setLoading(false);

      if (!res.data.success) {
        toast.error(res.data.message || "KYC submit failed");
        return;
      }

      toast.success(
        "KYC submitted successfully! Verification may take up to 24 hours."
      );

      await loadMerchant();
      resetLocalFiles();
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "KYC failed");
    }
  };

  const openConfirm = (mode = "all", doc = null) => {
    setConfirmMode(mode);
    setTargetDoc(doc);
    setPassword("");
    setConfirmOpen(true);
    setTimeout(() => passwordRef.current?.focus(), 120);
  };

  const removeLocalFile = (field) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
  };

  const onPreviewDeleteClick = (field) => {
    const isLocal = !!files[field];
    if (isLocal) {
      removeLocalFile(field);
      return;
    }

    const existsCloud =
      field === "passbookFile"
        ? !!merchant?.bank?.passbookFile
        : field === "profileImage"
        ? !!merchant?.profileImage
        : !!merchant?.documents?.[field];

    if (!existsCloud) {
      setRemovedDocs((prev) => {
        const s = new Set(prev);
        s.delete(field);
        return s;
      });
      return;
    }

    setRemovedDocs((prev) => new Set(prev).add(field));
    openConfirm("single", field);
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

  const performDelete = async () => {
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

        if (confirmMode === "single" && targetDoc) {
          setRemovedDocs((prev) => {
            const s = new Set(prev);
            s.delete(targetDoc);
            return s;
          });
        }
        return;
      }

      if (confirmMode === "all") {
        const docs = [
          "aadhaarFront",
          "aadhaarBack",
          "panFile",
          "gstFile",
          "passbookFile",
          "profileImage",
        ];

        for (let doc of docs) {
          const exists =
            doc === "passbookFile"
              ? !!merchant?.bank?.passbookFile
              : doc === "profileImage"
              ? !!merchant?.profileImage
              : !!merchant?.documents?.[doc];

          if (!exists) continue;

          await axios.delete(`${backendUrl}/api/merchant/kyc/${doc}`, {
            headers: { token },
          });
        }

        toast.success("All KYC documents deleted!");
        resetFormToEmpty();
        await loadMerchant();
      } else {
        if (!targetDoc) {
          toast.error("No document selected");
          setLoading(false);
          return;
        }

        await axios.delete(`${backendUrl}/api/merchant/kyc/${targetDoc}`, {
          headers: { token },
        });

        toast.success(`${targetDoc} deleted`);

        setRemovedDocs((prev) => {
          const s = new Set(prev);
          s.delete(targetDoc);
          return s;
        });

        setFiles((prev) => ({ ...prev, [targetDoc]: null }));
        await loadMerchant();
      }

      setConfirmOpen(false);
      setLoading(false);
    } catch (err) {
      console.error("DELETE ERROR:", err);
      setLoading(false);
      setConfirmOpen(false);
      toast.error("Failed to delete KYC document(s)");
      await loadMerchant();
      setRemovedDocs(new Set());
    }
  };

  // ========= UPDATE KYC FLOW =========

  const startUpdateFlow = () => {
    setUpdateConfirmOpen(true);
  };

  const handleUpdateProceed = () => {
    setUpdateConfirmOpen(false);
    setUpdatePassword("");
    setUpdatePasswordOpen(true);
    setTimeout(() => updatePasswordRef.current?.focus(), 120);
  };

  const handleUpdatePasswordConfirm = async () => {
    if (!updatePassword) {
      toast.error("Please enter your account password");
      return;
    }

    const ok = await verifyPassword(updatePassword);
    if (!ok) {
      toast.error("Incorrect password");
      return;
    }

    setUpdatePasswordOpen(false);
    setUpdatePassword("");
    toast.success("Password verified. You can now update your KYC.");
    resetFormToEmpty();
    setTimeout(() => navigate("/update-kyc"), 80);
  };

  // ========= KYC STATUS =========

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

  if (!merchant) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br from-black via-gray-900 to-black 
        p-4 md:p-6 text-white flex justify-center
        pt-[30px] sm:pt-[60px] lg:pt-[50px]
      "
    >
      {/* GLOBAL LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
          <p className="mt-4 text-gray-300">Please wait...</p>
        </div>
      )}

      {/* DELETE KYC CONFIRM MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-white/6 border border-white/20 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-3">Confirm Delete</h3>
            <p className="text-sm text-gray-300 mb-4">
              Enter your password to confirm{" "}
              {confirmMode === "all"
                ? "deleting all KYC documents"
                : `deleting ${targetDoc}`}
              .
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
                onClick={() => {
                  setConfirmOpen(false);
                  if (confirmMode === "single" && targetDoc)
                    setRemovedDocs((p) => {
                      const s = new Set(p);
                      s.delete(targetDoc);
                      return s;
                    });
                }}
                className="px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition cursor-pointer text-white font-semibold"
              >
                {verifying ? "Verifying..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE KYC CONFIRM MODAL */}
      {updateConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setUpdateConfirmOpen(false)}
          />
          <div className="relative bg-white/6 border border-white/20 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-3">Update KYC?</h3>
            <p className="text-sm text-gray-300 mb-4">
              Updating your KYC will trigger a fresh review of your documents.
              This process can take up to <b>24 hours</b>. During this time,
              your updated details will be under verification.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setUpdateConfirmOpen(false)}
                className="px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProceed}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition cursor-pointer text-white font-semibold"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE KYC PASSWORD MODAL */}
      {updatePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setUpdatePasswordOpen(false)}
          />
          <div className="relative bg-white/6 border border-white/20 rounded-xl p-6 w-full max-w-md backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-3">Verify Password</h3>
            <p className="text-sm text-gray-300 mb-4">
              For security reasons, please enter your account password to
              continue updating your KYC.
            </p>

            <input
              ref={updatePasswordRef}
              value={updatePassword}
              onChange={(e) => setUpdatePassword(e.target.value)}
              type="password"
              placeholder="Your account password"
              className="w-full p-3 rounded-md bg:white/5 bg-white/5 border border-white/10 text-white outline-none mb-4"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setUpdatePasswordOpen(false);
                  setUpdatePassword("");
                }}
                className="px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePasswordConfirm}
                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition cursor-pointer text-white font-semibold"
              >
                {verifying ? "Verifying..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div
        className="
          w-full max-w-5xl 
          bg-white/5 border border-white/10 rounded-2xl 
          p-6 md:p-8 shadow-xl sm:mt-10 lg:mt-8
        "
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Merchant KYC
        </h1>
        <p className="text-center text-gray-300 mt-2">
          Check status or submit KYC to unlock full merchant features.
        </p>

        {/* STATUS PANEL */}
        <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10 cursor-default">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">KYC Status</h2>
              <p className={`${kycStatusColor} text-xl font-bold mt-1`}>
                {kycStatus} 🛡️
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-300">
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

          {/* ACTION BUTTONS - ONLY WHEN VERIFIED */}
          {kycStatus === "Verified" && (
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                className="bg-white text-black py-2 px-4 rounded-md font-bold cursor-pointer hover:bg-gray-200 transition"
                onClick={startUpdateFlow}
              >
                Update KYC
              </button>
            </div>
          )}
        </div>

        {/* FORM / EXISTING DOCS / PENDING VIEW */}
        {kycStatus === "Not Submitted" && (
          <>
            <h2 className="text-2xl font-semibold mt-6">Submit KYC</h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0
 gap-5 mt-4"
            >
              {/* Personal */}
              <div
                className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0
 gap-4"
              >
                <input
                  name="firstName"
                  placeholder="First Name *"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.firstName}
                />
                <input
                  name="lastName"
                  placeholder="Last Name *"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.lastName}
                />
                <input
                  name="fatherName"
                  placeholder="Father's Name"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.fatherName}
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.dateOfBirth}
                />
                <select
                  name="gender"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.gender}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Address Section */}
              <div className="col-span-1 md:col-span-2 space-y-4 w-full">
                {/* Full Address */}
                <textarea
                  name="fullAddress"
                  rows={3}
                  placeholder="Full Address *"
                  className="p-3 rounded-md bg-white/5 border border-white/10 outline-none 
               w-full min-w-0"
                  onChange={handleChange}
                  value={form.fullAddress}
                />

                {/* City / State / Pincode - FULLY RESPONSIVE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full min-w-0">
                  <input
                    name="city"
                    placeholder="City"
                    className="p-3 rounded-md bg-white/5 border border-white/10 outline-none 
                 w-full min-w-0"
                    onChange={handleChange}
                    value={form.city}
                  />

                  <input
                    name="state"
                    placeholder="State"
                    className="p-3 rounded-md bg-white/5 border border-white/10 outline-none 
                 w-full min-w-0"
                    onChange={handleChange}
                    value={form.state}
                  />

                  <input
                    name="pincode"
                    placeholder="Pincode"
                    className="p-3 rounded-md bg-white/5 border border-white/10 outline-none 
                 w-full min-w-0"
                    onChange={handleChange}
                    value={form.pincode}
                  />
                </div>
              </div>

              {/* IDs */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name="aadhaarNumber"
                  placeholder="Aadhaar Number *"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.aadhaarNumber}
                />
                <input
                  name="panNumber"
                  placeholder="PAN Number *"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.panNumber}
                />
                <input
                  name="gstNumber"
                  placeholder="GST Number (Optional)"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.gstNumber}
                />
              </div>

              {/* Bank */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="accountName"
                  placeholder="Account Holder Name"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.accountName}
                />
                <input
                  name="accountNumber"
                  placeholder="Account Number"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.accountNumber}
                />
                <input
                  name="ifsc"
                  placeholder="IFSC Code"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.ifsc}
                />
                <input
                  name="bankName"
                  placeholder="Bank Name"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.bankName}
                />
                <input
                  name="upi"
                  placeholder="UPI ID"
                  className="input p-3 rounded-md bg-white/5 border border-white/10 outline-none"
                  onChange={handleChange}
                  value={form.upi}
                />
              </div>

              {/* Uploads */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FileBox
                    label="Profile Image *"
                    name="profileImage"
                    accept="image/*"
                    capture="user"
                    onChange={handleFile}
                    previewUrl={getPreview("profileImage")}
                    local={!!files.profileImage}
                    onLocalRemove={() => removeLocalFile("profileImage")}
                  />
                  {getPreview("profileImage") &&
                    !files.profileImage &&
                    !removedDocs.has("profileImage") && (
                      <button
                        title="Delete"
                        onClick={() => onPreviewDeleteClick("profileImage")}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    )}
                </div>

                <div className="relative">
                  <FileBox
                    label="Aadhaar Front *"
                    name="aadhaarFront"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    previewUrl={getPreview("aadhaarFront")}
                    local={!!files.aadhaarFront}
                    onLocalRemove={() => removeLocalFile("aadhaarFront")}
                  />
                  {getPreview("aadhaarFront") &&
                    !files.aadhaarFront &&
                    !removedDocs.has("aadhaarFront") && (
                      <button
                        title="Delete"
                        onClick={() => onPreviewDeleteClick("aadhaarFront")}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    )}
                </div>

                <div className="relative">
                  <FileBox
                    label="Aadhaar Back *"
                    name="aadhaarBack"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    previewUrl={getPreview("aadhaarBack")}
                    local={!!files.aadhaarBack}
                    onLocalRemove={() => removeLocalFile("aadhaarBack")}
                  />
                  {getPreview("aadhaarBack") &&
                    !files.aadhaarBack &&
                    !removedDocs.has("aadhaarBack") && (
                      <button
                        title="Delete"
                        onClick={() => onPreviewDeleteClick("aadhaarBack")}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    )}
                </div>

                <div className="relative">
                  <FileBox
                    label="PAN Card *"
                    name="panFile"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    previewUrl={getPreview("panFile")}
                    local={!!files.panFile}
                    onLocalRemove={() => removeLocalFile("panFile")}
                  />
                  {getPreview("panFile") &&
                    !files.panFile &&
                    !removedDocs.has("panFile") && (
                      <button
                        title="Delete"
                        onClick={() => onPreviewDeleteClick("panFile")}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    )}
                </div>

                <div className="relative">
                  <FileBox
                    label="GST File (Optional)"
                    name="gstFile"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    previewUrl={getPreview("gstFile")}
                    local={!!files.gstFile}
                    onLocalRemove={() => removeLocalFile("gstFile")}
                  />
                  {getPreview("gstFile") &&
                    !files.gstFile &&
                    !removedDocs.has("gstFile") && (
                      <button
                        title="Delete"
                        onClick={() => onPreviewDeleteClick("gstFile")}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black-600 text-white flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    )}
                </div>

                <div className="relative">
                  <FileBox
                    label="Passbook First Page *"
                    name="passbookFile"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    previewUrl={getPreview("passbookFile")}
                    local={!!files.passbookFile}
                    onLocalRemove={() => removeLocalFile("passbookFile")}
                  />
                  {getPreview("passbookFile") &&
                    !files.passbookFile &&
                    !removedDocs.has("passbookFile") && (
                      <button
                        title="Delete"
                        onClick={() => onPreviewDeleteClick("passbookFile")}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    )}
                </div>
              </div>

              {/* TERMS CHECKBOX */}
              <div className="col-span-1 md:col-span-2 mt-2">
                <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-4 h-4 mt-1 cursor-pointer accent-green-500"
                  />

                  <span className="leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-blue-400 hover:text-blue-200 transition-colors"
                    >
                      Terms &amp; Conditions
                    </a>
                    ,{" "}
                    <a
                      href="/privacy-policy"
                      className="text-blue-400 hover:text-blue-200 transition-colors"
                    >
                      Privacy Policy
                    </a>
                    ,{" "}
                    <a
                      href="/shipping-policy"
                      className="text-blue-400 hover:text-blue-200 transition-colors"
                    >
                      Shipping &amp; Delivery Policy
                    </a>
                    ,{" "}
                    <a
                      href="/refund-policy"
                      className="text-blue-400 hover:text-blue-200 transition-colors"
                    >
                      Refund &amp; Return Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/legal"
                      className="text-blue-400 hover:text-blue-200 transition-colors"
                    >
                      Legal Guidelines
                    </a>
                    . I confirm that all information and documents provided are
                    true and correct.
                  </span>
                </label>
              </div>

              <button
                className="col-span-1 md:col-span-2 bg-white text-black py-3 rounded-md font-bold hover:bg-gray-200 transition cursor-pointer"
                type="submit"
              >
                Submit KYC
              </button>
            </form>
          </>
        )}

        {/* PENDING VERIFICATION VIEW: ONLY STATUS, NOTHING ELSE */}
        {kycStatus === "Pending Verification" && (
          <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-50 text-sm">
            <p className="font-semibold">KYC Under Review</p>
            <p className="mt-1">
              Thank you for submitting your documents. Your KYC is currently
              being reviewed. This usually takes up to 24 hours. You&apos;ll see
              more options here once your KYC is verified.
            </p>
          </div>
        )}

        {/* VERIFIED: SHOW UPLOADED DOCUMENTS */}
        {kycStatus === "Verified" && (
          <>
            <h2 className="text-2xl font-semibold mt-6">
              Your uploaded documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 cursor-pointer">
              {/* Aadhaar Front */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Aadhaar Front</h3>
                {merchant.documents?.aadhaarFront ? (
                  <img
                    src={merchant.documents.aadhaarFront}
                    alt="Aadhaar Front"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-300">Not uploaded</p>
                )}
              </div>

              {/* Aadhaar Back */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Aadhaar Back</h3>
                {merchant.documents?.aadhaarBack ? (
                  <img
                    src={merchant.documents.aadhaarBack}
                    alt="Aadhaar Back"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-300">Not uploaded</p>
                )}
              </div>

              {/* PAN Card */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">PAN Card</h3>
                {merchant.documents?.panFile ? (
                  <img
                    src={merchant.documents.panFile}
                    alt="PAN"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-300">Not uploaded</p>
                )}
              </div>

              {/* Passbook */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Passbook</h3>
                {merchant.bank?.passbookFile ? (
                  <img
                    src={merchant.bank.passbookFile}
                    alt="Passbook"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-300">Not uploaded</p>
                )}
              </div>

              {/* Profile Image */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Profile Image</h3>
                {merchant.profileImage ? (
                  <img
                    src={merchant.profileImage}
                    alt="Profile"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-300">Not uploaded</p>
                )}
              </div>

              {/* GST */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">GST File</h3>
                {merchant.documents?.gstFile ? (
                  <img
                    src={merchant.documents.gstFile}
                    alt="GST"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-300">Not uploaded</p>
                )}
              </div>
            </div>
          </>
        )}

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

export default Kyc;