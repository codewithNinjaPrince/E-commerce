import { useState, useEffect, useRef } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaHeadset,
} from "react-icons/fa";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Support = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);


  // CHAT SYSTEM STATES
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");

  const token = localStorage.getItem("merchantToken");
  const chatEndRef = useRef(null);

  /* -------------------------------------------------------
      AUTO SCROLL DOWN
  ------------------------------------------------------- */
  const scrollDown = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* -------------------------------------------------------
      FETCH CHAT MESSAGES
  ------------------------------------------------------- */
  const loadMessages = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/chat/merchant/messages`, {
        headers: { token },
      });

      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.log("Chat load error:", err);
    }
  };

  // Auto refresh chat every 3 sec
  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => loadMessages(), 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollDown();
  }, [messages]);

  /* -------------------------------------------------------
      SEND MESSAGE
  ------------------------------------------------------- */
  const sendMessage = async () => {
    if (!inputMsg.trim()) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/chat/merchant/send`,
        { message: inputMsg },
        { headers: { token } }
      );

      if (res.data.success) {
        setInputMsg("");
        loadMessages();
      }
    } catch (err) {
      toast.error("Message sending failed");
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h1
          className="text-3xl sm:text-4xl font-extrabold 
          bg-gradient-to-r from-white via-gray-300 to-gray-500 
          bg-clip-text text-transparent flex items-center gap-3 mb-10"
        >
          <FaHeadset className="text-blue-500" /> Support Center
        </h1>

        {/* ===================== FAQ SECTION ===================== */}
        <section className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>

          <ul className="space-y-6">
            {/* PRODUCT FAQ */}
            <li>
              <p className="font-semibold text-lg">How do I add products?</p>
              <p className="text-gray-400 text-sm mt-1">
                Go to Products → Add Product and fill in all required fields.
              </p>
            </li>

            <li>
              <p className="font-semibold text-lg">How to update my product?</p>
              <p className="text-gray-400 text-sm mt-1">
                Go to Products → Edit Product and make necessary edits.
              </p>
            </li>

            {/* ACCOUNT FAQ */}
            <li>
              <p className="font-semibold text-lg">
                How to update store details?
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Go to Profile → Edit.
              </p>
            </li>

            {/* ORDERS FAQ */}
            <li>
              <p className="font-semibold text-lg">How do I check orders?</p>
              <p className="text-gray-400 text-sm mt-1">
                Go to Orders tab on the sidebar.
              </p>
            </li>

            <li>
              <p className="font-semibold text-lg">How can I check earnings?</p>
              <p className="text-gray-400 text-sm mt-1">
                Dashboard → Revenue & Earnings cards.
              </p>
            </li>

            {/* PAYOUT FAQ */}
            <li>
              <p className="font-semibold text-lg">
                When do I receive payments?
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Payments are processed every Monday to your bank account.
              </p>
            </li>

            {/* POLICY FAQ */}
            <li>
              <p className="font-semibold text-lg">
                What is your refund policy?
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Refund only applies when there is a product or shipping-related
                issue.
              </p>
            </li>
          </ul>
        </section>
        
        {/* ===================== LIVE CHAT SECTION ===================== */}
<section className="relative border border-white/10 rounded-xl shadow-xl bg-[#0b0b0b]">

  {/* FULLSCREEN BUTTON (NORMAL MODE) */}
  {!fullscreen && (
    <button
      onClick={() => setFullscreen(true)}
      className="absolute top-3 left-3 z-50 
                 bg-red-600 text-white text-xl font-bold 
                 px-3 py-1 rounded-lg hover:bg-red-700 transition shadow-lg"
      style={{ fontFamily: "monospace" }}
    >
      [ ]
    </button>
  )}

  {/* FULLSCREEN WRAPPER */}
  <div
    className={`transition-all duration-300 ${
      fullscreen
        ? "fixed inset-0 z-[9999] bg-[#0b0b0b] rounded-none flex flex-col"
        : "h-[380px] sm:h-[480px] relative flex flex-col"
    }`}
  >
    {/* FULLSCREEN HEADER */}
    {fullscreen && (
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black">
        
        {/* EXIT FULLSCREEN BUTTON (LEFT SIDE) */}
        <button
          onClick={() => setFullscreen(false)}
          className="text-white bg-red-600 px-4 py-2 rounded-lg 
                     hover:bg-red-700 transition text-sm cursor-pointer"
        >
          ← Back
        </button>

        <h3 className="text-lg font-semibold opacity-80">Support Chat</h3>

        {/* Dummy placeholder for alignment */}
        <div className="w-[70px]"></div>
      </div>
    )}

    {/* CHAT AREA */}
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex my-2 ${
            m.sender === "merchant" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[75%] px-3 py-2 text-sm leading-relaxed rounded-2xl shadow-md ${
              m.sender === "merchant"
                ? "bg-[#dcf8c6] text-black rounded-br-none"
                : "bg-[#1f1f1f] text-white rounded-bl-none"
            }`}
          >
            {m.message}
          </div>
        </div>
      ))}
      <div ref={chatEndRef}></div>
    </div>

    {/* INPUT BAR */}
    <div className="flex gap-3 p-3 border-t border-white/10 bg-black">
      <input
        value={inputMsg}
        onChange={(e) => setInputMsg(e.target.value)}
        className="flex-1 bg-[#1c1c1c] text-sm border border-white/20 px-4 py-3 
                   rounded-full focus:border-blue-400 outline-none"
        placeholder="Type a message…"
      />

      <button
        onClick={sendMessage}
        className="px-5 py-2 bg-green-500 text-black font-semibold 
                   rounded-full hover:bg-green-600 transition"
      >
        Send
      </button>
    </div>
  </div>
</section>


        {/* ===================== CONTACT INFO (BOTTOM) ===================== */}
        <section className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold">Contact Information</h2>

          <div className="space-y-4">
            {/* PHONE */}
            <a
              href="tel:+918736852549"
              className="flex items-center gap-4 hover:text-blue-300 hover:scale-105 transition cursor-pointer"
            >
              <FaPhone className="text-blue-400 text-xl" />
              <p className="text-lg">+91 87368 52549</p>
            </a>

            {/* EMAIL */}
            <a
              href="mailto:brawvly@gmail.com"
              className="flex items-center gap-4 hover:text-green-300 hover:scale-105 transition cursor-pointer"
            >
              <FaEnvelope className="text-green-400 text-xl" />
              <p className="text-lg">brawvly@gmail.com</p>
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/brawvly/"
              target="_blank"
              className="flex items-center gap-4 hover:text-pink-300 hover:scale-105 transition cursor-pointer"
            >
              <FaInstagram className="text-pink-400 text-xl" />
              <p className="text-lg">@brawvly</p>
            </a>

            {/* FACEBOOK */}
            <a
              href="https://www.facebook.com/profile.php?id=61583969765648"
              target="_blank"
              className="flex items-center gap-4 hover:text-blue-400 hover:scale-105 transition cursor-pointer"
            >
              <FaFacebook className="text-blue-500 text-xl" />
              <p className="text-lg">Facebook Page</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
