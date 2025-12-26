import mongoose from "mongoose";

/* ================= ADDRESS SUB-SCHEMA ================= */
const addressSchema = {
  addressId: { type: String, required: true }, // nanoid / uuid
  name: { type: String, required: true }, // Person name

  phone: { type: String, required: true },
  alternatePhone: { type: String, default: "" },
  email: { type: String, default: "" },

  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  locality: { type: String, default: "" },
  landmark: { type: String, default: "" },

  city: { type: String, required: true },
  district: { type: String, default: "" },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },

  type: {
    type: String,
    enum: ["home", "work", "other"],
    default: "home",
  },

  isDefault: { type: Boolean, default: false },
};

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
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: { type: String, required: true },

    /* ---------------- VERIFICATION ---------------- */
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    emailOtp: String,
    emailOtpExpiry: Date,

    phoneOtp: String,
    phoneOtpExpiry: Date,

    /* ---------------- OLD ADDRESS (KEEP FOR NOW) ---------------- */
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    /* ---------------- NEW ADDRESS SYSTEM ---------------- */
    addresses: {
      type: [addressSchema],
      default: [],
    },

    selectedAddressId: {
      type: String,
      default: "",
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

    usedCoupons: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     /* ---------------- BASIC INFO ---------------- */
//     firstName: { type: String, required: true, trim: true },
//     lastName: { type: String, required: true, trim: true },

//     /* ---------------- LOGIN IDENTIFIERS ---------------- */
//     email: {
//       type: String,
//       lowercase: true,
//       trim: true,
//       unique: true,
//       sparse: true, 
//     },

//     phone: {
//       type: String,
//       unique: true,
//       sparse: true, // ✅ allows email-only users
//     },

//     password: { type: String, required: true },

//     /* ---------------- VERIFICATION ---------------- */
//     isEmailVerified: { type: Boolean, default: false },
//     isPhoneVerified: { type: Boolean, default: false },

//     emailOtp: { type: String },
//     emailOtpExpiry: { type: Date },

//     phoneOtp: { type: String },
//     phoneOtpExpiry: { type: Date },

//     /* ---------------- ADDRESS ---------------- */
//     address: {
//       street: { type: String, default: "" },
//       city: { type: String, default: "" },
//       state: { type: String, default: "" },
//       country: { type: String, default: "" },
//       pincode: { type: String, default: "" },
//     },

//     /* ---------------- CART ---------------- */
//     cartData: {
//       type: Map,
//       of: Map,
//       default: {},
//     },
    
//     favorites: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//     ],
//     usedCoupons: {
//   type: [String], // ["PRINCE20", "SAVE10"]
//   default: [],
// },


//   },
//   { timestamps: true }
// );

// export default mongoose.models.User || mongoose.model("User", userSchema);
