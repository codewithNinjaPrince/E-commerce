// import { MdMenu } from "react-icons/md";

// const MobileNavbar = ({ setSidebarOpen }) => {
//   return (
//     <div className="lg:hidden w-full h-[65px] bg-[#151515] border-b border-[#222] 
//       fixed top-0 left-0 z-[900] flex items-center justify-between px-5">

//       {/* HAMBURGER */}
//       <button
//         onClick={() => setSidebarOpen(true)}
//         className="text-white text-3xl cursor-pointer"
//       >
//         <MdMenu />
//       </button>

//       {/* BRAND */}
//       <div className="flex flex-col text-right select-none">
//         <span className="text-white text-lg font-bold tracking-wide">BRAWVLY</span>
//         <span className="text-gray-400 text-[11px] -mt-[3px]">Merchant Panel</span>
//       </div>
//     </div>
//   );
// };

// export default MobileNavbar;

import { MdMenu } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const MobileNavbar = ({ setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide back button only on home/dashboard
  const showBack =
    location.pathname !== "/" &&
    location.pathname !== "/dashboard";

  return (
    <div className="lg:hidden w-full h-[65px] bg-[#151515] border-b border-[#222]
      fixed top-0 left-0 z-[900] flex items-center justify-between px-5">
      
      {/* HAMBURGER */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-white text-3xl cursor-pointer"
      >
        <MdMenu />
      </button>

      {/* BRAND */}
      <div className="flex flex-col text-center select-none">
        <span className="text-white text-lg font-bold tracking-wide">BRAWVLY</span>
        <span className="text-gray-400 text-[11px] -mt-[3px]">Merchant Panel</span>
      </div>

      {/* BACK BUTTON */}
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border border-gray-500 rounded-lg text-white text-sm
                     hover:bg-white/10 transition flex items-center gap-2"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>
      ) : (
        <div className="w-[70px]"></div>
      )}
    </div>
  );
};

export default MobileNavbar;
