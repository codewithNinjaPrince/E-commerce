import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <section className="section-top-gap">
      <footer className="w-full bg-black text-gray-300 px-6 py-14">
        
        {/* MAIN FOOTER CONTENT */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-10">

          {/* BRAND INFO */}
          <div className="transition hover:-translate-y-1 hover:bg-white/5 rounded-xl p-4">
            <img src={assets.logo} className="mb-5 w-40 invert" alt="logo" />
            <p className="leading-6 text-gray-400">
              Discover fashion that celebrates you while uplifting the people
              behind every product. At{" "}
              <span className="text-white font-medium cursor-pointer">
                Brawvly
              </span>
              , we bring premium trends, everyday essentials, and stylish
              accessories from local sellers straight to your hands.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="transition hover:-translate-y-1 hover:bg-white/5 rounded-xl p-4">
            <p className="text-xl font-semibold mb-5 text-white">Quick Links</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/" className="hover:text-blue-300 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-blue-300 transition">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-300 transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-300 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* POLICIES */}
          <div className="transition hover:-translate-y-1 hover:bg-white/5 rounded-xl p-4">
            <p className="text-xl font-semibold mb-5 text-white">Policies</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/shipping-delivery" className="hover:text-blue-300 transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/refund-return" className="hover:text-blue-300 transition">
                  Refund & Return
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-300 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-blue-300 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="transition hover:-translate-y-1 hover:bg-white/5 rounded-xl p-4">
            <p className="text-xl font-semibold mb-5 text-white">Get In Touch</p>

            <ul className="flex flex-col gap-3">
              <li>
                <a href="tel:+918736852549" className="hover:text-blue-300 transition">
                  +91 87368 52549
                </a>
              </li>

              <li>
                <a href="mailto:dixitprince895@gmail.com" className="hover:text-blue-300 transition">
                  dixitprince895@gmail.com
                </a>
              </li>

              <li className="hover:text-blue-300 transition">
                📍 101, Brawvly Tower, Sector 62,<br />
                Noida, Uttar Pradesh, India - 201309
              </li>
            </ul>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-5">
              {[
                { src: "https://cdn-icons-png.flaticon.com/512/733/733585.png", link: "https://wa.me/918736852549", alt: "whatsapp" },
                { src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png", link: "https://www.instagram.com/brawvly/", alt: "instagram" },
                { src: "https://cdn-icons-png.flaticon.com/512/733/733547.png", link: "https://www.facebook.com/profile.php?id=61583969765648", alt: "facebook" },
                { src: "https://cdn-icons-png.flaticon.com/512/733/733579.png", link: "https://twitter.com", alt: "twitter" },
              ].map((icon) => (
                <a
                  key={icon.alt}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition"
                >
                  <img src={icon.src} className="w-6 invert" alt={icon.alt} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="mt-12">
          <hr className="border-gray-700" />
          <p className="py-5 text-center text-white text-sm hover:text-blue-300 transition">
            © 2025 Brawvly Marketplace — All Rights Reserved.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;

