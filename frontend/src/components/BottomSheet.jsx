import { useEffect, useRef, useState } from "react";

const BottomSheet = ({ open, onClose, children }) => {
  const sheetRef = useRef(null);
  const contentRef = useRef(null);

  const startY = useRef(0);
  const lastY = useRef(0);
  const dragging = useRef(false);
  const raf = useRef(null);

  /* 📏 Instagram-style ratios */
  const DEFAULT_RATIO = 0.75; // 75% open
  const MAX_RATIO = 0.9;      // expand up
  const CLOSE_RATIO = 0.4;    // close if below this

  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const ratioRef = useRef(DEFAULT_RATIO);

  const vh = window.innerHeight;

  /* Apply transform directly (smooth) */
  const applyTransform = (r) => {
    if (!sheetRef.current) return;
    const y = (1 - r) * vh;
    sheetRef.current.style.transform = `translateY(${y}px)`;
  };

  /* 🔒 HARD LOCK BACKGROUND SCROLL */
  useEffect(() => {
    if (!open) return;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  /* Reset on open */
  useEffect(() => {
    if (open) {
      ratioRef.current = DEFAULT_RATIO;
      setRatio(DEFAULT_RATIO);
      requestAnimationFrame(() => applyTransform(DEFAULT_RATIO));
    }
  }, [open]);

  /* RAF update for smoothness */
  const updateRatio = (next) => {
    ratioRef.current = next;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      applyTransform(next);
      setRatio(next);
    });
  };

  /* 👆 TOUCH START (header / backdrop area) */
  const onTouchStart = (e) => {
    dragging.current = true;
    startY.current = e.touches[0].clientY;
    lastY.current = startY.current;
  };

  /* 👆 TOUCH MOVE */
  const onTouchMove = (e) => {
    if (!dragging.current) return;

    const currentY = e.touches[0].clientY;
    const diff = lastY.current - currentY;
    lastY.current = currentY;

    const content = contentRef.current;

    // Allow content scroll first when scrolling down
    if (content && content.scrollTop > 0 && diff < 0) return;

    let next = ratioRef.current + diff / vh;

    if (next > MAX_RATIO) next = MAX_RATIO;
    if (next < 0.25) next = 0.25;

    updateRatio(next);
  };

  /* 👆 TOUCH END */
  const onTouchEnd = () => {
    dragging.current = false;

    if (ratioRef.current < CLOSE_RATIO) {
      onClose();
    } else {
      updateRatio(DEFAULT_RATIO);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* BACKDROP (tap anywhere to close) */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* SHEET */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="
          absolute bottom-0 left-0 w-full
          bg-[#111]
          rounded-t-2xl
          flex flex-col
          will-change-transform
        "
      >
        {/* DRAG HANDLE */}
        <div className="pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-white/40" />
        </div>

        {/* TITLE */}
        <div className="text-center text-white font-semibold pb-2">
          Filter
        </div>

        {/* SCROLLABLE AREA (DIVIDER + FILTER CONTENT) */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {/* DIVIDER */}
          <div className="h-px bg-white/10 w-full" />

          {/* FILTER CONTENT */}
          <div className="px-5 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;

