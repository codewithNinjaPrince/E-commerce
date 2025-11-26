import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Login = ({ setToken, setRole }) => {
  const [role, setUserRole] = useState("admin");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ALWAYS only ONE endpoint
      const endpoint = backendUrl + "/api/user/admin";

      const response = await axios.post(endpoint, { email, password, role });

      if (response.data.success) {
        setToken(response.data.token);
        setRole(response.data.role);

        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminRole", response.data.role);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">

      {loading && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-white rounded-full animate-spin mb-6"></div>
          <p className="text-white text-lg font-medium tracking-wide text-center">
            Logging in as {role === "admin" ? "Admin" : "Seller"}...
          </p>
        </div>
      )}

      <div className={`
        backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl 
        px-10 py-10 w-[380px] text-white transition-all duration-300
        ${loading ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}
      `}>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide">BRAWVLY</h1>
          <p className="text-sm text-gray-400 mt-1">Admin & Seller Panel</p>
        </div>

        <form onSubmit={onSubmitHandler}>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-300">Login As</label>
            <select
              value={role}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 text-white"
            >
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-300">
              {role === "admin" ? "Admin Email" : "Seller Email"}
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:border-white text-white"
              type="email"
              placeholder={role === "admin" ? "admin@brawvly.com" : "seller@shop.com"}
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:border-white text-white"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-lg font-semibold tracking-wide hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            {loading ? "Authenticating..." : `Login as ${role}`}
          </button>

        </form>

        <p className="text-xs text-gray-400 text-center mt-6 italic">
          Empowering every seller. Controlled by admin.
        </p>

      </div>
    </div>
  );
};

export default Login;

