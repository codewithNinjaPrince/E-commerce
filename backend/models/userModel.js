// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String, default: "" },

//     password: { type: String, required: true },

//     address: {
//       street: { type: String, default: "" },
//       city: { type: String, default: "" },
//       state: { type: String, default: "" },
//       country: { type: String, default: "" },
//       pincode: { type: String, default: "" },
//     },

//     cartData: { type: Object, default: {} },
//   },
//   { minimize: false }
// );

// const userModel = mongoose.models.user || mongoose.model('user', userSchema);
// export default userSchema

//THis is also fine and working properly till here timing of video si 5:50
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },

    password: { type: String, required: true },

    // 🔐 Email verification
    isEmailVerified: { type: Boolean, default: false },
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    cartData: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);