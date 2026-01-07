import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    // BASIC DETAILS
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // PERSONAL DETAILS
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    fatherName: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },

    // PROFILE
    profileImage: { type: String, default: "" },

    // STORE
    storeName: { type: String, required: true },
    storeDescription: { type: String, default: "" },
    businessType: {
      type: String,
      enum: ["Individual", "Company", "Partnership"],
      default: "Individual",
    },

    // 📦 PICKUP ADDRESS (LOGISTICS READY)
    address: {
      contactName: { type: String, trim: true, default: "" },
      contactPhone: { type: String, trim: true, default: "" },

      line1: { type: String, trim: true, default: "" },
      line2: { type: String, trim: true, default: "" },
      landmark: { type: String, trim: true, default: "" },

      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      pincode: { type: String, trim: true, default: "" },
      country: { type: String, default: "India" },
    },

    // 🚚 SHIPROCKET
    shiprocket: {
      pickupLocationId: { type: String, default: "" },
      pickupCode: { type: String, default: "" },
      syncedAt: { type: Date },
    },

    // KYC
    gstNumber: { type: String, default: null },
    panNumber: { type: String, default: null },
    aadhaarNumber: { type: String, default: null },
    documents: {
      gstFile: { type: String, default: "" },
      panFile: { type: String, default: "" },
      aadhaarFront: { type: String, default: "" },
      aadhaarBack: { type: String, default: "" },
    },

    // BANK
    bank: {
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifsc: { type: String, default: "" },
      bankName: { type: String, default: "" },
      upi: { type: String, default: "" },
      passbookFile: { type: String, default: "" },
    },

    // STATUS
    isVerified: { type: Boolean, default: false },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

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

export default mongoose.models.merchant ||
  mongoose.model("merchant", merchantSchema);
