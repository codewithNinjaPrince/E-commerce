import { useEffect, useRef, useState } from "react";

const BottomSheet = ({ open, onClose, children }) => {
  const contentRef = useRef(null);
  const startY = useRef(0);
  const dragging = useRef(false);

  // Ratios (viewport based)
  const DEFAULT = 0.75; // open height (75%)
  const MAX = 0.9;      // expanded
  const CLOSE = 0.4;    // close threshold

  const [ratio, setRatio] = useState(DEFAULT);

  const translateY = (1 - ratio) * window.innerHeight;

  /* 🔒 Lock background */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  /* Reset on open */
  useEffect(() => {
    if (open) setRatio(DEFAULT);
  }, [open]);

  /* Touch start (anywhere on sheet header / backdrop) */
  const onTouchStart = (e) => {
    dragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  /* Touch move */
  const onTouchMove = (e) => {
    if (!dragging.current) return;

    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;

    setRatio((prev) => {
      let next = prev + diff * 0.0008;
      if (next > MAX) next = MAX;
      if (next < 0.3) next = 0.3;
      return next;
    });
  };

  /* Touch end */
  const onTouchEnd = () => {
    dragging.current = false;

    if (ratio < CLOSE) {
      onClose(); // close sheet
    } else {
      setRatio(DEFAULT); // snap back
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* BACKDROP (tap to close) */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* SHEET */}
      <div
        style={{ transform: `translateY(${translateY}px)` }}
        className="
          absolute bottom-0 left-0 w-full
          bg-[#111]
          rounded-t-2xl
          transition-transform duration-300 ease-out
          flex flex-col
        "
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* DRAG HANDLE */}
        <div className="pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-white/40" />
        </div>

        {/* TITLE */}
        <div className="text-center text-white font-semibold pb-2">
          Filter
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-white/10 w-full" />

        {/* CONTENT (scrollable) */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
