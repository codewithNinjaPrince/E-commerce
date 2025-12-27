import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLayoutEffect } from "react";

/* ---------------- HELPERS ---------------- */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ---------------- COMPONENT ---------------- */
const ForgotPassword = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const { backendUrl, navigate } = useContext(ShopContext);

  const [step, setStep] = useState(1); // 1=email | 2=otp | 3=password
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const passwordChecks = {
    length: (p) => p.length >= 8,
    upper: (p) => /[A-Z]/.test(p),
    lower: (p) => /[a-z]/.test(p),
    number: (p) => /[0-9]/.test(p),
    special: (p) => /[^A-Za-z0-9]/.test(p),
  };

  const getPasswordScore = (p) =>
    Object.values(passwordChecks).filter((fn) => fn(p)).length;

  const passwordScore = getPasswordScore(password);

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
  if (!isValidEmail(email)) {
    toast.error("Enter a valid email address");
    return;
  }

  if (cooldown > 0) return;

  try {
    setOtpLoading(true);
    await axios.post(`${backendUrl}/api/user/forgot-password/send-otp`, {
      email,
    });

    toast.success("OTP sent to your email 📩");
    setStep(2);
    setCooldown(60);
  } catch (err) {
    const res = err?.response;

    if (res?.status === 404 && res?.data?.code === "EMAIL_NOT_FOUND") {
      toast.error("Email not registered");
      toast.info("Please create an account to continue");

      setTimeout(() => {
        navigate("/login"); // register is inside login UI
      }, 1200);

      return;
    }

    if (res?.status === 429) {
      toast.warning("Please wait before requesting another OTP");
      return;
    }

    toast.error(res?.data?.message || "Unable to send OTP");
  } finally {
    setOtpLoading(false);
  }
};

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/user/forgot-password/verify-otp`, {
        email,
        otp,
      });

      toast.success("OTP verified ✅");
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const resetPassword = async () => {
    if (passwordScore < 5) {
      toast.error(
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/user/forgot-password/reset`, {
        email,
        password,
      });

      toast.success("Password updated successfully 🔐");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- COOLDOWN TIMER ---------------- */
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ---------------- UI ---------------- */
  return (
    <div
      className="w-[92%] sm:max-w-[420px] mx-auto mt-20
                 bg-white/5 backdrop-blur-xl
                 border border-white/10 rounded-2xl
                 p-6 sm:p-8 shadow-2xl text-white"
    >
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center tracking-wide">
        Forgot Password
      </h2>

      <p className="text-center text-gray-400 text-sm mt-1 mb-6">
        Securely reset your account password
      </p>

      {/* STEP 1 – EMAIL */}
      {step === 1 && (
        <>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="dark-input"
          />

          <button
            type="button"
            onClick={sendOtp}
            disabled={otpLoading || cooldown > 0}
            className={`primary-btn flex items-center justify-center gap-2 mt-4
              ${
                (otpLoading || cooldown > 0) && "opacity-60 cursor-not-allowed"
              }`}
          >
            {otpLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              "Send OTP"
            )}
          </button>
        </>
      )}

      {/* STEP 2 – OTP */}
      {step === 2 && (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="dark-input"
          />

          {/* RESEND OTP */}
          <button
            type="button"
            onClick={sendOtp}
            disabled={otpLoading || cooldown > 0}
            className={`primary-btn mt-3 flex items-center justify-center gap-2
        ${(otpLoading || cooldown > 0) && "opacity-60 cursor-not-allowed"}`}
          >
            {otpLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              "Resend OTP"
            )}
          </button>

          {/* VERIFY */}
          <button
            onClick={verifyOtp}
            disabled={loading}
            className={`primary-btn mt-3 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {/* STEP 3 – PASSWORD */}
      {step === 3 && (
        <>
          {/* PASSWORD INPUT */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="dark-input pr-11"
            />
            <span onClick={() => setShowPass(!showPass)} className="eye-icon">
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* PASSWORD RULES */}
          {password && (
            <div className="grid grid-cols-2 gap-x-4 text-xs mt-2">
              <p className={passwordChecks.length(password) ? "ok" : "bad"}>
                • 8+ characters
              </p>
              <p className={passwordChecks.upper(password) ? "ok" : "bad"}>
                • Uppercase letter
              </p>
              <p className={passwordChecks.lower(password) ? "ok" : "bad"}>
                • Lowercase letter
              </p>
              <p className={passwordChecks.number(password) ? "ok" : "bad"}>
                • Number
              </p>
              <p className={passwordChecks.special(password) ? "ok" : "bad"}>
                • Special character
              </p>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="dark-input mt-3"
          />

          {/* SUBMIT */}
          <button
            onClick={resetPassword}
            disabled={loading}
            className={`primary-btn mt-4 ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </>
      )}

      {/* LINKS */}
      <div className="mt-6 text-center space-y-2">
        <p
          onClick={() => navigate("/login")}
          className="text-sm text-gray-300 cursor-pointer hover:text-white transition"
        >
          Back to Login
        </p>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-gray-400 cursor-pointer hover:text-white transition"
        >
          Don’t have an account? Register
        </p>
      </div>

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

        .eye-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #ccc;
        }

        .ok {
  color: #22c55e;
}

.bad {
  color: #ef4444;
}

      `}</style>
    </div>
  );
};

export default ForgotPassword;
