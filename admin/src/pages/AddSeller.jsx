import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddSeller = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createSeller = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        backendUrl + "/api/user/admin/create-seller",
        { name, email, password },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Seller account created successfully ✔");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden px-4">

      {/* 🔄 LOADING OVERLAY — Same as Login */}
      {loading && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-white rounded-full animate-spin mb-6"></div>

          <p className="text-white text-lg font-medium tracking-wide text-center">
            Creating Seller...
          </p>

          <p className="text-gray-300 text-sm mt-2 italic">
            Setting up access for your new seller.
          </p>
        </div>
      )}

      {/* MAIN CARD (1:1 login style) */}
      <div
        className={`
          backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl 
          px-10 py-10 w-[380px] text-white transition-all duration-300
          ${loading ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}
        `}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide">Add Seller</h1>
          <p className="text-sm text-gray-300 mt-1">
            Admin — Create New Seller Account
          </p>
        </div>

        <div className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium text-gray-300">Seller Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 
              text-white placeholder-gray-400 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Seller Email</label>
            <input
              type="email"
              placeholder="seller@brawvly.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 
              text-white placeholder-gray-400 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 
              text-white placeholder-gray-400 focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* BUTTON — same white button as login */}
        <button
          onClick={createSeller}
          disabled={loading}
          className="w-full mt-6 bg-white text-black py-2 rounded-lg font-semibold 
          tracking-wide hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          Create Seller
        </button>

        <p className="text-xs text-gray-400 text-center mt-6 italic">
          Seller can log in immediately after creation.
        </p>
      </div>
    </div>
  );
};

export default AddSeller;
