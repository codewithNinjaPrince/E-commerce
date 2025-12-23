import React, { useEffect, useState } from "react";
import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";

const Navbar = ({ showNavbar }) => {
  // sm + md → Mobile Navbar
  // lg + xl → Desktop Navbar
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
    window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  return (
    <>
      {isMobileOrTablet ? (
        <NavbarMobile showNavbar={showNavbar} />
      ) : (
        <NavbarDesktop />
      )}
    </>
  );
};

export default Navbar;






