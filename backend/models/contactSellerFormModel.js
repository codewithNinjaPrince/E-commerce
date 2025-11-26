import mongoose from "mongoose";

const sellerFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shopName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("SellerForm", sellerFormSchema);
