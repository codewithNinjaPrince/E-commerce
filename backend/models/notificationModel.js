import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  merchantId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Number, default: Date.now },
}, { timestamps: true });

const notificationModel =
  mongoose.models.notification || mongoose.model("notification", notificationSchema);

export default notificationModel;
