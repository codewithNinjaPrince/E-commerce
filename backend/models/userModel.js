//THis is also fine and working properly till here timing of video si 5:50
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },

//     email: { type: String, required: true, unique: true },
//     phone: { type: String, default: "" },

//     password: { type: String, required: true },

//     // 🔐 Email verification
//     isEmailVerified: { type: Boolean, default: false },
//     emailOtp: { type: String },
//     emailOtpExpiry: { type: Date },

//     address: {
//       street: { type: String, default: "" },
//       city: { type: String, default: "" },
//       state: { type: String, default: "" },
//       country: { type: String, default: "" },
//       pincode: { type: String, default: "" },
//     },

//     cartData: { type: Object, default: {} },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User || mongoose.model("User", userSchema);
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
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
