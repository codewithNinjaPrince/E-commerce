// import React from 'react'
// import { assets } from '../assets/assets'

// const Navbar = ({ setToken }) => {
//   return (
//     <div className="flex items-center justify-between px-[4%] py-3 bg-gradient-to-r from-black via-gray-900 to-black border-b border-white/10 shadow-lg backdrop-blur-md">

//       {/* Logo / Brand */}
//       <div className="flex items-center gap-2 cursor-pointer">
//         <p className="text-white tracking-wider text-base sm:text-lg font-semibold">BRAWVLY 
//           <span className="block sm:inline text-gray-400 text-xs sm:text-sm ml-0 sm:ml-1">
//             Admin
//           </span>
//         </p>
//       </div>

//       {/* Logout Button */}
//       <button 
//         onClick={() => setToken('')} className="bg-white text-black px-4 py-1.5 sm:px-8 sm:py-2 
//         rounded-full text-xs sm:text-sm font-semibold tracking-wide hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-md cursor-pointer">
//         Logout
//       </button>

//     </div>
//   )
// }

// export default Navbar;

// // No changes at 8:13:03

import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center justify-between px-[4%] py-3 bg-gradient-to-r from-black via-gray-900 to-black border-b border-white/10 shadow-lg backdrop-blur-md">

      {/* Logo / Brand */}
      <div className="flex items-center gap-2 cursor-pointer">
        <p className="text-white tracking-wider text-base sm:text-lg font-semibold">BRAWVLY 
          <span className="block sm:inline text-gray-400 text-xs sm:text-sm ml-0 sm:ml-1">
            Admin
          </span>
        </p>
      </div>

      {/* Logout Button */}
      <button 
        onClick={() =>{localStorage.removeItem("adminToken"); localStorage.removeItem("adminRole"); setToken("");} } className="bg-white text-black px-4 py-1.5 sm:px-8 sm:py-2 
        rounded-full text-xs sm:text-sm font-semibold tracking-wide hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-md cursor-pointer">
        Logout
      </button>

    </div>
  )
}

export default Navbar;
