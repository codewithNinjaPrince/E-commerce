// import React from "react";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import NewsLetter from "../components/NewsLetter";

// const Contact = () => {
//   const whatsappMessage = encodeURIComponent(
//     "Hi Brawvly Team 👋, I want to apply for a job. Here's my resume."
//   );

//   return (
//     <div className="px-4 md:px-10">
//       {/* Page Heading */}
//       <div className="text-2xl text-center pt-8 border-t">
//         <Title text1={"Contact"} text2={"Us"} />
//         <p className="text-gray-500 mt-3">
//           Let’s talk fashion, business, ideas or just say hi 👋
//         </p>
//       </div>

//       {/* Main Section */}
//       <div className="my-12 flex flex-col md:flex-row items-center gap-12">
//         {/* Left Image */}
//         <img
//           className="w-full md:max-w-[450px] rounded-2xl shadow-lg"
//           src={assets.contact_img}
//           alt="Contact image"
//         />

//         {/* Right Content */}
//         <div className="flex flex-col justify-center gap-6 text-left">
//           <p className="font-semibold text-2xl text-black">
//             Our Brawvly Office 🏢
//           </p>

//           <p className="text-gray-600 leading-relaxed">
//             We’re not just a marketplace, we’re building the backbone for local
//             sellers to fight against heavy-commission giants. If you’re a
//             seller, customer, or dreamer — you belong here.
//           </p>

//           <p className="text-gray-500 flex flex-col gap-2">
//             {/* Address */}
//             <span className="hover:text-black transition cursor-pointer">
//               📍 Dummy Address
//             </span>

//             {/* Click-to-call */}
//             <a
//               href="tel:+918736852549"
//               className="hover:text-black transition cursor-pointer flex items-center gap-2"
//             >
//               📞 +91 87368 52549
//             </a>

//             {/* Click-to-email */}
//             <a
//               href="mailto:dixitprince895@gmail.com"
//               className="hover:text-black transition cursor-pointer flex items-center gap-2"
//             >
//               📧 dixitprince895@gmail.com
//             </a>
//           </p>

//           {/* Explore Jobs Button */}
//           <a
//             href={`https://wa.me/918736852549?text=${whatsappMessage}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="border border-black px-8 py-4 w-fit text-sm hover:bg-black hover:text-white transition-all duration-300 rounded-lg cursor-pointer"
//           >
//             🚀 Explore Jobs & Send Resume
//           </a>
//         </div>
//       </div>

//       {/* Why Contact Us Section */}
//       <div className="my-16 text-center">
//         <h2 className="text-3xl font-semibold mb-4">Why Contact Brawvly? 🤝</h2>
//         <p className="text-gray-500 max-w-3xl mx-auto leading-relaxed">
//           Whether you're a seller tired of paying heavy commissions, a creator
//           wanting collaboration, or a customer with a cool suggestion — we’re
//           always listening. Brawvly believes in people before profits 💙
//         </p>
//       </div>

//       {/* Contact Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-12">
//         {/* WhatsApp */}
//         <a
//           href={`https://wa.me/918736852549?text=${whatsappMessage}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
//         >
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
//             alt="WhatsApp"
//             className="w-10 mx-auto mb-3"
//           />
//           <h3 className="font-semibold text-lg">WhatsApp Us</h3>
//           <p className="text-gray-500 text-sm">
//             Quick reply, direct conversation.
//           </p>
//         </a>

//         {/* Email */}
//         <a
//           href="mailto:dixitprince895@gmail.com"
//           className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
//         >
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
//             alt="Email"
//             className="w-10 mx-auto mb-3"
//           />
//           <h3 className="font-semibold text-lg">Email Us</h3>
//           <p className="text-gray-500 text-sm">
//             For detailed queries & partnerships.
//           </p>
//         </a>

//         {/* Instagram */}
//         <a
//           href="https://www.instagram.com/brawvly/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
//         >
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
//             alt="Instagram"
//             className="w-10 mx-auto mb-3"
//           />
//           <h3 className="font-semibold text-lg">Instagram</h3>
//           <p className="text-gray-500 text-sm">Follow. DM. Stay trendy 📸</p>
//         </a>

//         {/* Facebook */}
//         <a
//           href="https://www.facebook.com/profile.php?id=61583969765648"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
//         >
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
//             alt="Facebook"
//             className="w-10 mx-auto mb-3"
//           />
//           <h3 className="font-semibold text-lg">Facebook</h3>
//           <p className="text-gray-500 text-sm">Let’s build a community 🌍</p>
//         </a>
//       </div>

//       {/* Extra Fun Section */}
//       <div className="bg-gray-50 p-8 rounded-2xl shadow-sm text-center mb-14">
//         <h3 className="text-2xl font-semibold mb-4">
//           Got a crazy idea? Let’s build it together 💡
//         </h3>
//         <p className="text-gray-500 max-w-xl mx-auto">
//           From seller onboarding to collaborations and investor talks — Brawvly
//           is on a mission to make local brands global. Your message might start
//           something BIG.
//         </p>
//       </div>

//       <NewsLetter />
//     </div>
//   );
// };

// export default Contact;

import React, { useState } from "react";
import Title from "../components/Title";
import NewsLetter from "../components/NewsLetter";

const Contact = () => { // already installed
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // SUBMIT SELLER FORM
  const submitSeller = async () => {
    try {
      const res = await fetch("backendUrl/api/form/seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellerData),
      });

      const data = await res.json();
      if (!data.success) return toast.error(data.message);

      toast.success("Seller request submitted!");
      setSellerData({
        name: "",
        email: "",
        phone: "",
        shopName: "",
        address: "",
        category: "",
        message: "",
      });
    } catch (err) {
      toast.error("Server error!");
    }
  };

  // SUBMIT CUSTOMER SUPPORT FORM
  const submitCustomer = async () => {
    try {
      const res = await fetch("backendUrl/api/form/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      const data = await res.json();
      if (!data.success) return toast.error(data.message);

      toast.success("Message sent!");
      setCustomerData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Server error!");
    }
  };

  // SELLER FORM STATES
  const [sellerData, setSellerData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
    address: "",
    category: "",
    message: "",
  });

  // CUSTOMER FORM STATES
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // SELLER HANDLE CHANGE
  const handleSellerChange = (e) => {
    setSellerData({ ...sellerData, [e.target.name]: e.target.value });
  };

  // CUSTOMER HANDLE CHANGE
  const handleCustomerChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  return (
    <div className="px-4 md:px-10 bg-black text-gray-300 py-10">
      {/* PAGE HEADER */}
      <div className="text-center pt-6 text-2xl color-white">
        <Title text1="Contact" text2="Us" />
        <p className="text-gray-400 mt-3">
          Whether you're a seller or a customer — we’re here for you 🤝
        </p>
      </div>

      {/* CONTACT SECTIONS */}
      <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* SELLER CONTACT FORM */}
        <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Become a Seller 🚀
          </h2>
          <p className="text-gray-400 mb-6">
            Join Brawvly and grow your business online. Share your details and
            our team will contact you.
          </p>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={sellerData.name}
              onChange={handleSellerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={sellerData.email}
              onChange={handleSellerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={sellerData.phone}
              onChange={handleSellerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <input
              type="text"
              name="shopName"
              placeholder="Shop / Brand Name"
              value={sellerData.shopName}
              onChange={handleSellerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <input
              type="text"
              name="address"
              placeholder="Full Business Address"
              value={sellerData.address}
              onChange={handleSellerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <select
              name="category"
              value={sellerData.category}
              onChange={handleSellerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            >
              <option value="">Select Business Category</option>
              <option>Clothing</option>
              <option>Footwear</option>
              <option>Accessories</option>
              <option>Home Decor</option>
              <option>Beauty & Care</option>
              <option>Other</option>
            </select>

            <textarea
              name="message"
              rows={4}
              placeholder="Tell us more about your business..."
              value={sellerData.message}
              onChange={handleSellerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            ></textarea>

            <button
              type="button"
              onClick={submitSeller}
              className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-400 transition cursor-pointer"
            >
              Submit Seller Request
            </button>
          </form>
        </div>

        {/* CUSTOMER CONTACT FORM */}
        <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Customer Support 💬
          </h2>
          <p className="text-gray-400 mb-6">
            Have questions, feedback, or issues? Send us a message — we reply
            fast!
          </p>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={customerData.name}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={customerData.email}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={customerData.phone}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            />

            <textarea
              name="message"
              rows={5}
              placeholder="Write your message..."
              value={customerData.message}
              onChange={handleCustomerChange}
              className="bg-black border border-white/20 p-3 rounded-lg text-gray-300"
            ></textarea>

            <button
              type="button"
              onClick={submitCustomer}
              className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-400 cursor-pointer transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* WHY CONTACT SECTION */}
      <div className="my-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Why Contact Brawvly? 🤝
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Whether you're a seller wanting growth or a customer needing help,
          Brawvly listens. We believe in real support, clear communication, and
          building trust with every interaction.
        </p>
      </div>

      {/* FUN LAST SECTION */}
      <div className="bg-[#1a1a1a] border border-white/10 p-10 rounded-2xl shadow-xl text-center mb-14">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Got a crazy idea? Let's build it together 💡
        </h3>
        <p className="text-gray-400 max-w-xl mx-auto">
          From collaborations to brand partnerships — your message might start
          something BIG.
        </p>
      </div>

      <NewsLetter />
    </div>
  );
};

export default Contact;
