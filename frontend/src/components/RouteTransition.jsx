import React from "react";

const RouteTransition = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* ARROW LINE */}
      <div className="absolute top-1/2 left-0 w-full px-8">
        <div className="relative h-[2px] bg-white/20 overflow-hidden">
          {/* LINE FILL */}
          <div className="absolute inset-0 bg-white animate-line-fill" />

          {/* ARROW */}
          <div className="absolute top-1/2 -translate-y-1/2 animate-arrow-move">
            <span className="text-white text-xl">➜</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteTransition;
