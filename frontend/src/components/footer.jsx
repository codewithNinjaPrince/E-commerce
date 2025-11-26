import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-32 w-full bg-black text-gray-300 px-6 py-14">

      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-14">

        {/* BRAND INFO */}
        <div>
          <img src={assets.logo} className="mb-5 w-40 invert" alt="logo" />
          <p className="leading-6 text-gray-400">
            Discover fashion that celebrates you while uplifting the people
            behind every product. At{" "}
            <span className="text-2xm text-white">Brawvly</span>, we bring
            premium trends, everyday essentials, and stylish accessories from
            local sellers straight to your hands.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <p className="text-xl font-semibold mb-5 text-white">Quick Links</p>
          <ul className="flex flex-col gap-2">
            <li><Link to="/" className="hover:text-gray-100 transition">Home</Link></li>
            <li><Link to="/collections" className="hover:text-gray-100 transition">Collections</Link></li>
            <li><Link to="/about" className="hover:text-gray-100 transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-100 transition">Contact</Link></li>
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <p className="text-xl font-semibold mb-5 text-white">Policies</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/shipping-delivery" className="hover:text-gray-100 transition">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link to="/refund-return" className="hover:text-gray-100 transition">
                Refund & Return
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-gray-100 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-conditions" className="hover:text-gray-100 transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-xl font-semibold mb-5 text-white">Get In Touch</p>

          <ul className="flex flex-col gap-2">
            <li>
              <a href="tel:+918736852549" className="hover:text-gray-100 transition">
                +91 87368 52549
              </a>
            </li>

            <li>
              <a href="mailto:dixitprince895@gmail.com" className="hover:text-gray-100 transition">
                dixitprince895@gmail.com
              </a>
            </li>

            <li className="hover:text-gray-100 transition cursor-pointer">
              📍 101, Brawvly Tower, Sector 62,<br />
              Noida, Uttar Pradesh, India - 201309
            </li>
          </ul>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-5">
            <a
              href="https://wa.me/918736852549"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" className="w-6 invert" alt="whatsapp" />
            </a>

            <a
              href="https://www.instagram.com/brawvly/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" className="w-6 invert" alt="instagram" />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61583969765648"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" className="w-6 invert" alt="facebook" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" className="w-6 invert" alt="twitter" />
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="mt-10">
        <hr className="border-gray-700" />
        <p className="py-5 text-center text-white text-sm">
          © 2025 Brawvly Marketplace — All Rights Reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
