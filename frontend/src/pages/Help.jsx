import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTools } from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="min-h-screen bg-black text-white pt-[64px] pb-20 flex items-center justify-center">
      <div className="max-w-md w-full px-4 text-center">
        {/* ICON */}
        <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
          <FaTools className="text-xl text-white" />
        </div>

        {/* TITLE */}
        <h1 className="mt-6 text-xl font-semibold">
          We’re working on this page
        </h1>

        {/* MESSAGE */}
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          Our support section is currently under maintenance.
          We’re fixing a few things to give you a better experience.
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Please check back again shortly.
        </p>

        {/* ACTION */}
        <button
          onClick={() => navigate(-1)}
          className="
            mt-8 w-full py-3
            rounded-xl
            border border-white/20
            hover:bg-white/10
            transition
            cursor-pointer
            flex items-center justify-center gap-2
          "
        >
          <FaArrowLeft />
          Go back
        </button>
      </div>
    </section>
  );
};

export default Help;
