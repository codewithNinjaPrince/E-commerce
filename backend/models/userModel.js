import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    /* ---------------- LOGIN IDENTIFIERS ---------------- */
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, // ✅ allows phone-only users
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows email-only users
    },

    password: { type: String, required: true },

    /* ---------------- VERIFICATION ---------------- */
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },

    phoneOtp: { type: String },
    phoneOtpExpiry: { type: Date },

    /* ---------------- ADDRESS ---------------- */
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    /* ---------------- CART ---------------- */
    cartData: {
      type: Map,
      of: Map,
      default: {},
    },
    
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
