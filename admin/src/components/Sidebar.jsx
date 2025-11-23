import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="Add icon" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="Add icon" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/order"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="Add icon" />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        <NavLink
          className={({
            isActive,
          }) => `flex items-center gap-3 px-3 py-2 rounded-lg border 
  ${isActive ? "bg-white/10 border-yellow-400" : "border-white/20"} 
  hover:bg-white/10 transition-all`}
          to="/upload-guide"
        >
          <p className="block text-sm">📖 Upload Guide</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
