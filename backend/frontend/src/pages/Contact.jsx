import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

const Contact = () => {
  const whatsappMessage = encodeURIComponent(
    "Hi Brawvly Team 👋, I want to apply for a job. Here's my resume."
  );

  return (
    <div className="px-4 md:px-10">
      {/* Page Heading */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"Contact"} text2={"Us"} />
        <p className="text-gray-500 mt-3">
          Let’s talk fashion, business, ideas or just say hi 👋
        </p>
      </div>

      {/* Main Section */}
      <div className="my-12 flex flex-col md:flex-row items-center gap-12">
        {/* Left Image */}
        <img
          className="w-full md:max-w-[450px] rounded-2xl shadow-lg"
          src={assets.contact_img}
          alt="Contact image"
        />

        {/* Right Content */}
        <div className="flex flex-col justify-center gap-6 text-left">
          <p className="font-semibold text-2xl text-black">
            Our Brawvly Office 🏢
          </p>

          <p className="text-gray-600 leading-relaxed">
            We’re not just a marketplace, we’re building the backbone for local
            sellers to fight against heavy-commission giants. If you’re a
            seller, customer, or dreamer — you belong here.
          </p>

          <p className="text-gray-500 flex flex-col gap-2">
            {/* Address */}
            <span className="hover:text-black transition cursor-pointer">
              📍 Dummy Address
            </span>

            {/* Click-to-call */}
            <a
              href="tel:+918736852549"
              className="hover:text-black transition cursor-pointer flex items-center gap-2"
            >
              📞 +91 87368 52549
            </a>

            {/* Click-to-email */}
            <a
              href="mailto:dixitprince895@gmail.com"
              className="hover:text-black transition cursor-pointer flex items-center gap-2"
            >
              📧 dixitprince895@gmail.com
            </a>
          </p>

          {/* Explore Jobs Button */}
          <a
            href={`https://wa.me/918736852549?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black px-8 py-4 w-fit text-sm hover:bg-black hover:text-white transition-all duration-300 rounded-lg cursor-pointer"
          >
            🚀 Explore Jobs & Send Resume
          </a>
        </div>
      </div>

      {/* Why Contact Us Section */}
      <div className="my-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Why Contact Brawvly? 🤝</h2>
        <p className="text-gray-500 max-w-3xl mx-auto leading-relaxed">
          Whether you're a seller tired of paying heavy commissions, a creator
          wanting collaboration, or a customer with a cool suggestion — we’re
          always listening. Brawvly believes in people before profits 💙
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-12">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/918736852549?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
            alt="WhatsApp"
            className="w-10 mx-auto mb-3"
          />
          <h3 className="font-semibold text-lg">WhatsApp Us</h3>
          <p className="text-gray-500 text-sm">
            Quick reply, direct conversation.
          </p>
        </a>

        {/* Email */}
        <a
          href="mailto:dixitprince895@gmail.com"
          className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
            alt="Email"
            className="w-10 mx-auto mb-3"
          />
          <h3 className="font-semibold text-lg">Email Us</h3>
          <p className="text-gray-500 text-sm">
            For detailed queries & partnerships.
          </p>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/brawvly/"
          target="_blank"
          rel="noopener noreferrer"
          className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
            alt="Instagram"
            className="w-10 mx-auto mb-3"
          />
          <h3 className="font-semibold text-lg">Instagram</h3>
          <p className="text-gray-500 text-sm">Follow. DM. Stay trendy 📸</p>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/profile.php?id=61583969765648"
          target="_blank"
          rel="noopener noreferrer"
          className="border p-6 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
            alt="Facebook"
            className="w-10 mx-auto mb-3"
          />
          <h3 className="font-semibold text-lg">Facebook</h3>
          <p className="text-gray-500 text-sm">Let’s build a community 🌍</p>
        </a>
      </div>

      {/* Extra Fun Section */}
      <div className="bg-gray-50 p-8 rounded-2xl shadow-sm text-center mb-14">
        <h3 className="text-2xl font-semibold mb-4">
          Got a crazy idea? Let’s build it together 💡
        </h3>
        <p className="text-gray-500 max-w-xl mx-auto">
          From seller onboarding to collaborations and investor talks — Brawvly
          is on a mission to make local brands global. Your message might start
          something BIG.
        </p>
      </div>

      <NewsLetter />
    </div>
  );
};

export default Contact;
