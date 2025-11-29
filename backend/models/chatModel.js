import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    merchantId: { type: String, required: true },
    sender: { type: String, enum: ["merchant", "admin"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const chatModel =
  mongoose.models.chat || mongoose.model("chat", chatSchema);

export default chatModel;
