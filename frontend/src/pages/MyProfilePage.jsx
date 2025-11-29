// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
// import { toast } from "react-toastify";
// import { assets } from "../assets/assets";

// const MyProfile = () => {
//   const { backendUrl, token } = useContext(ShopContext);

//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({});
//   const [editMode, setEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: {
//       street: "",
//       city: "",
//       state: "",
//       country: "",
//       pincode: "",
//     },
//   });

//   // Load Profile
//   const loadProfile = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/user/profile`, {
//         headers: {
//           token: token,
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success) {
//         const u = res.data.user || {};

//         // 🔥 Ensure address exists
//         u.address = u.address || {
//           street: "",
//           city: "",
//           state: "",
//           country: "",
//           pincode: "",
//         };

//         setUser(u);
//         setStats(res.data.stats || {});
//         setFormData(u);
//       }
//     } catch (err) {
//       toast.error("Failed to load profile");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   // Update Profile
//   const updateProfile = async () => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/user/update-profile`,
//         formData,
//         {
//           headers: {
//             token: token,
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success("Profile updated");
//         setEditMode(false);
//         loadProfile();
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (err) {
//       toast.error("Update failed");
//     }
//   };

//   // UPDATE PASSWORD
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const handlePasswordUpdate = async () => {
//     if (!oldPassword || !newPassword)
//       return toast.error("Please fill both fields");

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/user/update-password`,
//         { oldPassword, newPassword },
//         {
//           headers: {
//             token: token,
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success("Password updated!");
//         setOldPassword("");
//         setNewPassword("");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-[70vh] text-white">
//         <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
//       </div>
//     );

//   return (
//     <div className="p-5 sm:p-10 text-white max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">My Profile</h1>

//       {/* TOP CARD */}
//       <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-lg flex items-center gap-6">
//         <img src={assets.profile_icon} className="w-20 invert opacity-80" />

//         <div>
//           <h2 className="text-2xl font-semibold">{user?.name}</h2>
//           <p className="text-gray-400">{user?.email}</p>
//           <p className="text-gray-400">{user?.phone}</p>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Total Orders</p>
//           <h3 className="text-xl font-bold">{stats?.totalOrders || 0}</h3>
//         </div>

//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Spent</p>
//           <h3 className="text-xl font-bold">₹{stats?.totalSpent || 0}</h3>
//         </div>

//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Discount Saved</p>
//           <h3 className="text-xl font-bold">₹{stats?.totalDiscount || 0}</h3>
//         </div>

//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Saved (%)</p>
//           <h3 className="text-xl font-bold">
//             {stats?.discountPercentage || 0}%
//           </h3>
//         </div>
//       </div>

//       {/* PROFILE DETAILS */}
//       <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-lg mt-10">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Profile Details</h2>
//           <button
//             className="text-blue-400"
//             onClick={() => setEditMode(!editMode)}
//           >
//             {editMode ? "Cancel" : "Edit"}
//           </button>
//         </div>

//         <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
//           {/* NAME */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           />

//           {/* EMAIL */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />

//           {/* PHONE */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.phone}
//             onChange={(e) =>
//               setFormData({ ...formData, phone: e.target.value })
//             }
//           />

//           {/* STREET */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.address?.street}
//             placeholder="Street"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 address: { ...formData.address, street: e.target.value },
//               })
//             }
//           />

//           {/* CITY */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.address?.city}
//             placeholder="City"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 address: { ...formData.address, city: e.target.value },
//               })
//             }
//           />

//           {/* STATE */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.address?.state}
//             placeholder="State"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 address: { ...formData.address, state: e.target.value },
//               })
//             }
//           />

//           {/* COUNTRY */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.address?.country}
//             placeholder="Country"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 address: { ...formData.address, country: e.target.value },
//               })
//             }
//           />

//           {/* PINCODE */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.address?.pincode}
//             placeholder="Pincode"
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 address: { ...formData.address, pincode: e.target.value },
//               })
//             }
//           />
//         </div>

//         {/* PASSWORD CHANGE */}
//         <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mt-10">
//           <h2 className="text-xl font-semibold mb-4">Change Password</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <input
//               type="password"
//               placeholder="Old Password"
//               className="bg-black border border-white/20 p-2 rounded"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//             />

//             <input
//               type="password"
//               placeholder="New Password"
//               className="bg-black border border-white/20 p-2 rounded"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//           </div>

//           <button
//             onClick={handlePasswordUpdate}
//             className="mt-6 bg-white text-black px-8 py-2 rounded hover:bg-gray-300 transition"
//           >
//             Update Password
//           </button>
//         </div>

//         {editMode && (
//           <button
//             onClick={updateProfile}
//             className="mt-6 bg-white text-black px-8 py-2 rounded hover:bg-gray-300 transition"
//           >
//             Save Changes
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyProfile;


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
// import { toast } from "react-toastify";
// import { assets } from "../assets/assets";

// const MyProfile = () => {
//   const { backendUrl, token } = useContext(ShopContext);

//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({});
//   const [editMode, setEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: {
//       street: "",
//       city: "",
//       state: "",
//       country: "",
//       pincode: "",
//     },
//   });

//   /* ===========================
//       LOAD PROFILE (Token Safe)
//   ============================ */
//   const loadProfile = async () => {
//     if (!token) return; // Wait for token

//     setLoading(true);

//     try {
//       const res = await axios.get(`${backendUrl}/api/user/profile`, {
//         headers: { token },
//       });

//       if (res.data.success) {
//         const u = res.data.user || {};

//         // Ensure address exists
//         u.address = u.address || {
//           street: "",
//           city: "",
//           state: "",
//           country: "",
//           pincode: "",
//         };

//         setUser(u);
//         setStats(res.data.stats || {});
//         setFormData(u);
//       } else {
//         toast.error(res.data.message || "Failed to load");
//       }
//     } catch (err) {
//       toast.error("Failed to load profile");
//     }

//     setLoading(false);
//   };

//   /* ===========================
//       RUN ONLY WHEN TOKEN EXISTS
//   ============================ */
//   useEffect(() => {
//     if (token) loadProfile();
//   }, [token]);

//   /* ===========================
//         UPDATE PROFILE
//   ============================ */
//   const updateProfile = async () => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/user/update-profile`,
//         formData,
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         toast.success("Profile updated");
//         setEditMode(false);
//         loadProfile();
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   /* ===========================
//         UPDATE PASSWORD
//   ============================ */
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const handlePasswordUpdate = async () => {
//     if (!oldPassword || !newPassword)
//       return toast.error("Please fill both fields");

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/user/update-password`,
//         { oldPassword, newPassword },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         toast.success("Password updated!");
//         setOldPassword("");
//         setNewPassword("");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   /* ===========================
//          LOADING UI
//   ============================ */
//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-[70vh] text-white">
//         <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
//       </div>
//     );

//   /* ===========================
//           MAIN UI
//   ============================ */
//   return (
//     <div className="p-5 sm:p-10 text-white max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">My Profile</h1>

//       {/* TOP CARD */}
//       <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-lg flex items-center gap-6">
//         <img src={assets.profile_icon} className="w-20 invert opacity-80" />

//         <div>
//           <h2 className="text-2xl font-semibold">{user?.name}</h2>
//           <p className="text-gray-400">{user?.email}</p>
//           <p className="text-gray-400">{user?.phone}</p>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Total Orders</p>
//           <h3 className="text-xl font-bold">{stats?.totalOrders || 0}</h3>
//         </div>

//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Spent</p>
//           <h3 className="text-xl font-bold">₹{stats?.totalSpent || 0}</h3>
//         </div>

//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Discount Saved</p>
//           <h3 className="text-xl font-bold">₹{stats?.totalDiscount || 0}</h3>
//         </div>

//         <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
//           <p className="text-gray-400 text-sm">Saved (%)</p>
//           <h3 className="text-xl font-bold">{stats?.discountPercentage || 0}%</h3>
//         </div>
//       </div>

//       {/* PROFILE DETAILS */}
//       <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-lg mt-10">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Profile Details</h2>
//           <button
//             className="text-blue-400"
//             onClick={() => setEditMode(!editMode)}
//           >
//             {editMode ? "Cancel" : "Edit"}
//           </button>
//         </div>

//         <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
//           {/* NAME */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           />

//           {/* EMAIL */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />

//           {/* PHONE */}
//           <input
//             disabled={!editMode}
//             className="bg-black border border-white/20 p-2 rounded"
//             value={formData.phone}
//             onChange={(e) =>
//               setFormData({ ...formData, phone: e.target.value })
//             }
//           />

//           {/* ADDRESS FIELDS */}
//           {["street", "city", "state", "country", "pincode"].map((field) => (
//             <input
//               key={field}
//               disabled={!editMode}
//               className="bg-black border border-white/20 p-2 rounded"
//               placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//               value={formData.address?.[field] || ""}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   address: { ...formData.address, [field]: e.target.value },
//                 })
//               }
//             />
//           ))}
//         </div>

//         {/* PASSWORD CHANGE */}
//         <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mt-10">
//           <h2 className="text-xl font-semibold mb-4">Change Password</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <input
//               type="password"
//               placeholder="Old Password"
//               className="bg-black border border-white/20 p-2 rounded"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//             />

//             <input
//               type="password"
//               placeholder="New Password"
//               className="bg-black border border-white/20 p-2 rounded"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//           </div>

//           <button
//             onClick={handlePasswordUpdate}
//             className="mt-6 bg-white text-black px-8 py-2 rounded hover:bg-gray-300 transition"
//           >
//             Update Password
//           </button>
//         </div>

//         {/* SAVE BUTTON */}
//         {editMode && (
//           <button
//             onClick={updateProfile}
//             className="mt-6 bg-white text-black px-8 py-2 rounded hover:bg-gray-300 transition"
//           >
//             Save Changes
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyProfile;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const { backendUrl, token } = useContext(ShopContext);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [editMode, setEditMode] = useState(false);

  // --------------------------
  // SAFE FORM DATA
  // --------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  });

  // --------------------------
  // LOAD USER PROFILE
  // --------------------------
  // Load Profile (FINAL)
const loadProfile = async () => {
  try {
    if (!token) {
      console.log("⚠️ No token found in frontend");
      return;
    }

    console.log("Sending token:", token);

    const res = await axios.get(`${backendUrl}/api/user/profile`, {
      headers: {
        token: String(token)  // FORCE STRING
      }
    });

    console.log("Profile response:", res.data);

    if (res.data.success) {
      const u = res.data.user || {};

      // Ensure address exists
      u.address = u.address || {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      };

      setUser(u);
      setStats(res.data.stats || {});
      setFormData(u);
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.log("PROFILE ERROR FRONTEND:", err);
    toast.error("Failed to load profile");
  }

  setLoading(false);
};

useEffect(() => {
  if (token) {
    loadProfile();
  }
}, [token]);


  // --------------------------
  // UPDATE PROFILE
  // --------------------------
  const updateProfile = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Profile updated");
        setEditMode(false);
        loadProfile();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // --------------------------
  // UPDATE PASSWORD
  // --------------------------
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword)
      return toast.error("Please fill both fields");

    try {
      const res = await axios.post(
        `${backendUrl}/api/user/update-password`,
        { oldPassword, newPassword },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Password updated!");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // --------------------------
  // LOADING UI
  // --------------------------
  if (!token) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-white">
        <p className="text-gray-400">Loading authentication…</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-white">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // --------------------------
  // MAIN UI
  // --------------------------
  return (
    <div className="p-5 sm:p-10 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* TOP CARD */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-lg flex items-center gap-6">
        <img src={assets.profile_icon} className="w-20 invert opacity-80" />

        <div>
          <h2 className="text-2xl font-semibold">{user?.name}</h2>
          <p className="text-gray-400">{user?.email}</p>
          <p className="text-gray-400">{user?.phone}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <h3 className="text-xl font-bold">{stats.totalOrders}</h3>
        </div>

        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
          <p className="text-gray-400 text-sm">Spent</p>
          <h3 className="text-xl font-bold">₹{stats.totalSpent}</h3>
        </div>

        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
          <p className="text-gray-400 text-sm">Discount Saved</p>
          <h3 className="text-xl font-bold">₹{stats.totalDiscount}</h3>
        </div>

        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center">
          <p className="text-gray-400 text-sm">Saved (%)</p>
          <h3 className="text-xl font-bold">{stats.discountPercentage}%</h3>
        </div>
      </div>

      {/* DETAILS */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-lg mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profile Details</h2>
          <button className="text-blue-400" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* FORM */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <input
            disabled={!editMode}
            className="bg-black border border-white/20 p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            disabled={!editMode}
            className="bg-black border border-white/20 p-2 rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            disabled={!editMode}
            className="bg-black border border-white/20 p-2 rounded"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          {/* ADDRESS */}
          {["street", "city", "state", "country", "pincode"].map((key) => (
            <input
              key={key}
              disabled={!editMode}
              className="bg-black border border-white/20 p-2 rounded"
              value={formData.address[key]}
              placeholder={key.toUpperCase()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, [key]: e.target.value },
                })
              }
            />
          ))}
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mt-10">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="password"
              placeholder="Old Password"
              className="bg-black border border-white/20 p-2 rounded"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="bg-black border border-white/20 p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="mt-6 bg-white text-black px-8 py-2 rounded hover:bg-gray-300 transition"
          >
            Update Password
          </button>
        </div>

        {editMode && (
          <button
            onClick={updateProfile}
            className="mt-6 bg-white text-black px-8 py-2 rounded hover:bg-gray-300 transition"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
