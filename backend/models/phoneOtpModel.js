import mongoose from "mongoose";

const phoneOtpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.PhoneOtp ||
  mongoose.model("PhoneOtp", phoneOtpSchema);
