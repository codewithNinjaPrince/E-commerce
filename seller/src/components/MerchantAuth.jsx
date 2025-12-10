// import axios from "axios";
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { backendUrl } from "../App";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const MerchantAuth = ({ setMerchantToken }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // eye states
//   const [showPass, setShowPass] = useState(false);
//   const [showPass2, setShowPass2] = useState(false);

//   // register fields
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [storeName, setStoreName] = useState("");
//   const [storeDescription, setStoreDescription] = useState("");
//   const [businessType, setBusinessType] = useState("Individual");
//   const [address, setAddress] = useState("");

//   // common
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");

//   // password validation (UI only)
//   const validations = {
//     length: password.length >= 8,
//     upper: /[A-Z]/.test(password),
//     lower: /[a-z]/.test(password),
//     number: /[0-9]/.test(password),
//     special: /[^A-Za-z0-9]/.test(password),
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isLogin && password !== confirmPass) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     try {
//       setLoading(true);

//       const endpoint = isLogin
//         ? `${backendUrl}/api/merchant/login`
//         : `${backendUrl}/api/merchant/register`;

//       // FINAL FIX → sends EXACT backend-required address object
//       const payload = isLogin
//         ? { email, password }
//         : {
//             name: name.trim(),
//             email: email.trim(),
//             phone: phone.trim(),
//             password,
//             storeName: storeName.trim(),
//             storeDescription: storeDescription.trim(),
//             businessType,
//             address: {
//               fullAddress: address.trim(),
//               city: "Unknown",
//               state: "Unknown",
//               pincode: "000000",
//               country: "India",
//             },
//           };

//       const res = await axios.post(endpoint, payload);

//       if (!res.data.success) {
//         setLoading(false);
//         toast.error(res.data.message);
//         setLoading(false);
//         return;
//       }

//       if (isLogin) {
//         toast.success("Login successful 🎉");
//         setMerchantToken(res.data.token);
//         localStorage.setItem("merchantToken", res.data.token);
//         localStorage.setItem("merchantName", res.data.merchant?.name || "");
//       } else {
//         toast.success("Merchant registered! Now login.");
//         setIsLogin(true);
//       }
//       setTimeout(() => setLoading(false), 1400);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Something went wrong");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-10">

//       {/* ----------- LOADING --------- */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-40 pointer-events-none">
//           <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
//           {/* Loading Line */}
//           <div className="w-48 h-1 bg-gray-800 mt-6 overflow-hidden rounded-full">
//             <div className="h-full w-full bg-white animate-[loadingLine_1.2s_linear_infinite]"></div>
//           </div>
//           {/* Funny Text */}
//           <p className="text-white mt-6 text-sm flex items-center gap-2 animate-pulse">
//             {isLogin ? "Dusting your dashboard... 🧹💼" : "Setting up your mini-store... 🏪✨"}
//           </p>
//           {/* Animation Keyframes */}
//           <style>
//             {`@keyframes loadingLine {
//               0% { transform: translateX(-100%); }
//               100% { transform: translateX(100%); }
//             }`}
//           </style>
//         </div>

//       )}

//       {/* ----------- CARD ----------- */}
//       <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 px-10 py-10 rounded-2xl shadow-2xl">

//         <h1 className="text-3xl text-white text-center font-bold">
//           {isLogin ? "Merchant Login" : "Merchant Registration"}
//         </h1>

//         <p className="text-gray-300 mt-2 text-center text-sm">
//           Sell on <span className="font-semibold">BRAWVLY</span> & grow your business
//         </p>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="space-y-5 mt-8">

//           {!isLogin && (
//             <>
//               <input className="input" placeholder="Full Name" required value={name} onChange={(e)=>setName(e.target.value)} />
//               <input className="input" placeholder="Phone" required value={phone} onChange={(e)=>setPhone(e.target.value)} />
//               <input className="input" placeholder="Store Name" required value={storeName} onChange={(e)=>setStoreName(e.target.value)} />
//               <textarea className="input" placeholder="Store Description" rows={3} required value={storeDescription} onChange={(e)=>setStoreDescription(e.target.value)} />
//               <select className="input" value={businessType} onChange={(e)=>setBusinessType(e.target.value)}>
//                 <option>Individual</option>
//                 <option>Retail Shop</option>
//                 <option>Wholesale</option>
//                 <option>Manufacturer</option>
//               </select>
//               <textarea className="input" placeholder="Full Address" rows={3} required value={address} onChange={(e)=>setAddress(e.target.value)} />
//             </>
//           )}

//           {/* EMAIL */}
//           <input className="input" placeholder="Email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />

//           {/* PASSWORD */}
//           <div className="relative">
//             <input
//               type={showPass ? "text" : "password"}
//               className="input pr-12"
//               placeholder="Password"
//               required
//               value={password}
//               onChange={(e)=>setPassword(e.target.value)}
//             />
//             <span className="eye" onClick={()=>setShowPass(!showPass)}>
//               {showPass ? <FaEyeSlash/> : <FaEye/>}
//             </span>
//           </div>

//           {/* PASSWORD RULES */}
//           {!isLogin && (
//             <div className="text-xs pl-1 text-gray-300 space-y-1">
//               <p className={validations.length ? "text-green-400" : "text-red-400"}>✓ Minimum 8 characters</p>
//               <p className={validations.upper ? "text-green-400" : "text-red-400"}>✓ One uppercase</p>
//               <p className={validations.lower ? "text-green-400" : "text-red-400"}>✓ One lowercase</p>
//               <p className={validations.number ? "text-green-400" : "text-red-400"}>✓ One number</p>
//               <p className={validations.special ? "text-green-400" : "text-red-400"}>✓ One special character</p>
//             </div>
//           )}

//           {/* CONFIRM PASSWORD */}
//           {!isLogin && (
//             <div className="relative">
//               <input
//                 type={showPass2 ? "text" : "password"}
//                 className="input pr-12"
//                 placeholder="Confirm Password"
//                 required
//                 value={confirmPass}
//                 onChange={(e)=>setConfirmPass(e.target.value)}
//               />
//               {confirmPass && confirmPass !== password && (
//                 <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
//               )}
//             </div>
//           )}

//           <button className="w-full bg-white text-black py-3 rounded-lg font-semibold cursor-pointer">
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>

//         {/* SWITCH */}
//         <p className="text-gray-300 text-center mt-6 text-sm">
//           {isLogin ? "Don't have an account?" : "Already registered?"}
//           <span className="text-white ml-1 underline cursor-pointer" onClick={()=>setIsLogin(!isLogin)}>
//             {isLogin ? "Register" : "Login"}
//           </span>
//         </p>
//       </div>

//       {/* styles */}
//       <style>{`
//         .input {
//           width: 100%;
//           background: rgba(0,0,0,0.4);
//           padding: 12px 16px;
//           border-radius: 8px;
//           border: 1px solid #555;
//           color: white;
//           outline: none;
//         }
//         .input:focus { border-color: white; }
//         .eye {
//           position: absolute;
//           right: 14px;
//           top: 50%;
//           transform: translateY(-50%);
//           cursor: pointer;
//           color: #ccc;
//         }
//       `}</style>
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

  // error state
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  // password validation rules
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  // ---------------- VALIDATE BEFORE SUBMIT ----------------
  const validateForm = () => {
    const errors = {};

    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";

    if (!isLogin) {
      if (!name.trim()) errors.name = "Full name is required.";
      if (!phone.trim()) errors.phone = "Phone number is required.";
      if (!storeName.trim()) errors.storeName = "Store name is required.";
      if (!storeDescription.trim())
        errors.storeDescription = "Store description is required.";
      if (!address.trim()) errors.address = "Full address is required.";

      if (
        !validations.length ||
        !validations.upper ||
        !validations.lower ||
        !validations.number ||
        !validations.special
      ) {
        errors.password =
          "Password must contain 8+ chars, uppercase, lowercase, number & special character.";
      }

      if (!confirmPass) {
        errors.confirmPass = "Please confirm your password.";
      } else if (confirmPass !== password) {
        errors.confirmPass = "Passwords do not match.";
      }
    }

    setFieldErrors(errors);
    setFormError("");

    return Object.keys(errors).length === 0;
  };

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = validateForm();
    if (!ok) return;

    try {
      setLoading(true);
      setFormError("");
      setFieldErrors({});

      const endpoint = isLogin
        ? `${backendUrl}/api/merchant/login`
        : `${backendUrl}/api/merchant/register`;

      const payload = isLogin
        ? { email: email.trim(), password }
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
        handleServerError(res.data.message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        toast.success("Login successful 🎉");
        setMerchantToken(res.data.token);
        localStorage.setItem("merchantToken", res.data.token);
        localStorage.setItem("merchantName", res.data.merchant?.name || "");
      } else {
        toast.success("Merchant registered successfully! Please login.");
        setIsLogin(true);
        setPassword("");
        setConfirmPass("");
      }

      setLoading(false);
    } catch (err) {
      handleServerError(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
      setLoading(false);
    }
  };

  // ---------------- SERVER ERROR HANDLER (NO TOASTS ANYMORE) ----------------
  const handleServerError = (msg) => {
    const lower = msg.toLowerCase();
    const newErrors = {};

    if (isLogin) {
      if (lower.includes("password")) newErrors.password = msg;
      else if (lower.includes("merchant not found")) newErrors.email = msg;
      else if (lower.includes("inactive") || lower.includes("banned"))
        newErrors.email = msg;
      else setFormError(msg);
    } else {
      if (lower.includes("email") || lower.includes("phone")) {
        newErrors.email = msg;
        newErrors.phone = msg;
      } else setFormError(msg);
    }

    setFieldErrors((p) => ({ ...p, ...newErrors }));
  };

  // ---------------- SWITCH FORMS ----------------
  const switchToLogin = () => {
    setIsLogin(true);
    setFieldErrors({});
    setFormError("");
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setFieldErrors({});
    setFormError("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-10">
      {/* ---------- LOADING ---------- */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-40">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>

          <div className="w-48 h-1 bg-gray-800 mt-6 overflow-hidden rounded-full">
            <div className="h-full w-full bg-white animate-[loadingLine_1.2s_linear_infinite]"></div>
          </div>

          <p className="text-white mt-6 text-sm animate-pulse">
            {isLogin
              ? "Dusting your dashboard... 🧹💼"
              : "Setting up your mini-store... 🏪✨"}
          </p>

          <style>
            {`@keyframes loadingLine {
              0% {transform: translateX(-100%);}
              100% {transform: translateX(100%);}
            }`}
          </style>
        </div>
      )}

      {/* ---------- CARD ---------- */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 px-10 py-10 rounded-2xl shadow-2xl">
        <h1 className="text-3xl text-white text-center font-bold">
          {isLogin ? "Merchant Login" : "Merchant Registration"}
        </h1>

        <p className="text-gray-300 mt-2 text-center text-sm">
          Sell on <span className="font-semibold">BRAWVLY</span> & grow your
          business
        </p>

        {formError && (
          <div className="mt-5 bg-red-900/40 border border-red-600 text-red-200 text-sm px-4 py-2 rounded-md">
            {formError}
          </div>
        )}

        {/* ------- FORM ------- */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          {!isLogin && (
            <>
              <Field
                value={name}
                onChange={setName}
                placeholder="Full Name"
                error={fieldErrors.name}
              />
              <Field
                value={phone}
                onChange={setPhone}
                placeholder="Phone"
                error={fieldErrors.phone}
              />
              <Field
                value={storeName}
                onChange={setStoreName}
                placeholder="Store Name"
                error={fieldErrors.storeName}
              />
              <TextArea
                value={storeDescription}
                onChange={setStoreDescription}
                placeholder="Store Description"
                error={fieldErrors.storeDescription}
              />

              <select
                className="input"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option value="Individual">Individual</option>
                <option value="Retail Shop">Retail Shop</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Manufacturer">Manufacturer</option>
              </select>

              <TextArea
                value={address}
                onChange={setAddress}
                placeholder="Full Address"
                error={fieldErrors.address}
              />
            </>
          )}

          <Field
            value={email}
            type="email"
            onChange={setEmail}
            placeholder="Email"
            error={fieldErrors.email}
          />

          <PasswordField
            value={password}
            onChange={setPassword}
            show={showPass}
            toggle={() => setShowPass(!showPass)}
            placeholder="Password"
            error={fieldErrors.password}
          />

          {!isLogin && (
            <>
              <PasswordRules validations={validations} />

              <PasswordField
                value={confirmPass}
                onChange={setConfirmPass}
                show={showPass2}
                toggle={() => setShowPass2(!showPass2)}
                placeholder="Confirm Password"
                error={fieldErrors.confirmPass}
              />
            </>
          )}

          {/* BUTTON WITH NEW HOVER EFFECT */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-semibold cursor-pointer transition
                     hover:bg-gray-300 hover:scale-[1.02] hover:shadow-xl"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* SWITCH TEXT */}
        <p className="text-gray-300 text-center mt-6 text-sm">
          {isLogin ? (
            <span
              className="cursor-pointer inline-block transition hover:text-gray-200 hover:scale-[1.01]"
              onClick={switchToRegister}
            >
              Don&apos;t have an account?{" "}
              <span className="text-white underline">Register</span>
            </span>
          ) : (
            <span
              className="cursor-pointer inline-block transition hover:text-gray-200 hover:scale-[1.01]"
              onClick={switchToLogin}
            >
              Already registered?{" "}
              <span className="text-white underline">Login</span>
            </span>
          )}
        </p>
      </div>

      <style>{`
        .input {
  width: 100%;
  background: rgba(0,0,0,0.4);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #555;
  color: white;
  outline: none;
  height: 48px; 
}

        .input:focus { border-color: white; }

        /* FIX EYE ICON MISALIGNMENT */
        .eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #ccc;
          z-index: 20;
        }
      `}</style>
    </div>
  );
};

// ------------------ SMALL REUSABLE COMPONENTS ------------------

const Field = ({ value, onChange, placeholder, error, type = "text" }) => (
  <div>
    <input
      type={type}
      className="input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const TextArea = ({ value, onChange, placeholder, error }) => (
  <div>
    <textarea
      className="input"
      rows={3}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const PasswordField = ({ value, onChange, show, toggle, placeholder, error }) => (
  <div className="relative">
    
    {/* FIXED HEIGHT INPUT */}
    <input
      type={show ? "text" : "password"}
      className="input pr-12"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />

    {/* PERFECTLY CENTERED EYE ICON */}
    <span
      onClick={toggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
    >
      {show ? <FaEyeSlash /> : <FaEye />}
    </span>

    {/* RESERVED SPACE FOR ERROR (PREVENT SHIFTING) */}
    <div className="h-4 mt-1">
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>

  </div>
);


const PasswordRules = ({ validations }) => (
  <div className="text-xs pl-1 text-gray-300 space-y-1">
    <p className={validations.length ? "text-green-400" : "text-red-400"}>
      ✓ Minimum 8 characters
    </p>
    <p className={validations.upper ? "text-green-400" : "text-red-400"}>
      ✓ One uppercase
    </p>
    <p className={validations.lower ? "text-green-400" : "text-red-400"}>
      ✓ One lowercase
    </p>
    <p className={validations.number ? "text-green-400" : "text-red-400"}>
      ✓ One number
    </p>
    <p className={validations.special ? "text-green-400" : "text-red-400"}>
      ✓ One special character
    </p>
  </div>
);

export default MerchantAuth;
