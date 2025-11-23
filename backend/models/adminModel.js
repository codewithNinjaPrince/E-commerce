import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  shopName: { type: String, required: true },

  // Login Details
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Role: you = superadmin, shops = seller
  role: { type: String, enum: ["superadmin", "seller"], default: "seller" },

  // Every seller owns a shop via this ID
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },

  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
