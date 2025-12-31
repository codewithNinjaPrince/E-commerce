import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

const OTP_LENGTH = 6;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CodVerify = () => {
  const navigate = useNavigate();
  const data = JSON.parse(sessionStorage.getItem("pendingCodOrder"));

  const [phone, setPhone] = useState(data?.address?.phone || "");
  const [editing, setEditing] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [confirm, setConfirm] = useState(false);
  const [timer, setTimer] = useState(
    Number(sessionStorage.getItem("otpTimer")) || 60
  );
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);

  /* ---------- SAFETY ---------- */
  useEffect(() => {
    if (!data || !data.address) {
      navigate("/", { replace: true });
    }
  }, []);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (timer <= 0) return;

    sessionStorage.setItem("otpTimer", timer);
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  /* ---------- SEND OTP ---------- */
  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }

    try {
      setResending(true);

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;
      sessionStorage.setItem("otpSent", "1");
      sessionStorage.setItem("otpTimer", "60");
      setTimer(60);
      setOtp(Array(OTP_LENGTH).fill(""));
      toast.success("OTP sent");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setResending(false);
    }
  };

  /* ---------- AUTO SEND ON LOAD ---------- */
  useEffect(() => {
    if (!sessionStorage.getItem("otpSent")) {
      sendOtp();
    }
  }, []);

  /* ---------- OTP INPUT ---------- */
  const handleOtp = (val, i) => {
    if (!/^\d?$/.test(val)) return;

    const n = [...otp];
    n[i] = val;
    setOtp(n);

    if (val && i < OTP_LENGTH - 1) {
      inputsRef.current[i + 1].focus();
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const verifyOtp = async () => {
    if (!confirm) return toast.info("Please confirm phone number");
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      return toast.error("Enter complete OTP");
    }

    try {
      setVerifying(true);
      await window.confirmationResult.confirm(code);

      // update phone in address
      data.address.phone = phone;

      const res = await axios.post(
        `${BACKEND_URL}/api/order/place`,
        {
          ...data,
          paymentMethod: "cod",
        },
        { headers: { token: localStorage.getItem("token") } }
      );

      if (!res.data.success) throw new Error();

      sessionStorage.removeItem("pendingCodOrder");
      sessionStorage.removeItem("otpSent");
      sessionStorage.removeItem("otpTimer");

      toast.success("Order placed 🎉");
      navigate("/orders", { replace: true });
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <section className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-[90%] max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          <FaArrowLeft />
        </button>

        <h2 className="text-xl font-semibold text-center text-white mt-3">
          Verify Phone for COD
        </h2>

        {/* PHONE */}
        <div className="mt-4 flex items-center gap-2">
          {editing ? (
            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="flex-1 bg-black border border-white/20 px-3 py-2 rounded-lg text-white"
            />
          ) : (
            <p className="flex-1 text-center text-white">+91 {phone}</p>
          )}

          <button
            onClick={() => {
              setEditing(!editing);
              sessionStorage.removeItem("otpSent");
            }}
            className="text-blue-400"
          >
            <FaEdit />
          </button>
        </div>

        {/* OTP */}
        <div className="flex justify-center gap-2 mt-6">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={v}
              onChange={(e) => handleOtp(e.target.value, i)}
              className="w-10 h-12 text-center text-xl bg-black border border-white/20 rounded-lg text-white"
            />
          ))}
        </div>

        {/* TIMER / RESEND */}
        <p className="text-xs text-gray-400 text-center mt-2">
          {timer > 0 ? (
            `Resend OTP in ${timer}s`
          ) : (
            <button
              onClick={sendOtp}
              disabled={resending}
              className="text-blue-400 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </p>

        {/* CONFIRM */}
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
          />
          <span className="text-sm text-gray-300">
            I confirm this number is correct
          </span>
        </label>

        {/* SUBMIT */}
        <button
          onClick={verifyOtp}
          disabled={verifying}
          className="w-full mt-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400"
        >
          {verifying ? "Verifying..." : "Verify & Place Order"}
        </button>

        <div id="recaptcha-container"></div>
      </div>
    </section>
  );
};

export default CodVerify;
