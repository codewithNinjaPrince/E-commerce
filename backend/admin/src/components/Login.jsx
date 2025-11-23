import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        backendUrl + '/api/user/admin',
        { email, password }
      );

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">

      {/* 🔄 LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">

          <div className="w-16 h-16 border-4 border-gray-400 border-t-white rounded-full animate-spin mb-6"></div>

          <p className="text-white text-lg font-medium tracking-wide text-center">
            Please wait while we unlock your control panel 🔐
          </p>

          <p className="text-sm text-gray-400 mt-1 italic">
            “Power belongs to those who stay consistent.”
          </p>
        </div>
      )}

      {/* 🔐 LOGIN BOX */}
      <div className={`
        backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl 
        px-10 py-10 w-[380px] text-white transition-all duration-300
        ${loading ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}
      `}>

        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide">BRAWVLY</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Control Panel</p>
        </div>

        <form onSubmit={onSubmitHandler}>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-300">
              Admin Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:border-white text-white"
              type="email"
              placeholder="admin@brawvly.com"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:border-white text-white"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-lg font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
          >
            {loading ? "Logging In..." : "Enter Dashboard"}
          </button>

        </form>

        {/* Footer Quote */}
        <p className="text-xs text-gray-400 text-center mt-6 italic">
          Built for creators. Powered by vision.
        </p>

      </div>
    </div>
  );
};

export default Login;

