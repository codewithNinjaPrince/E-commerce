import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    // BASIC DETAILS (Required at Registration)
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // PERSONAL KYC DETAILS
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    fatherName: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },

    // PROFILE IMAGE
    profileImage: { type: String, default: "" }, // Cloudinary URL

    // BASIC STORE SETUP (Required for Entry)
    storeName: { type: String, required: true },
    storeDescription: { type: String, default: "" },
    businessType: {
      type: String,
      enum: ["Individual", "Company", "Partnership"],
      default: "Individual",
    },

    // ADDRESS — Optional Until KYC
    address: {
      fullAddress: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" },
    },

    // KYC DETAILS (Optional Until Later)
    gstNumber: { type: String, default: null },
    panNumber: { type: String, default: null },
    aadhaarNumber: { type: String, default: null },
    documents: {
      gstFile: { type: String, default: "" },
      panFile: { type: String, default: "" },
      aadhaarFront: { type: String, default: "" },
      aadhaarBack: { type: String, default: "" },
    },

    // BANK DETAILS (Optional Until KYC)
    bank: {
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifsc: { type: String, default: "" },
      bankName: { type: String, default: "" },
      upi: { type: String, default: "" },
      passbookFile: { type: String, default: "" }, // Passbook first page
    },

    // VERIFICATION STATUS
    isVerified: { type: Boolean, default: false },

    // STORE SETTINGS
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    // ANALYTICS
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    earningsAvailable: { type: Number, default: 0 },
    earningsWithdrawn: { type: Number, default: 0 },

    // SECURITY
    lastLogin: { type: Date },
  },
  { timestamps: true, minimize: false }
);

const merchantModel =
  mongoose.models.merchant || mongoose.model("merchant", merchantSchema);

export default merchantModel;
