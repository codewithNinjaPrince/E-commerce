import { useEffect, useRef, useState } from "react";

const BottomSheet = ({ open, onClose, children }) => {
  const contentRef = useRef(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const [translateY, setTranslateY] = useState(0);

  const MIN_Y = 0;       // fully open
  const MAX_Y = 300;     // close threshold distance

  /* 🌍 GLOBAL SCROLL → MOVE SHEET */
  const handleGlobalScroll = (e) => {
    if (isDragging.current) return;

    e.preventDefault();

    const delta =
      e.deltaY ||
      (e.touches && startY.current - e.touches[0].clientY) ||
      0;

    setTranslateY((prev) => {
      // ✅ FIXED DIRECTION (natural)
      let next = prev - delta * 0.6;

      if (next < MIN_Y) next = MIN_Y;
      if (next > MAX_Y) next = MAX_Y;

      return next;
    });
  };

  /* 🔒 LOCK BACKGROUND COMPLETELY */
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    window.addEventListener("wheel", handleGlobalScroll, { passive: false });
    window.addEventListener("touchmove", handleGlobalScroll, {
      passive: false,
    });

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";

      window.removeEventListener("wheel", handleGlobalScroll);
      window.removeEventListener("touchmove", handleGlobalScroll);
    };
  }, [open]);

  /* RESET ON OPEN */
  useEffect(() => {
    if (open) setTranslateY(0);
  }, [open]);

  /* 👆 TOUCH START (ANYWHERE ON SCREEN) */
  const onTouchStart = (e) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  /* 👆 TOUCH MOVE */
  const onTouchMove = (e) => {
    if (!isDragging.current) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    const content = contentRef.current;

    // Allow content scroll first
    if (content && content.scrollTop > 0 && diff > 0) return;

    if (diff >= 0) {
      setTranslateY(diff);
    }
  };

  /* 👆 TOUCH END */
  const onTouchEnd = () => {
    isDragging.current = false;

    if (translateY > MAX_Y * 0.6) {
      onClose();
    } else {
      setTranslateY(MIN_Y);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* BACKDROP (DRAGGABLE, NOT CLICK-CLOSE) */}
      <div className="absolute inset-0 bg-black/70" />

      {/* SHEET */}
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: "transform",
        }}
        className="
          absolute bottom-0 left-0 w-full
          h-[50vh]
          bg-[#111]
          rounded-t-2xl
          transition-transform duration-200 ease-out
          flex flex-col
          touch-pan-y
        "
      >
        {/* DRAG HANDLE (VISUAL ONLY) */}
        <div className="py-3 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-white/30" />
        </div>

        {/* CONTENT (ONLY THIS SCROLLS) */}
        <div
          ref={contentRef}
          className="
            flex-1 overflow-y-auto px-5 pb-6
            overscroll-contain
            touch-pan-y
          "
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
