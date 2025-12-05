// import axios from "axios";
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { backendUrl } from "../App"; // keep same import as you had
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const MerchantAuth = ({ setMerchantToken }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // Password visibility states
//   const [showPassword, setShowPassword] = useState(false); // explicit toggle (mobile/tap)
//   const [hoverPassword, setHoverPassword] = useState(false); // desktop hover-preview
//   const [showConfirm, setShowConfirm] = useState(false);

//   // Register fields
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [storeName, setStoreName] = useState("");
//   const [storeDescription, setStoreDescription] = useState("");
//   const [businessType, setBusinessType] = useState("Individual");
//   const [address, setAddress] = useState("");

//   // Common
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");

//   // Password validation rules (kept simple & synchronous)
//   const validations = {
//     length: password.length >= 8,
//     upper: /[A-Z]/.test(password),
//     lower: /[a-z]/.test(password),
//     number: /[0-9]/.test(password),
//     special: /[^A-Za-z0-9]/.test(password),
//   };
//   const isPasswordStrong = Object.values(validations).every(Boolean);

//   // Defensive: ensure backendUrl exists to avoid undefined network calls
//   const safeBackend = typeof backendUrl === "string" && backendUrl.length
//     ? backendUrl
//     : "http://localhost:4000"; // fallback for local dev

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // client-side checks
//     if (!isLogin) {
//       if (!isPasswordStrong) {
//         toast.error("Password is not strong enough");
//         return;
//       }
//       if (password !== confirmPass) {
//         toast.error("Passwords do not match");
//         return;
//       }
//     }

//     setLoading(true);
//     try {
//       const endpoint = isLogin
//         ? `${safeBackend}/api/merchant/login`
//         : `${safeBackend}/api/merchant/register`;

//       const payload = isLogin
//         ? { email, password }
//         : {
//             name,
//             email,
//             phone,
//             password,
//             storeName,
//             storeDescription,
//             businessType,
//             address,
//           };

//       const res = await axios.post(endpoint, payload, { timeout: 10000 });

//       if (!res?.data?.success) {
//         toast.error(res?.data?.message || "Request failed");
//         setLoading(false);
//         return;
//       }

//       if (isLogin) {
//         toast.success("Login successful 🎉");
//         if (typeof setMerchantToken === "function") {
//           setMerchantToken(res.data.token);
//         }
//         localStorage.setItem("merchantToken", res.data.token);
//         localStorage.setItem("merchantName", res.data.merchant?.name || "");
//       } else {
//         toast.success("Merchant registered successfully! 🎉");
//         setIsLogin(true); // switch to login after registration
//       }
//     } catch (err) {
//       // network or server error
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong with request";
//       toast.error(msg);
//     } finally {
//       setTimeout(() => setLoading(false), 400);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8">
//       {/* Loading overlay */}
//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
//           <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
//         </div>
//       )}

//       <div
//         className={`w-full max-w-lg bg-white/6 backdrop-blur-xl border border-white/10 px-8 py-8 rounded-2xl shadow-lg transition-transform`}
//       >
//         <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
//           {isLogin ? "Merchant Login" : "Merchant Registration"}
//         </h1>

//         <p className="text-sm text-gray-300 text-center mb-6">
//           Sell on <span className="font-semibold">BRAWVLY</span>
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Registration fields (only shown when registering) */}
//           {!isLogin && (
//             <>
//               <div>
//                 <label className="text-xs text-gray-300">Full Name</label>
//                 <input
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-xs text-gray-300">Phone</label>
//                 <input
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-xs text-gray-300">Store Name</label>
//                 <input
//                   value={storeName}
//                   onChange={(e) => setStoreName(e.target.value)}
//                   className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-xs text-gray-300">Store Description</label>
//                 <textarea
//                   value={storeDescription}
//                   onChange={(e) => setStoreDescription(e.target.value)}
//                   rows={2}
//                   className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs text-gray-300">Business Type</label>
//                 <select
//                   value={businessType}
//                   onChange={(e) => setBusinessType(e.target.value)}
//                   className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none"
//                 >
//                   <option>Individual</option>
//                   <option>Retail Shop</option>
//                   <option>Wholesale</option>
//                   <option>Manufacturer</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-xs text-gray-300">Address</label>
//                 <textarea
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   rows={2}
//                   className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none"
//                 />
//               </div>
//             </>
//           )}

//           {/* EMAIL */}
//           <div>
//             <label className="text-xs text-gray-300">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none"
//               required
//             />
//           </div>

//           {/* PASSWORD + eye icon */}
//           <div className="relative">
//             <label className="text-xs text-gray-300">Password</label>
//             <input
//               type={hoverPassword || showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onMouseEnter={() => !showPassword && setHoverPassword(true)}
//               onMouseLeave={() => !showPassword && setHoverPassword(false)}
//               className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none pr-12"
//               required
//             />
//             <button
//               type="button"
//               aria-label="Toggle password visibility"
//               onClick={() => {
//                 setShowPassword((s) => !s);
//                 setHoverPassword(false);
//               }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
//             >
//               {hoverPassword || showPassword ? (
//                 <FaEyeSlash size={18} />
//               ) : (
//                 <FaEye size={18} />
//               )}
//             </button>
//           </div>

//           {/* Password rules */}
//           {!isLogin && (
//             <div className="text-xs text-gray-300 space-y-0.5">
//               <div className={validations.length ? "text-green-400" : "text-red-400"}>
//                 • At least 8 characters
//               </div>
//               <div className={validations.upper ? "text-green-400" : "text-red-400"}>
//                 • One uppercase letter
//               </div>
//               <div className={validations.lower ? "text-green-400" : "text-red-400"}>
//                 • One lowercase letter
//               </div>
//               <div className={validations.number ? "text-green-400" : "text-red-400"}>
//                 • One number
//               </div>
//               <div className={validations.special ? "text-green-400" : "text-red-400"}>
//                 • One special character
//               </div>
//             </div>
//           )}

//           {/* CONFIRM PASSWORD */}
//           {!isLogin && (
//             <div className="relative">
//               <label className="text-xs text-gray-300">Confirm Password</label>
//               <input
//                 type={showConfirm ? "text" : "password"}
//                 value={confirmPass}
//                 onChange={(e) => setConfirmPass(e.target.value)}
//                 className="w-full bg-black/40 px-4 py-3 mt-1 rounded-lg border border-gray-700 text-white outline-none pr-12"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirm((s) => !s)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
//               >
//                 {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
//               </button>
//               {confirmPass && confirmPass !== password && (
//                 <div className="text-xs text-red-400 mt-1">Passwords do not match</div>
//               )}
//             </div>
//           )}

//           {/* Submit */}
//           <div>
//             <button
//               type="submit"
//               className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
//             >
//               {isLogin ? "Login" : "Register"}
//             </button>
//           </div>
//         </form>

//         {/* Switch */}
//         <div className="mt-4 text-center text-sm text-gray-300">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             onClick={() => setIsLogin((s) => !s)}
//             className="text-white underline ml-1"
//           >
//             {isLogin ? "Register" : "Login"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MerchantAuth;

import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MerchantAuth = ({ setMerchantToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // eye states
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // register fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [businessType, setBusinessType] = useState("Individual");
  const [address, setAddress] = useState("");

  // common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // password validation (UI only)
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPass) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin
        ? `${backendUrl}/api/merchant/login`
        : `${backendUrl}/api/merchant/register`;

      // FINAL FIX → sends EXACT backend-required address object
      const payload = isLogin
        ? { email, password }
        : {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            storeName: storeName.trim(),
            storeDescription: storeDescription.trim(),
            businessType,
            address: {
              fullAddress: address.trim(),
              city: "Unknown",
              state: "Unknown",
              pincode: "000000",
              country: "India",
            },
          };

      const res = await axios.post(endpoint, payload);

      if (!res.data.success) {
        setLoading(false);
        toast.error(res.data.message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        toast.success("Login successful 🎉");
        setMerchantToken(res.data.token);
        localStorage.setItem("merchantToken", res.data.token);
        localStorage.setItem("merchantName", res.data.merchant?.name || "");
      } else {
        toast.success("Merchant registered! Now login.");
        setIsLogin(true);
      }
      setTimeout(() => setLoading(false), 1400);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-10">

      {/* ----------- LOADING --------- */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-40 pointer-events-none">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
          {/* Loading Line */}
          <div className="w-48 h-1 bg-gray-800 mt-6 overflow-hidden rounded-full">
            <div className="h-full w-full bg-white animate-[loadingLine_1.2s_linear_infinite]"></div>
          </div>
          {/* Funny Text */}
          <p className="text-white mt-6 text-sm flex items-center gap-2 animate-pulse">
            {isLogin ? "Dusting your dashboard... 🧹💼" : "Setting up your mini-store... 🏪✨"}
          </p>
          {/* Animation Keyframes */}
          <style>
            {`@keyframes loadingLine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }`}
          </style>
        </div>
        
      )}

      {/* ----------- CARD ----------- */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 px-10 py-10 rounded-2xl shadow-2xl">

        <h1 className="text-3xl text-white text-center font-bold">
          {isLogin ? "Merchant Login" : "Merchant Registration"}
        </h1>

        <p className="text-gray-300 mt-2 text-center text-sm">
          Sell on <span className="font-semibold">BRAWVLY</span> & grow your business
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">

          {!isLogin && (
            <>
              <input className="input" placeholder="Full Name" required value={name} onChange={(e)=>setName(e.target.value)} />
              <input className="input" placeholder="Phone" required value={phone} onChange={(e)=>setPhone(e.target.value)} />
              <input className="input" placeholder="Store Name" required value={storeName} onChange={(e)=>setStoreName(e.target.value)} />
              <textarea className="input" placeholder="Store Description" rows={3} required value={storeDescription} onChange={(e)=>setStoreDescription(e.target.value)} />
              <select className="input" value={businessType} onChange={(e)=>setBusinessType(e.target.value)}>
                <option>Individual</option>
                <option>Retail Shop</option>
                <option>Wholesale</option>
                <option>Manufacturer</option>
              </select>
              <textarea className="input" placeholder="Full Address" rows={3} required value={address} onChange={(e)=>setAddress(e.target.value)} />
            </>
          )}

          {/* EMAIL */}
          <input className="input" placeholder="Email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="input pr-12"
              placeholder="Password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <span className="eye" onClick={()=>setShowPass(!showPass)}>
              {showPass ? <FaEyeSlash/> : <FaEye/>}
            </span>
          </div>

          {/* PASSWORD RULES */}
          {!isLogin && (
            <div className="text-xs pl-1 text-gray-300 space-y-1">
              <p className={validations.length ? "text-green-400" : "text-red-400"}>✓ Minimum 8 characters</p>
              <p className={validations.upper ? "text-green-400" : "text-red-400"}>✓ One uppercase</p>
              <p className={validations.lower ? "text-green-400" : "text-red-400"}>✓ One lowercase</p>
              <p className={validations.number ? "text-green-400" : "text-red-400"}>✓ One number</p>
              <p className={validations.special ? "text-green-400" : "text-red-400"}>✓ One special character</p>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          {!isLogin && (
            <div className="relative">
              <input
                type={showPass2 ? "text" : "password"}
                className="input pr-12"
                placeholder="Confirm Password"
                required
                value={confirmPass}
                onChange={(e)=>setConfirmPass(e.target.value)}
              />
              {confirmPass && confirmPass !== password && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
          )}

          <button className="w-full bg-white text-black py-3 rounded-lg font-semibold cursor-pointer">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* SWITCH */}
        <p className="text-gray-300 text-center mt-6 text-sm">
          {isLogin ? "Don't have an account?" : "Already registered?"}
          <span className="text-white ml-1 underline cursor-pointer" onClick={()=>setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>

      {/* styles */}
      <style>{`
        .input {
          width: 100%;
          background: rgba(0,0,0,0.4);
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #555;
          color: white;
          outline: none;
        }
        .input:focus { border-color: white; }
        .eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default MerchantAuth;

