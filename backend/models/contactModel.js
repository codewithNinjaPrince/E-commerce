import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },

    files: [
      {
        url: String,
        public_id: String,
        originalName: String,
      },
    ],

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ContactQuery", contactSchema);
