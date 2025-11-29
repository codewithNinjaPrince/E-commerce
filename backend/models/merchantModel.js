import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  // 1. BASIC ACCOUNT DETAILS
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 2. BUSINESS DETAILS
  storeName: { type: String, required: true },
  storeDescription: { type: String, required: true },
  businessType: { type: String, enum: ["Individual", "Company", "Partnership"], default: "Individual" },

  // 3. ADDRESS DETAILS
  address: {
    fullAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: "India" }
  },

  // 4. KYC / VERIFICATION
  gstNumber: { type: String, default: null },
  panNumber: { type: String, default: null },
  aadhaarNumber: { type: String, default: null },
  documents: {
    gstFile: { type: String },
    panFile: { type: String },
    aadhaarFront: { type: String },
    aadhaarBack: { type: String }
  },
  isVerified: { type: Boolean, default: false },

  // 5. BANK DETAILS
  bank: {
    accountName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },
    upi: { type: String }
  },

  // 6. STORE SETTINGS
  status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
  notificationSettings: {
    orderUpdates: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
    messages: { type: Boolean, default: true }
  },

  // 7. DASHBOARD ANALYTICS
  totalProducts: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  earningsAvailable: { type: Number, default: 0 },
  earningsWithdrawn: { type: Number, default: 0 },

  // 8. ACTIVITY & SECURITY
  lastLogin: { type: Date }
}, { timestamps: true, minimize: false });

const merchantModel =
  mongoose.models.merchant || mongoose.model("merchant", merchantSchema);

export default merchantModel;


