import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const OTP_LENGTH = 6;

const Firebase = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [step, setStep] = useState("phone"); // phone | otp
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
  if (!/^[6-9]\d{9}$/.test(phone)) {
    toast.error("Enter valid 10-digit mobile number");
    return;
  }

  try {
    setLoading(true);

    // 🔥 Clear old verifier if exists
    if (window.recaptchaFCaptchaVerifier) {
      window.RCaptchaVerifier.clear();
    }

    // ✅ CORRECT v9 constructor order
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
      }
    );

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      `+91${phone}`,
      window.recaptchaVerifier
    );

    window.confirmationResult = confirmationResult;
    setStep("otp");
    toast.success("OTP sent successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to send OTP");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await window.confirmationResult.confirm(code);

      toast.success(
        `Firebase verified ✅\nUID: ${res.user.uid}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP INPUT ---------------- */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  return (
    <section className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-center text-white">
          Firebase Phone Auth Test
        </h2>

        {/* STEP 1: PHONE */}
        {step === "phone" && (
          <>
            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter mobile number"
              className="w-full mt-6 bg-black border border-white/20 px-4 py-3 rounded-xl text-white"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-blue-500 text-black font-semibold hover:bg-blue-400"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <>
            <p className="text-sm text-gray-400 text-center mt-4">
              OTP sent to +91 {phone}
            </p>

            <div className="flex justify-center gap-2 mt-6">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={v}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-10 h-12 text-center text-xl bg-black border border-white/20 rounded-lg text-white"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </section>
  );
};

export default Firebase;
