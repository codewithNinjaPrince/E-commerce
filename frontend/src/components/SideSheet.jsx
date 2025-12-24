import { useEffect } from "react";

const SideSheet = ({ open, onClose, title = "Filters", children }) => {
  /* 🔒 Lock background scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

   /* 👉 TOUCH HANDLERS */
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
  };

  const handleTouchMove = (e) => {
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = startX.current - currentX.current;

    // 👈 swipe left threshold (adjust if needed)
    if (diff > 70) {
      setTimeout(() => {
        onClose();
      }, 100); // ⏱ 0.10s delay
    }
  };

  return (
    <div className="fixed inset-0 z-[999]">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* SIDE SHEET */}
      <div
        className="
          absolute top-0 left-0
          h-full w-[85%] max-w-[360px]
          bg-[#111]
          shadow-2xl
          flex flex-col
          animate-slide-in-left
          touch-pan-y
        "
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 text-xl hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* CONTENT (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideSheet;
