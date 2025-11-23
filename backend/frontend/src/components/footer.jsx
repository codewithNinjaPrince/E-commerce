import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const footer = () => {
  return (
    <footer className="mt-32 text-sm bg-[#FAF7F2] text-[#6B6B6B] px-6 py-12">
      
      {/* Main Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-14">

        {/* Brand Info */}
        <div>
          <img src={assets.logo} className="mb-5 w-36" alt="logo" />
          <p className="leading-6">
            Discover fashion that celebrates you while uplifting the people
            behind every product. At{" "}
            <span className="font-semibold text-black">Brawvly</span>, we bring
            premium trends, everyday essentials, and stylish accessories from
            local sellers straight to your hands — helping you look good, feel
            confident, and support small businesses with every purchase.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-xl font-medium mb-5 text-black">Quick Links</p>
          <ul className="flex flex-col gap-2">
            <li><Link to="/" className="hover:text-[#C8A165] transition">Home</Link></li>
            <li><Link to="/collections" className="hover:text-[#C8A165] transition">Collections</Link></li>
            <li><Link to="/about" className="hover:text-[#C8A165] transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-[#C8A165] transition">Contact</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <p className="text-xl font-medium mb-5 text-black">Policies</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/shipping-delivery" className="hover:text-[#C8A165] transition">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link to="/refund-return" className="hover:text-[#C8A165] transition">
                Refund & Return
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-[#C8A165] transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-conditions" className="hover:text-[#C8A165] transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Get In Touch */}
        <div>
          <p className="text-xl font-medium mb-5 text-black">Get In Touch</p>

          <ul className="flex flex-col gap-2">
            <li>
              <a href="tel:+918736852549" className="hover:text-[#C8A165] transition">
                +91 87368 52549
              </a>
            </li>

            <li>
              <a href="mailto:dixitprince895@gmail.com" className="hover:text-[#C8A165] transition">
                dixitprince895@gmail.com
              </a>
            </li>

            {/* Dummy Address */}
            <li className="hover:text-[#C8A165] transition cursor-pointer">
              📍 101, Brawvly Tower, Sector 62,<br />
              Noida, Uttar Pradesh, India - 201309
            </li>
          </ul>

          {/* Social Media */}
          <div className="flex gap-4 mt-5">
            <a href="https://wa.me/918736852549" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" className="w-6" alt="whatsapp" />
            </a>

            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" className="w-6" alt="instagram" />
            </a>

            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" className="w-6" alt="facebook" />
            </a>

            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" className="w-6" alt="twitter" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-10">
        <hr />
        <p className="py-5 text-center text-gray-500">
          © 2025 Brawvly Marketplace — All Rights Reserved.
        </p>
      </div>

    </footer>
  );
};

export default footer;
