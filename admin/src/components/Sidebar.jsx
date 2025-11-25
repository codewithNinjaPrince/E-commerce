// import React from "react";
// import { NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";

// const Sidebar = () => {
//   return (
//     <div className="w-[18%] min-h-screen border-r-2">
//       <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
//           to="/add"
//         >
//           <img className="w-5 h-5" src={assets.add_icon} alt="Add icon" />
//           <p className="hidden md:block">Add Items</p>
//         </NavLink>

//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
//           to="/list"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} alt="Add icon" />
//           <p className="hidden md:block">List Items</p>
//         </NavLink>

//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
//           to="/order"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} alt="Add icon" />
//           <p className="hidden md:block">Orders</p>
//         </NavLink>

//       </div>
//     </div>
//   );
// };
// export default Sidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = ({ role }) => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        {/* Add Product */}
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="add" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        {/* List Product */}
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="list" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        {/* Orders */}
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/order"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="orders" />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        {role === "admin" && (
          <>
            {/* Add Seller */}
            <NavLink
              className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
              to="/add-seller"
            >
              <img className="w-5 h-5" src={assets.add_icon} alt="seller" />
              <p className="hidden md:block">Add Seller</p>
            </NavLink>

            {/* All Sellers */}
            <NavLink
              className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
              to="/sellers"
            >
              <img className="w-5 h-5" src={assets.order_icon} alt="sellers" />
              <p className="hidden md:block">All Sellers</p>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
