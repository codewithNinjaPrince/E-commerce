import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginRequired = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      navigate("/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-300 text-lg animate-pulse">
        Please login to continue…
      </p>
    </div>
  );
};

export default LoginRequired;
