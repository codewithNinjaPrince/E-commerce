import { useEffect, useRef, useState } from "react";

const BottomSheet = ({ open, onClose, children }) => {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (open) setTranslateY(0);
  }, [open]);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const onTouchEnd = () => {
    if (translateY > 120) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* SHEET */}
      <div
        ref={sheetRef}
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="
  absolute bottom-0 left-0 w-full
  bg-[#111]
  rounded-t-2xl
  transition-transform duration-200
  h-[50vh]          /* 👈 HALF SCREEN */
  flex flex-col
"
      >
        {/* DRAG HANDLE */}
        <div className="py-3 flex justify-center">
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
