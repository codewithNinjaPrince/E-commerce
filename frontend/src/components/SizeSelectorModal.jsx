import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

/* ================= EMOTIONAL NUDGES ================= */

const emotionalNudges = [
  "Itna door aa hi gaye ho… size bhi choose kar lo 😄",
  "Bas ek chhota sa choice… baaki sab hum sambhaal lenge 🙂",
  "Size select kar lo… product bhi ready hai tumhare liye 😉",
  "Perfect fit mil gaya toh dil khush ho jaata hai ❤️",
  "Thoda sa soch lo… ye wala size tumpe achha lagega 😌",
  "Bas yahin pe decision lena tha… aage hum hain 🫶",
];

const getEmotionalLine = () =>
  emotionalNudges[Math.floor(Math.random() * emotionalNudges.length)];

/* ================= MAIN MODAL ================= */

const SizeSelectorModal = ({ open, onClose, sizes = [], onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [nudge, setNudge] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedSize("");
      setNudge(getEmotionalLine());
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/60"
      onClick={onClose}
    >
      {/* ================= MOBILE / TABLET ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          sm:hidden
          fixed bottom-0 left-0 w-full
          h-[55vh]
          bg-[#0d0d0d]
          rounded-t-3xl
          border-t border-white/10
          p-5
          flex flex-col
          animate-bottomSheet
        "
      >
        <ModalHeader onClose={onClose} />

        {/* subtle divider */}
        <div className="mt-3 h-px w-12 mx-auto bg-white/10 rounded-full" />

        {/* sizes */}
        <div className="mt-6 flex-1 grid grid-cols-4 gap-3 place-content-start">
          {sizes.map((size) => (
            <SizeButton
              key={size}
              size={size}
              selected={selectedSize === size}
              onClick={() => setSelectedSize(size)}
            />
          ))}
        </div>

        {/* emotional nudge */}
        <div className="mt-6 mb-6 mx-auto max-w-[85%] text-center">
          <p className="text-xm text-gray-400 italic leading-relaxed">
            {nudge}
          </p>
        </div>

        {/* action */}
        <ConfirmButton
          disabled={!selectedSize}
          onClick={() => onConfirm(selectedSize)}
        />
      </div>

      {/* ================= DESKTOP ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          hidden sm:flex
          fixed left-0 top-[20vh]
          h-[60vh]
          w-[20vw] min-w-[260px]
          bg-[#0d0d0d]
          border-r border-white/10
          rounded-r-3xl
          p-6
          flex-col
          animate-leftPanel
        "
      >
        <ModalHeader onClose={onClose} />

        {/* divider */}
        <div className="mt-3 h-px w-12 bg-white/10 rounded-full" />

        {/* sizes */}
        <div className="mt-6 flex-1 grid grid-cols-2 gap-3 place-content-center">
          {sizes.map((size) => (
            <SizeButton
              key={size}
              size={size}
              selected={selectedSize === size}
              onClick={() => setSelectedSize(size)}
            />
          ))}
        </div>

        {/* emotional nudge */}
        <div className="mt-4 mb-4 text-center">
          <p className="text-xm text-gray-400 italic leading-relaxed">
            {nudge}
          </p>
        </div>

        {/* action */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <ConfirmButton
            disabled={!selectedSize}
            onClick={() => onConfirm(selectedSize)}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ================= SUB COMPONENTS ================= */

const ModalHeader = ({ onClose }) => (
  <div className="flex items-center justify-between">
    <h3 className="text-white text-lg font-semibold">
      Choose your size
    </h3>
    <button
      onClick={onClose}
      className="
        w-9 h-9
        flex items-center justify-center
        rounded-full
        bg-white/10 hover:bg-white/20
        transition cursor-pointer
      "
    >
      <FaTimes className="text-white text-sm" />
    </button>
  </div>
);

const SizeButton = ({ size, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      py-3 rounded-xl font-semibold
      border transition-all cursor-pointer
      ${
        selected
          ? "bg-white text-black border-white scale-[1.04]"
          : "border-white/20 text-white hover:bg-white/10"
      }
    `}
  >
    {size}
  </button>
);

const ConfirmButton = ({ disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`
      mt-8 w-full py-3 rounded-xl font-semibold
      shadow-[0_-6px_20px_rgba(0,0,0,0.4)]
      transition
      ${
        disabled
          ? "bg-white/30 text-black/60 cursor-not-allowed"
          : "bg-white text-black hover:bg-gray-200 cursor-pointer"
      }
    `}
  >
    Continue
  </button>
);

export default SizeSelectorModal;

