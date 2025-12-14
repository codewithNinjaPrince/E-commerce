import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/* ---------------- HELPERS ---------------- */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordChecks = {
  length: (p) => p.length >= 8,
  upper: (p) => /[A-Z]/.test(p),
  lower: (p) => /[a-z]/.test(p),
  number: (p) => /[0-9]/.test(p),
  special: (p) => /[^A-Za-z0-9]/.test(p),
};

const getPasswordScore = (p) =>
  Object.values(passwordChecks).filter((fn) => fn(p)).length;

/* ---------------- COMPONENT ---------------- */
const Login = () => {
  const [mode, setMode] = useState("Login"); // Login | Sign Up
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  const { token, setToken, navigate, backendUrl, getUserCart } =
    useContext(ShopContext);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // OTP
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const passwordScore = getPasswordScore(password);

  /* ---------------- OTP HANDLERS ---------------- */
  const sendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (cooldown > 0) return;

    try {
      setOtpLoading(true);
      await axios.post(`${backendUrl}/api/user/send-otp`, { email, firstName });
      setOtpSent(true);
      setCooldown(60); // 1 minute cooldown
      toast.success("OTP sent to your email 📩");
    } catch (err) {
      const response = err?.response;

      if (response?.status === 409 && response?.data?.code === "EMAIL_EXISTS") {
        toast.info("Email already exists. Please login to continue 🙂");

        // FULL RESET
        setMode("Login");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
        setCooldown(0);

        return;
      }

      toast.error(
        response?.data?.message || "Unable to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/user/verify-otp`, { email, otp });
      setOtpVerified(true);
      toast.success("Email verified successfully ✅");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (mode === "Sign Up" && !agreeTerms) {
      toast.error("Please accept Terms & Conditions to continue");
      return;
    }

    if (mode === "Sign Up") {
      if (!otpVerified) {
        toast.error("Please verify email with OTP first");
        return;
      }

      if (passwordScore < 5) {
        toast.error(
          "Password must have uppercase, lowercase, number, special char & 8+ length"
        );
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      setLoading(true);

      const res =
        mode === "Sign Up"
          ? await axios.post(`${backendUrl}/api/user/register`, {
              firstName,
              lastName,
              email,
              password,
            })
          : await axios.post(`${backendUrl}/api/user/login`, {
              email,
              password,
            });

      if (!res.data.success) {
        toast.error(res.data.message);
        setLoading(false);
        return;
      }

      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.firstName);
      await getUserCart(res.data.token);

      if (redirectPath && redirectPath.startsWith("/")) {
        navigate(redirectPath);
      } else {
        navigate("/");
      }

      if (mode === "Sign Up") {
        toast.success("Account created 🎉");
      } else {
        const name = res.data?.user?.firstName || "there";
        toast.success(`Welcome back, ${name} 😎`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ---------------- UI ---------------- */
  return (
    <form
      onSubmit={onSubmitHandler}
      className="
  w-[92%] sm:max-w-[420px] mx-auto
  mt-12  sm:mt-14  lg:mt-20
  bg-white/5 backdrop-blur-xl
  border border-white/10 rounded-2xl
  p-6 sm:p-8
  shadow-2xl text-white
  flex flex-col gap-4
"
    >
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center tracking-wide">
        {mode === "Login" ? "Login User" : "Create Account"}
      </h2>

      <p className="text-center text-gray-400 text-10px">
        {mode === "Login"
          ? "Login to continue shopping"
          : "Verify email & create a secure account"}
      </p>

      {/* SIGN UP FIELDS */}
      {mode === "Sign Up" && (
        <div className="grid grid-cols-2 gap-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="dark-input"
            required
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="dark-input"
            required
          />
        </div>
      )}

      {/* EMAIL */}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        type="email"
        className="dark-input"
        required
      />

      {mode === "Sign Up" && !otpVerified && (
        <button
          type="button"
          onClick={sendOtp}
          disabled={otpLoading || cooldown > 0}
          className={`primary-btn flex items-center justify-center gap-2
      ${(otpLoading || cooldown > 0) && "opacity-60 cursor-not-allowed"}`}
        >
          {otpLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              Sending...
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : otpSent ? (
            "Resend OTP"
          ) : (
            "Send OTP"
          )}
        </button>
      )}

      {mode === "Sign Up" && otpSent && !otpVerified && (
        <div className="flex gap-2">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="dark-input flex-1"
          />
          <button type="button" onClick={verifyOtp} className="verify-btn">
            Verify
          </button>
        </div>
      )}

      {otpVerified && (
        <p className="text-green-400 text-sm text-center">
          ✔ Email verified successfully
        </p>
      )}

      {/* PASSWORD */}
      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="dark-input pr-11"
          required
        />
        <span onClick={() => setShowPass(!showPass)} className="eye-icon">
          {showPass ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {mode === "Login" && (
        <p
          className="text-right text-sm text-gray-200 cursor-pointer hover:text-blue-400"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </p>
      )}

      {/* PASSWORD RULES */}
      {mode === "Sign Up" && password && (
        <div className="grid grid-cols-2 gap-x-4 text-xs mt-1">
          <p className={passwordChecks.length(password) ? "ok" : "bad"}>
            • 8+ chars
          </p>
          <p className={passwordChecks.upper(password) ? "ok" : "bad"}>
            • Uppercase
          </p>
          <p className={passwordChecks.lower(password) ? "ok" : "bad"}>
            • Lowercase
          </p>
          <p className={passwordChecks.number(password) ? "ok" : "bad"}>
            • Number
          </p>
          <p className={passwordChecks.special(password) ? "ok" : "bad"}>
            • Special
          </p>
        </div>
      )}

      {/* CONFIRM PASSWORD */}
      {mode === "Sign Up" && (
        <div className="relative">
          <input
            type={showPass2 ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="dark-input pr-11"
            required
          />
          <span onClick={() => setShowPass2(!showPass2)} className="eye-icon">
            {showPass2 ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      )}

      {/* TERMS & CONDITIONS */}
      {mode === "Sign Up" && (
        <div className="flex items-start gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 cursor-pointer"
          />

          <p className="leading-5">
            I agree to the{" "}
            <span
              onClick={() => navigate("/terms-conditions")}
              className="text-white underline cursor-pointer hover:text-blue-300"
            >
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span
              onClick={() => navigate("/privacy-policy")}
              className="text-white underline cursor-pointer hover:text-blue-300"
            >
              Privacy Policy
            </span>
          </p>
        </div>
      )}

      {/* SUBMIT */}
      <button
        disabled={loading}
        className={`primary-btn ${loading && "opacity-60 cursor-not-allowed"}`}
      >
        {loading ? "Processing..." : mode === "Login" ? "Sign In" : "Register"}
      </button>

      {/* TOGGLE */}
      <p
        className="text-center text-8px text-gray-200 cursor-pointer hover:text-blue-400 transition"
        onClick={() => {
          setMode(mode === "Login" ? "Sign Up" : "Login");
          setAgreeTerms(false);
        }}
      >
        {mode === "Login"
          ? "Don’t have an account? Register"
          : "Already have an account? Login"}
      </p>

      {/* STYLES */}
      <style>{`
      .dark-input {
        width: 100%;
        padding: 12px 14px;
        border-radius: 10px;
        background: rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.12);
        color: white;
        outline: none;
        transition: all 0.2s ease;
      }

      .dark-input:focus {
        border-color: white;
        background: rgba(0,0,0,0.8);
      }

      .primary-btn {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        background: white;
        color: black;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .primary-btn:hover {
        background: #e5e5e5;
        transform: translateY(-1px);
      }

      .verify-btn {
        padding: 12px 16px;
        border-radius: 10px;
        background: #16a34a;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }

      .verify-btn:hover {
        background: #15803d;
      }

      .eye-icon {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #ccc;
      }

      .ok { color: #22c55e; }
      .bad { color: #ef4444; }
    `}</style>
    </form>
  );
};

export default Login;
