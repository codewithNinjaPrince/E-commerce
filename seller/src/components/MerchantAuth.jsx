import axios from "axios";
import { socket } from "../socket";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SUPPORT_PHONE = "8736852549";
const SUPPORT_EMAIL = "brawly@gmail.com";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi BRAWVLY Support 👋\n\nI am a new merchant and need help with:\n\n" +
    "• Registration / Login\n" +
    "• Store setup\n" +
    "• KYC verification\n\n" +
    "My email: \nMy phone: \n\nThanks!"
);

const WHATSAPP_LINK = `https://wa.me/91${SUPPORT_PHONE}?text=${WHATSAPP_MESSAGE}`;

const MerchantAuth = ({ setMerchantToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  // eye states
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // register fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [businessType, setBusinessType] = useState("Individual");

  // common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // error state
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const errorRef = useRef(null);

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
      if (!agreeTerms) {
        errors.agreeTerms = "You must agree to Terms & Conditions.";
      }

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

    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }

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

      // 🔥 BACKEND ENUM SAFE MAPPING (NO UI CHANGE)
      const mappedBusinessType =
        businessType === "Retail Shop" || businessType === "Wholesale"
          ? "Partnership"
          : businessType === "Manufacturer"
          ? "Company"
          : "Individual";

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
          };

      const res = await axios.post(endpoint, payload);

      if (!res.data.success) {
        setFormError(res.data.message);
        setTimeout(() => {
          errorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
        setLoading(false);
        return;
      }

      if (isLogin) {
        toast.success("Login successful 🎉");

        setMerchantToken(res.data.token);
        localStorage.setItem("merchantToken", res.data.token);
        localStorage.setItem("merchantName", res.data.merchant?.name || "");
        localStorage.setItem("merchantId", res.data.merchantId);
        localStorage.setItem("merchantProfileImage",res.data.merchant?.profileImage || "");
        localStorage.setItem("merchantFirstName", res.data.merchant?.firstName || "");
        localStorage.setItem("merchantLastName",res.data.merchant?.lastName || ""
        );

        socket.connect();
        socket.emit("join_merchant", res.data.merchantId);

        // 🔥 NAVIGATE TO DASHBOARD
        navigate("/dashboard", { replace: true });
      } else {
        toast.success("Merchant registered successfully! Please login.");
        setIsLogin(true);
        setPassword("");
        setConfirmPass("");
      }

      setLoading(false);
    } catch (err) {
      setFormError(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
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
    setAgreeTerms(false);
    setFieldErrors({});
    setFormError("");
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setAgreeTerms(false);
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
          <div
            ref={errorRef}
            className="mt-5 bg-red-900/40 border border-red-600 text-red-200 text-sm px-4 py-2 rounded-md"
          >
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
                <option value="Company">Company</option>
                <option value="Partnership">Partnership</option>
              </select>

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

          {!isLogin && (
            <div className="mt-2">
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-white hover:text-blue-400"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-white hover:text-blue-400"
                  >
                    Privacy Policy
                  </a>
                </span>
              </div>

              {fieldErrors.agreeTerms && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.agreeTerms}
                </p>
              )}
            </div>
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
        <p className="text-gray-300 text-center mt-6 text-8px">
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

        {/* ---------- HELP SECTION ---------- */}
        <div className="mt-8 border-t border-white/20 pt-6">
          <h3 className="text-center text-white font-semibold mb-3">
            Need Help? 🤝
          </h3>

          <p className="text-center text-gray-400 text-sm mb-4">
            New here? Contact Us — we’ll guide you step by step.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:8736852549"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-lg py-3 text-white font-medium"
            >
              📞 Call
            </a>

            <a
              href="mailto:brawly@gmail.com"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-lg py-3 text-white font-medium"
            >
              📧 Email
            </a>

            <a
              href="https://wa.me/918736852549?text=Hi%20BRAWVLY%20Support%20👋%0A%0AI%20am%20a%20new%20merchant%20and%20need%20help%20with%20registration%2C%20store%20setup%20or%20KYC.%0A%0AThanks!"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition rounded-lg py-3 text-white font-medium"
            >
              💬 WhatsApp
            </a>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Support hours: 10 AM – 7 PM (Mon–Sat)
          </p>
        </div>
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

const PasswordField = ({
  value,
  onChange,
  show,
  toggle,
  placeholder,
  error,
}) => (
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
