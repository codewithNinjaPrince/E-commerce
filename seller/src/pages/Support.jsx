// import { useState, useEffect, useRef } from "react";
// import {
//   FaPhone,
//   FaEnvelope,
//   FaInstagram,
//   FaFacebook,
//   FaHeadset,
// } from "react-icons/fa";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const Support = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [fullscreen, setFullscreen] = useState(false);

//   // CHAT SYSTEM STATES
//   const [messages, setMessages] = useState([]);
//   const [inputMsg, setInputMsg] = useState("");

//   const token = localStorage.getItem("merchantToken");
//   const chatEndRef = useRef(null);

//   /* -------------------------------------------------------
//       AUTO SCROLL DOWN
//   ------------------------------------------------------- */
//   const scrollDown = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   /* -------------------------------------------------------
//       FETCH CHAT MESSAGES
//   ------------------------------------------------------- */
//   const loadMessages = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/chat/merchant/messages`, {
//         headers: { token },
//       });

//       if (res.data.success) {
//         setMessages(res.data.messages);
//       }
//     } catch (err) {
//       console.log("Chat load error:", err);
//     }
//   };

//   // Auto refresh chat every 3 sec
//   useEffect(() => {
//     loadMessages();
//     const interval = setInterval(() => loadMessages(), 3000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     scrollDown();
//   }, [messages]);

//   /* -------------------------------------------------------
//       SEND MESSAGE
//   ------------------------------------------------------- */
//   const sendMessage = async () => {
//     if (!inputMsg.trim()) return;

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/chat/merchant/send`,
//         { message: inputMsg },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setInputMsg("");
//         loadMessages();
//       }
//     } catch (err) {
//       toast.error("Message sending failed");
//     }
//   };

//   return (
//     <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 text-white">
//       <div className="max-w-4xl mx-auto">
//         {/* TITLE */}
//         <h1
//           className="text-3xl sm:text-4xl font-extrabold
//           bg-gradient-to-r from-white via-gray-300 to-gray-500
//           bg-clip-text text-transparent flex items-center gap-3 mb-10"
//         >
//           <FaHeadset className="text-blue-500" /> Support Center
//         </h1>

//         {/* ===================== FAQ SECTION ===================== */}
//         <section className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg mb-10">
//           <h2 className="text-xl font-semibold mb-4">
//             Frequently Asked Questions
//           </h2>

//           <ul className="space-y-6">
//             {/* PRODUCT FAQ */}
//             <li>
//               <p className="font-semibold text-lg">How do I add products?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Go to Products → Add Product and fill in all required fields.
//               </p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">How to update my product?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Go to Products → Edit Product and make necessary edits.
//               </p>
//             </li>

//             {/* ACCOUNT FAQ */}
//             <li>
//               <p className="font-semibold text-lg">
//                 How to update store details?
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Go to Profile → Edit.
//               </p>
//             </li>

//             {/* ORDERS FAQ */}
//             <li>
//               <p className="font-semibold text-lg">How do I check orders?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Go to Orders tab on the sidebar.
//               </p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">How can I check earnings?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Dashboard → Revenue & Earnings cards.
//               </p>
//             </li>

//             {/* PAYOUT FAQ */}
//             <li>
//               <p className="font-semibold text-lg">
//                 When do I receive payments?
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Payments are processed every Monday to your bank account.
//               </p>
//             </li>

//             {/* POLICY FAQ */}
//             <li>
//               <p className="font-semibold text-lg">
//                 What is your refund policy?
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Refund only applies when there is a product or shipping-related
//                 issue.
//               </p>
//             </li>
//           </ul>
//         </section>

//         {/* ===================== LIVE CHAT SECTION ===================== */}
// <section className="relative border border-white/10 rounded-xl shadow-xl bg-[#0b0b0b]">

//   {/* FULLSCREEN BUTTON (NORMAL MODE) */}
//   {!fullscreen && (
//     <button
//       onClick={() => setFullscreen(true)}
//       className="absolute top-3 left-3 z-50
//                  bg-red-600 text-white text-xl font-bold
//                  px-3 py-1 rounded-lg hover:bg-red-700 transition shadow-lg"
//       style={{ fontFamily: "monospace" }}
//     >
//       [ ]
//     </button>
//   )}

//   {/* FULLSCREEN WRAPPER */}
//   <div
//     className={`transition-all duration-300 ${
//       fullscreen
//         ? "fixed inset-0 z-[9999] bg-[#0b0b0b] rounded-none flex flex-col"
//         : "h-[380px] sm:h-[480px] relative flex flex-col"
//     }`}
//   >
//     {/* FULLSCREEN HEADER */}
//     {fullscreen && (
//       <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black">

//         {/* EXIT FULLSCREEN BUTTON (LEFT SIDE) */}
//         <button
//           onClick={() => setFullscreen(false)}
//           className="text-white bg-red-600 px-4 py-2 rounded-lg
//                      hover:bg-red-700 transition text-sm cursor-pointer"
//         >
//           ← Back
//         </button>

//         <h3 className="text-lg font-semibold opacity-80">Support Chat</h3>

//         {/* Dummy placeholder for alignment */}
//         <div className="w-[70px]"></div>
//       </div>
//     )}

//     {/* CHAT AREA */}
//     <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//       {messages.map((m, i) => (
//         <div
//           key={i}
//           className={`flex my-2 ${
//             m.sender === "merchant" ? "justify-end" : "justify-start"
//           }`}
//         >
//           <div
//             className={`max-w-[75%] px-3 py-2 text-sm leading-relaxed rounded-2xl shadow-md ${
//               m.sender === "merchant"
//                 ? "bg-[#dcf8c6] text-black rounded-br-none"
//                 : "bg-[#1f1f1f] text-white rounded-bl-none"
//             }`}
//           >
//             {m.message}
//           </div>
//         </div>
//       ))}
//       <div ref={chatEndRef}></div>
//     </div>

//     {/* INPUT BAR */}
//     <div className="flex gap-3 p-3 border-t border-white/10 bg-black">
//       <input
//         value={inputMsg}
//         onChange={(e) => setInputMsg(e.target.value)}
//         className="flex-1 bg-[#1c1c1c] text-sm border border-white/20 px-4 py-3
//                    rounded-full focus:border-blue-400 outline-none"
//         placeholder="Type a message…"
//       />

//       <button
//         onClick={sendMessage}
//         className="px-5 py-2 bg-green-500 text-black font-semibold
//                    rounded-full hover:bg-green-600 transition"
//       >
//         Send
//       </button>
//     </div>
//   </div>
// </section>

//         {/* ===================== CONTACT INFO (BOTTOM) ===================== */}
//         <section className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg space-y-6">
//           <h2 className="text-xl font-semibold">Contact Information</h2>

//           <div className="space-y-4">
//             {/* PHONE */}
//             <a
//               href="tel:+918736852549"
//               className="flex items-center gap-4 hover:text-blue-300 hover:scale-105 transition cursor-pointer"
//             >
//               <FaPhone className="text-blue-400 text-xl" />
//               <p className="text-lg">+91 87368 52549</p>
//             </a>

//             {/* EMAIL */}
//             <a
//               href="mailto:brawvly@gmail.com"
//               className="flex items-center gap-4 hover:text-green-300 hover:scale-105 transition cursor-pointer"
//             >
//               <FaEnvelope className="text-green-400 text-xl" />
//               <p className="text-lg">brawvly@gmail.com</p>
//             </a>

//             {/* INSTAGRAM */}
//             <a
//               href="https://www.instagram.com/brawvly/"
//               target="_blank"
//               className="flex items-center gap-4 hover:text-pink-300 hover:scale-105 transition cursor-pointer"
//             >
//               <FaInstagram className="text-pink-400 text-xl" />
//               <p className="text-lg">@brawvly</p>
//             </a>

//             {/* FACEBOOK */}
//             <a
//               href="https://www.facebook.com/profile.php?id=61583969765648"
//               target="_blank"
//               className="flex items-center gap-4 hover:text-blue-400 hover:scale-105 transition cursor-pointer"
//             >
//               <FaFacebook className="text-blue-500 text-xl" />
//               <p className="text-lg">Facebook Page</p>
//             </a>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Support;

// import { useState, useEffect, useRef } from "react";
// import {
//   FaPhone,
//   FaEnvelope,
//   FaInstagram,
//   FaFacebook,
//   FaHeadset,
// } from "react-icons/fa";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const Support = () => {
//   const [fullscreen, setFullscreen] = useState(false);

//   // CHAT STATE
//   const [messages, setMessages] = useState([]);
//   const [inputMsg, setInputMsg] = useState("");

//   const token = localStorage.getItem("merchantToken");
//   const chatEndRef = useRef(null);

//   // SCROLL TO BOTTOM
//   const scrollDown = (smooth = true) => {
//     chatEndRef.current?.scrollIntoView({
//       behavior: smooth ? "smooth" : "auto",
//     });
//   };

//   // LOAD MESSAGES
//   const loadMessages = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/chat/merchant/messages`, {
//         headers: { token },
//       });

//       if (res.data.success) {
//         setMessages(res.data.messages);
//       }
//     } catch (err) {
//       console.log("Chat load error:", err);
//     }
//   };

//   useEffect(() => {
//     loadMessages();
//     const interval = setInterval(() => loadMessages(), 3000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     scrollDown(false);
//   }, [messages]);

//   // SEND MESSAGE — WITH INSTANT MESSAGE UPDATE
//   const sendMessage = async () => {
//     if (!inputMsg.trim()) return;

//     const tempMessage = {
//       message: inputMsg,
//       sender: "merchant",
//       createdAt: new Date(),
//       temp: true, // flag temporary message
//     };

//     // SHOW MESSAGE INSTANTLY
//     setMessages((prev) => [...prev, tempMessage]);
//     setInputMsg(""); // reset instantly
//     scrollDown();

//     try {
//       await axios.post(
//         `${backendUrl}/api/chat/merchant/send`,
//         { message: tempMessage.message },
//         { headers: { token } }
//       );

//       loadMessages(); // refresh real messages
//     } catch (err) {
//       toast.error("Message sending failed");
//     }
//   };

//   return (
//     <div
//       className="
//         w-full max-w-[1600px] mx-auto
//         px-4 sm:px-6 py-6
//         pt-[75px] lg:pt-10
//         text-white
//       "
//     >
//       <div className="max-w-4xl mx-auto">

//         {/* TITLE */}
//         <h1
//           className="text-3xl sm:text-4xl font-extrabold
//           bg-gradient-to-r from-white via-gray-300 to-gray-500
//           bg-clip-text text-transparent flex items-center gap-3 mb-10"
//         >
//           <FaHeadset className="text-blue-500" /> Support Center
//         </h1>

//         {/* FAQ SECTION */}
//         <section className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg mb-10">
//           <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>

//           <ul className="space-y-6">
//             <li>
//               <p className="font-semibold text-lg">How do I add products?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Go to Products → Add Product and fill in all required fields.
//               </p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">How to update my product?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Go to Products → Edit Product.
//               </p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">How to update store details?</p>
//               <p className="text-gray-400 text-sm mt-1">Go to Profile → Edit.</p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">How do I check orders?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Go to Orders tab on the sidebar.
//               </p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">How can I check earnings?</p>
//               <p className="text-gray-400 text-sm mt-1">Dashboard → Earnings cards.</p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">When do I receive payments?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Payments are processed every Monday.
//               </p>
//             </li>

//             <li>
//               <p className="font-semibold text-lg">Refund policy?</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Refund applies only for product or shipping issues.
//               </p>
//             </li>
//           </ul>
//         </section>

//         {/* CHAT SECTION */}
//         <section className="relative border border-white/10 rounded-xl shadow-xl bg-[#0b0b0b]">

//           {/* FULLSCREEN BUTTON */}
//           {!fullscreen && (
//             <button
//               onClick={() => setFullscreen(true)}
//               className="absolute top-3 left-3 z-50 bg-red-600 text-white
//                          text-xl font-bold px-3 py-1 rounded-lg hover:bg-red-700
//                          transition shadow-lg"
//               style={{ fontFamily: "monospace" }}
//             >
//               [ ]
//             </button>
//           )}

//           {/* FULLSCREEN WRAPPER */}
//           <div
//             className={`transition-all duration-300 ${
//               fullscreen
//                 ? "fixed inset-0 z-[9999] bg-[#0b0b0b] rounded-none flex flex-col"
//                 : "h-[380px] sm:h-[480px] flex flex-col"
//             }`}
//           >
//             {/* HEADER IN FULLSCREEN */}
//             {fullscreen && (
//               <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black">
//                 <button
//                   onClick={() => setFullscreen(false)}
//                   className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm cursor-pointer"
//                 >
//                   ← Back
//                 </button>
//                 <h3 className="text-lg font-semibold opacity-80">Support Chat</h3>
//                 <div className="w-[70px]"></div>
//               </div>
//             )}

//             {/* CHAT AREA */}
//             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//               {messages.map((m, i) => (
//                 <div
//                   key={i}
//                   className={`flex my-2 ${
//                     m.sender === "merchant" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[75%] px-3 py-2 text-sm leading-relaxed rounded-2xl shadow-md ${
//                       m.sender === "merchant"
//                         ? "bg-[#dcf8c6] text-black rounded-br-none"
//                         : "bg-[#1f1f1f] text-white rounded-bl-none"
//                     }`}
//                   >
//                     {m.message}
//                   </div>
//                 </div>
//               ))}
//               <div ref={chatEndRef}></div>
//             </div>

//             {/* INPUT BAR */}
//             <div className="flex gap-3 p-3 border-t border-white/10 bg-black">
//               <input
//                 value={inputMsg}
//                 onChange={(e) => setInputMsg(e.target.value)}
//                 className="flex-1 bg-[#1c1c1c] text-sm border border-white/20
//                            px-4 py-3 rounded-full focus:border-blue-400
//                            outline-none"
//                 placeholder="Type a message…"
//               />

//               <button
//                 onClick={sendMessage}
//                 className="px-5 py-2 bg-green-500 text-black font-semibold
//                            rounded-full hover:bg-green-600 transition"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* CONTACT INFO */}
//         <section className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg space-y-6 mt-10">
//           <h2 className="text-xl font-semibold">Contact Information</h2>

//           <div className="space-y-4">
//             <a href="tel:+918736852549" className="flex items-center gap-4 hover:text-blue-300 transition cursor-pointer">
//               <FaPhone className="text-blue-400 text-xl" />
//               <p className="text-lg">+91 87368 52549</p>
//             </a>

//             <a href="mailto:brawvly@gmail.com" className="flex items-center gap-4 hover:text-green-300 transition cursor-pointer">
//               <FaEnvelope className="text-green-400 text-xl" />
//               <p className="text-lg">brawvly@gmail.com</p>
//             </a>

//             <a href="https://www.instagram.com/brawvly/" target="_blank" className="flex items-center gap-4 hover:text-pink-300 transition cursor-pointer">
//               <FaInstagram className="text-pink-400 text-xl" />
//               <p className="text-lg">@brawvly</p>
//             </a>

//             <a href="https://www.facebook.com" target="_blank" className="flex items-center gap-4 hover:text-blue-400 transition cursor-pointer">
//               <FaFacebook className="text-blue-500 text-xl" />
//               <p className="text-lg">Facebook Page</p>
//             </a>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Support;

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
  const [fullscreen, setFullscreen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const chatEndRef = useRef(null);

  const token = localStorage.getItem("merchantToken");

  /* -------------------------------------------------------
      AUTO SCROLL
  ------------------------------------------------------- */
  const scrollDown = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* -------------------------------------------------------
      LOAD CHAT
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
      console.log(err);
    }
  };

  // Auto-refresh messages
  useEffect(() => {
    loadMessages();
    const i = setInterval(loadMessages, 3000);
    return () => clearInterval(i);
  }, []);

  useEffect(scrollDown, [messages]);

  /* -------------------------------------------------------
      SEND MESSAGE (optimistic update)
  ------------------------------------------------------- */
  const sendMessage = async () => {
    const msg = inputMsg.trim();
    if (!msg) return;

    const tempMsg = {
      _id: "temp-" + Date.now(),
      sender: "merchant",
      message: msg,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputMsg("");
    scrollDown();

    try {
      const res = await axios.post(
        `${backendUrl}/api/chat/merchant/send`,
        { message: msg },
        { headers: { token } }
      );

      if (!res.data.success) loadMessages();
    } catch {
      toast.error("Message sending failed");
      loadMessages();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
      <div
        className="
    max-w-[1600px] mx-auto 
    px-4 sm:px-6 pb-10
    pt-[30px] sm:pt-[60px] lg:pt-[50px]
  "
      >
        <div className="max-w-4xl mx-auto">
          {/* TITLE */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-10
            bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent
            flex items-center gap-3"
          >
            <FaHeadset className="text-blue-500" /> Support Center
          </h1>

          {/* ================= FAQ ================= */}
          <section className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>

            <ul className="space-y-6">
              <li>
                <p className="font-semibold text-lg">How do I add products?</p>
                <p className="text-gray-400 text-sm mt-1">
                  Products → Add Product.
                </p>
              </li>

              <li>
                <p className="font-semibold text-lg">
                  How do I update a product?
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Products → Edit Product.
                </p>
              </li>

              <li>
                <p className="font-semibold text-lg">
                  How do I update store details?
                </p>
                <p className="text-gray-400 text-sm mt-1">Profile → Edit.</p>
              </li>

              <li>
                <p className="font-semibold text-lg">
                  Where can I check orders?
                </p>
                <p className="text-gray-400 text-sm mt-1">Orders tab.</p>
              </li>

              <li>
                <p className="font-semibold text-lg">
                  When do I receive payments?
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Every Monday to your linked bank account.
                </p>
              </li>
            </ul>
          </section>

          {/* ================= CHAT BOX ================= */}
          <section className="relative border border-white/10 rounded-xl shadow-xl bg-[#0b0b0b] overflow-hidden">
            {/* FULLSCREEN BTN */}
            {!fullscreen && (
              <button
                onClick={() => setFullscreen(true)}
                className="absolute top-3 left-3 z-50 bg-red-600 px-3 py-1 rounded-lg text-xl font-bold hover:bg-red-700"
                style={{ fontFamily: "monospace" }}
              >
                [ ]
              </button>
            )}

            <div
              className={`transition-all duration-300 ${
                fullscreen
                  ? "fixed inset-0 z-[9998] bg-[#0b0b0b] flex flex-col"
                  : "h-[380px] sm:h-[480px] flex flex-col"
              }`}
            >
              {/* FULLSCREEN HEADER */}
              {fullscreen && (
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black">
                  <button
                    onClick={() => setFullscreen(false)}
                    className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    ← Back
                  </button>
                  <h3 className="text-lg font-semibold opacity-80">
                    Support Chat
                  </h3>
                  <div className="w-[60px]"></div>
                </div>
              )}

              {/* CHAT MESSAGES */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className={`flex my-2 ${
                      m.sender === "merchant" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 text-sm rounded-2xl shadow-md leading-relaxed ${
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

              {/* INPUT BAR — (FULLY RESPONSIVE) */}
              <div className="flex items-center gap-2 p-2 sm:p-3 border-t border-white/10 bg-black">
                <input
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 bg-[#1c1c1c] text-sm border border-white/20 px-3 py-2 rounded-full
                             focus:border-blue-400 outline-none min-w-0"
                />

                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-green-500 text-black font-semibold rounded-full hover:bg-green-600
                             text-sm sm:text-base whitespace-nowrap"
                >
                  Send
                </button>
              </div>
            </div>
          </section>

          {/* ================= CONTACT INFO ================= */}
          <section className="mt-10 bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg space-y-6">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <div className="space-y-4">
              <a className="flex items-center gap-4 hover:text-blue-300">
                <FaPhone className="text-blue-400 text-xl" />
                +91 87368 52549
              </a>

              <a className="flex items-center gap-4 hover:text-green-300">
                <FaEnvelope className="text-green-400 text-xl" />
                brawvly@gmail.com
              </a>

              <a className="flex items-center gap-4 hover:text-pink-300">
                <FaInstagram className="text-pink-400 text-xl" />
                @brawvly
              </a>

              <a className="flex items-center gap-4 hover:text-blue-400">
                <FaFacebook className="text-blue-500 text-xl" />
                Facebook Page
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;
