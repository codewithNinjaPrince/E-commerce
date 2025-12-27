import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import NewsLetter from "../components/NewsLetter";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { useLayoutEffect } from "react";

const Contact = () => {
  useLayoutEffect(() => {
    // 🔥 HARD FORCE SCROLL (browser memory ignore)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // CUSTOMER FORM STATES
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    files: [],
  });

  const [loading, setLoading] = useState(false);

  const funnyLines = [
    "Sending your message to the universe 🚀",
    "Talking to our support elves 🧝‍♂️",
    "Hold tight, magic in progress ✨",
    "Almost there... brewing some coffee ☕",
    "Our servers are listening carefully 👂",
  ];

  const compressFile = async (file) => {
    const MAX_NON_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

    // Non-image files
    if (!file.type.startsWith("image/")) {
      if (file.size > MAX_NON_IMAGE_SIZE) {
        throw new Error("Files larger than 3MB are not allowed");
      }
      return file; // valid non-image
    }

    // Image compression
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    // Safety check after compression
    if (compressedFile.size > MAX_NON_IMAGE_SIZE) {
      throw new Error("Image could not be compressed under 3MB");
    }

    return compressedFile;
  };

  // HANDLE CHANGE
  const handleCustomerChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
      try {
        const selectedFiles = Array.from(files);
        const processedFiles = [];

        for (const file of selectedFiles) {
          const processed = await compressFile(file);
          processedFiles.push(processed);
        }

        setCustomerData((prev) => ({
          ...prev,
          files: [...prev.files, ...processedFiles],
        }));

        toast.success("Files ready to upload 📦");
      } catch (err) {
        toast.error(err.message || "File processing failed");
        e.target.value = null; // reset file input
      }
    } else {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

  // SUBMIT CUSTOMER SUPPORT FORM
  const submitCustomer = async () => {
    try {
      if (!customerData.name || !customerData.email || !customerData.message) {
        return toast.error("Name, email and message are required");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", customerData.name);
      formData.append("email", customerData.email);
      formData.append("phone", customerData.phone);
      formData.append("message", customerData.message);

      customerData.files.forEach((file) => formData.append("files", file));

      const res = await fetch(`${backendUrl}/api/form/contact`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setLoading(false);
        return toast.error(data.message);
      }

      toast.success("Your message has been sent! 🎉");
      setCustomerData({
        name: "",
        email: "",
        phone: "",
        message: "",
        files: [],
      });
    } catch (err) {
      toast.error("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
  <section className="
  bg-black/90
  border border-white/10
  rounded-xl
  shadow-[0_0_40px_rgba(255,255,255,0.06)]
  mt-20 mb-4
  sm:mt-22 sm:mb-6
  lg:mt-26 lg:mb-8
  m-1 sm:m-2 lg:m-4
  p-1 sm:p-2 lg:p-4
">

     {/* SELLER QUICK NOTICE — STICKY */}
<div
  className="
    sticky
    top-[64px]        /* navbar height */
    bg-gradient-to-r from-[#111] via-[#151515] to-[#0d0d0d]
    border-b border-white/10
    backdrop-blur
  "
>
  <div className="max-w-7xl mx-auto px-2 py-5 rounded-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">

    {/* LEFT */}
    <span className="text-gray-300 flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      Are you a seller or business owner?
    </span>

    {/* CTA */}
    <button
      onClick={() => navigate("/sell-with-us")}
      className="group flex items-center gap-2 font-medium text-green-400 hover:text-green-300 transition cursor-pointer"
    >
      <span className="relative">
        Start selling on Brawvly
        <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-green-400 transition-all duration-300 group-hover:w-full"></span>
      </span>

      <span className="transform transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </button>

  </div>
</div>


      {/* PAGE HEADER */}
      <div className="text-center pt-6 text-2xl max-w-3xl mx-auto">
        <Title text1="Contact" text2="Us" />
        <p className="text-gray-400 mt-4 text-base">
          Need help, have feedback, or want to partner with Brawvly? You’re
          always welcome here 🤝
        </p>
      </div>

      {/* WHAT WE HELP WITH */}
      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6 text-center">
        {[
          {
            title: "Orders & Payments 💳",
            desc: "Issues related to orders, refunds, or payments.",
          },
          {
            title: "Account & Security 🔐",
            desc: "Login problems, account access, or data concerns.",
          },
          {
            title: "Feedback & Suggestions 💡",
            desc: "Ideas that help us improve Brawvly for everyone.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* BEFORE CONTACTING */}
      <div className="max-w-4xl mx-auto mt-24 bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl">
        <h3 className="text-2xl font-semibold text-white mb-4 text-center">
          Before You Contact Us ℹ️
        </h3>

        <ul className="text-gray-400 space-y-3 text-sm">
          <li>• Please provide accurate contact details so we can respond.</li>
          <li>• Attach screenshots or files for faster resolution.</li>
          <li>
            • Merchant-related queries are best handled via the merchant panel.
          </li>
          <li>• Duplicate or incomplete requests may take longer.</li>
        </ul>
      </div>

      {/* PRIVACY NOTE */}
      <div className="max-w-3xl mx-auto mt-16 text-center text-sm text-gray-500">
        <p>
          Your information is used only to resolve your request. We never sell
          or misuse your data. By submitting this form, you agree to our
          fair-use and privacy practices.
        </p>
      </div>

      {/* CUSTOMER SUPPORT FORM */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Customer Support 💬
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            We usually respond within <b>24 hours</b>. Attach screenshots if
            needed.
          </p>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={customerData.name}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={customerData.email}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={customerData.phone}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg"
            />

            <textarea
              name="message"
              rows={5}
              placeholder="Describe your issue or message in detail..."
              value={customerData.message}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg"
            />

            {/* OPTIONAL FILE UPLOAD */}
            {/* FILE UPLOAD */}
            <div className="border border-white/20 rounded-lg p-4 bg-black">
              <label className="text-sm text-gray-300 font-medium">
                Attach files (optional)
              </label>

              <p className="text-xs text-gray-500 mb-3">
                You can upload screenshots or documents (multiple files allowed)
              </p>

              {/* Hidden input */}
              <input
                type="file"
                name="files"
                id="fileUpload"
                multiple
                onChange={handleCustomerChange}
                className="hidden"
              />

              {/* Custom button */}
              <label
                htmlFor="fileUpload"
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/30 rounded-md cursor-pointer hover:bg-white hover:text-black transition text-sm"
              >
                📎 Choose Files
              </label>

              {/* FILE PREVIEW */}
              {customerData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {customerData.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#1a1a1a] px-3 py-2 rounded-md border border-white/10"
                    >
                      <span className="text-sm text-gray-300 truncate">
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setCustomerData((prev) => ({
                            ...prev,
                            files: prev.files.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-red-400 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={submitCustomer}
              disabled={loading}
              className={`flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition
    ${
      loading
        ? "bg-gray-400 text-black cursor-not-allowed"
        : "bg-white text-black hover:bg-gray-400 cursor-pointer"
    }`}
            >
              {loading ? (
                <>
                  {/* Spinner */}
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>

                  {/* Funny text */}
                  <span className="text-sm">
                    {funnyLines[Math.floor(Math.random() * funnyLines.length)]}
                  </span>
                </>
              ) : (
                "Send Your Query"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* TRUST SECTION */}
      <div className="my-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center">
        {[
          {
            title: "Human Support 🤍",
            desc: "Real people, real replies — no bots.",
          },
          {
            title: "Fair Marketplace 🛍️",
            desc: "Designed to support both customers and independent businesses.",
          },
          {
            title: "Privacy & Security 🔒",
            desc: "Your data is never misused or sold.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl"
          >
            <h3 className="text-xl text-white font-semibold mb-2">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CONTACT DETAILS */}
      <div className="max-w-5xl mx-auto mt-20 grid md:grid-cols-3 gap-6 text-center">
        {[
          {
            title: "Email Us 📧",
            desc: "support@brawvly.com",
            sub: "We reply within 24 hours",
          },
          {
            title: "Working Hours ⏰",
            desc: "Mon – Sat",
            sub: "10:00 AM – 7:00 PM IST",
          },
          {
            title: "Location 🌍",
            desc: "India",
            sub: "Serving nationwide merchants",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {item.title}
            </h3>
            <p className="text-gray-300">{item.desc}</p>
            <p className="text-gray-500 text-sm mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="max-w-6xl mx-auto mt-24 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Quick Actions ⚡
        </h2>
        <p className="text-gray-400 mb-8">
          Choose the fastest way to get help or get started.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:support@brawvly.com"
            className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white hover:text-black transition"
          >
            Email Support
          </a>

          <button
            onClick={() => navigate("/sell-with-us")}
            className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white hover:text-black transition cursor-pointer"
          >
            Become a Seller
          </button>

          <button
            disabled
            className="border border-white/10 px-6 py-3 rounded-lg text-gray-500 cursor-not-allowed"
          >
            Help Center (Coming Soon)
          </button>
        </div>
      </div>

      {/* SELLER CTA */}
      <div className="max-w-5xl mx-auto mt-20 mb-25">
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border border-white/10 p-10 rounded-2xl text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Want to sell on Brawvly? 🚀
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Build your own online store, manage everything independently, and
            grow without heavy commissions.
          </p>

          <button
            onClick={() => navigate("/sell-with-us")}
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
          >
            Become a Seller
          </button>
        </div>
      </div>

      <NewsLetter />
    </section>
  );
};

export default Contact;
