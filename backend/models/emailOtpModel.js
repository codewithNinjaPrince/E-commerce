import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.EmailOtp ||
  mongoose.model("EmailOtp", emailOtpSchema);
