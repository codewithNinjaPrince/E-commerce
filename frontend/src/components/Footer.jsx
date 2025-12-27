import React,{useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  /* 🌐 ONLINE / OFFLINE */
  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  const showSkeleton = !isOnline;

  return (
    <section>
      {/* SAME OUTER CONTAINER AS OurPolicy */}
      <div
        className="
          bg-black/90
          border border-white/10
          rounded-xl
          overflow-hidden
          shadow-[0_0_40px_rgba(255,255,255,0.06)]

          mt-4 mb-4
          sm:mt-6 sm:mb-6
          lg:mt-8 lg:mb-8
        "
      >
        {/* INNER CONTENT — SAME FEEL AS OurPolicy */}
        <div className="w-full px-4 sm:px-2 md:px-3 lg:px-4 py-6 sm:py-8 md:py-10">
          {/* GRID — SAME DISCIPLINE */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-4
              gap-4 sm:gap-8 md:gap-12 lg:gap-16
            "
          >
            {/* BRAND */}
            <div className="lg:pl-10 xl:pl-16 pr-5">
              {showSkeleton ? (
                <>
                  <div className="h-10 w-32 bg-gray-700/40 rounded mb-4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700/30 rounded w-full animate-pulse" />
                    <div className="h-3 bg-gray-700/30 rounded w-5/6 animate-pulse" />
                    <div className="h-3 bg-gray-700/30 rounded w-4/6 animate-pulse" />
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={assets.logo}
                    className="mb-4 w-36 invert"
                    alt="logo"
                  />
                  <p className="text-sm leading-relaxed text-gray-400">
                    Discover fashion that celebrates you while uplifting the
                    people behind every product. At{" "}
                    <span className="text-white font-medium">Brawvly</span>, we
                    bring premium trends, everyday essentials, and stylish
                    accessories from local sellers straight to you.
                  </p>
                </>
              )}
            </div>

            {/* QUICK LINKS */}
            <div className="lg:pl-10 xl:pl-16 pr-5">
              {showSkeleton ? (
                <>
                  <div className="h-5 w-28 bg-gray-700/40 rounded mb-4 animate-pulse" />
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-3 bg-gray-700/30 rounded w-24 mb-3 animate-pulse"
                    />
                  ))}
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-white mb-4">
                    Quick Links
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {[
                      { label: "Home", link: "/" },
                      { label: "Collections", link: "/collections" },
                      { label: "About", link: "/about" },
                      { label: "Contact", link: "/contact" },
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="transition-transform duration-300 hover:scale-[1.06] cursor-pointer"
                      >
                        <Link
                          to={item.link}
                          className="hover:text-white transition"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* POLICIES */}
            <div className="lg:pl-10 xl:pl-16 pr-5">
              {showSkeleton ? (
                <>
                  <div className="h-5 w-28 bg-gray-700/40 rounded mb-4 animate-pulse" />
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-3 bg-gray-700/30 rounded w-32 mb-3 animate-pulse"
                    />
                  ))}
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-white mb-4">
                    Policies
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {[
                      {
                        label: "Shipping & Delivery",
                        link: "/shipping-delivery",
                      },
                      { label: "Refund & Return", link: "/refund-return" },
                      { label: "Privacy Policy", link: "/privacy-policy" },
                      { label: "Terms & Conditions", link: "/terms-conditions",},
                      { label: "Affiliate Policy", link: "/affiliate-policy",},
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="transition-transform duration-300 hover:scale-[1.06] cursor-pointer"
                      >
                        <Link
                          to={item.link}
                          className="hover:text-white transition"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* CONTACT */}
            <div>
              {showSkeleton ? (
                <>
                  <div className="h-5 w-32 bg-gray-700/40 rounded mb-4 animate-pulse" />
                  <div className="h-3 bg-gray-700/30 rounded w-40 mb-3 animate-pulse" />
                  <div className="h-3 bg-gray-700/30 rounded w-44 mb-3 animate-pulse" />
                  <div className="h-3 bg-gray-700/30 rounded w-full animate-pulse" />
                  <div className="flex gap-3 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-5 h-5 bg-gray-700/40 rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-white mb-4">
                    Get In Touch
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="transition-transform duration-300 hover:scale-[1.06] cursor-pointer">
                      <a
                        href="tel:+918736852549"
                        className="hover:text-white transition"
                      >
                        📞 +91 87368 52549
                      </a>
                    </li>

                    <li className="transition-transform duration-300 hover:scale-[1.06] cursor-pointer">
                      <a
                        href="mailto:support@brawvly.com"
                        className="hover:text-white transition"
                      >
                        ✉️ support@brawvly.com
                      </a>
                    </li>

                    <li className="transition-transform duration-300 hover:scale-[1.06] hover:text-white cursor-pointer">
                      📍 101, Brawvly Tower, Sector 62,
                      <br />
                      Noida, Uttar Pradesh, India - 201309
                    </li>
                  </ul>

                  {/* SOCIAL */}
                  <div className="flex gap-4 mt-5">
                    {[
                      {
                        src: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
                        link: "https://wa.me/918736852549",
                      },
                      {
                        src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
                        link: "https://www.instagram.com/brawvly/",
                      },
                      {
                        src: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
                        link: "https://www.facebook.com/profile.php?id=61583969765648",
                      },
                      {
                        src: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
                        link: "https://twitter.com",
                      },
                    ].map((icon, i) => (
                      <a
                        key={i}
                        href={icon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition"
                      >
                        <img
                          src={icon.src}
                          className="w-5 invert"
                          alt="social"
                        />
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="mt-8 border-t border-white/10 cursor-pointer"></div>

          {/* COPYRIGHT */}
          <p className="text-center text-xs sm:text-sm text-gray-400 mt-4 cursor-pointer hover:scale-110 transition hover:text-white">
            © 2025 <span className="text-white">Brawvly</span> Marketplace — All
            Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
