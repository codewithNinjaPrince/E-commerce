import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("ContactForm", contactFormSchema);
