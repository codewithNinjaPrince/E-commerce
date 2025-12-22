import { useEffect, useRef, useState } from "react";

const BottomSheet = ({ open, onClose, children }) => {
  const sheetRef = useRef(null);
  const contentRef = useRef(null);

  const startY = useRef(0);
  const lastY = useRef(0);
  const dragging = useRef(false);
  const raf = useRef(null);

  /* 📏 Instagram-style ratios */
  const DEFAULT_RATIO = 0.65;
  const MAX_RATIO = 0.8;
  const MIN_RATIO = 0.03;

  const ratioRef = useRef(DEFAULT_RATIO);
  const vh = window.innerHeight;

  /* Apply transform */
  const applyTransform = (r) => {
    if (!sheetRef.current) return;
    const y = (1 - r) * vh;
    sheetRef.current.style.transform = `translateY(${y}px)`;
  };

  /* 🔒 Lock background scroll */
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
      requestAnimationFrame(() => applyTransform(DEFAULT_RATIO));
    }
  }, [open]);

  /* RAF smooth update */
  const updateRatio = (next) => {
    ratioRef.current = next;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => applyTransform(next));
  };

  /* 👆 TOUCH START */
  const onTouchStart = (e) => {
    if (contentRef.current && contentRef.current.scrollTop > 0) {
      dragging.current = false;
      return;
    }
    dragging.current = true;
    startY.current = e.touches[0].clientY;
    lastY.current = startY.current;
  };

  /* 👆 TOUCH MOVE */
  const onTouchMove = (e) => {
    if (!dragging.current) return;

    if (contentRef.current && contentRef.current.scrollTop > 0) {
      dragging.current = false;
      return;
    }

    const currentY = e.touches[0].clientY;
    const diff = lastY.current - currentY;
    lastY.current = currentY;

    let next = ratioRef.current + diff / vh;
    if (next > MAX_RATIO) next = MAX_RATIO;
    if (next < MIN_RATIO) next = MIN_RATIO;

    updateRatio(next);
  };

  /* 👆 TOUCH END */
  const onTouchEnd = () => {
    dragging.current = false;

    if (ratioRef.current <= 0.35) {
      onClose();
      return;
    }

    updateRatio(DEFAULT_RATIO);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* SHEET */}
      <div
        ref={sheetRef}
        className="
          absolute bottom-0 left-0 w-full
h-[100dvh] max-h-[100dvh]
          bg-[#111]
          rounded-t-2xl
          flex flex-col
          will-change-transform
        "
      >
        {/* HEADER */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="pt-3 pb-2 flex flex-col items-center"
        >
          <div className="flex justify-center pb-2">
            <div className="w-10 h-1.5 rounded-full bg-white/40" />
          </div>
          <div className="text-center text-white font-semibold pb-2">
            Filter
          </div>
        </div>

        {/* CONTENT */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y"
        >
          <div className="h-px bg-white/10 w-full" />
          <div className="px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
