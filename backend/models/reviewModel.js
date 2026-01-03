import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, trim: true },
    reviewText: { type: String, required: true, minlength: 20 },

    images: [{ type: String }],

    verifiedPurchase: { type: Boolean, default: true },

    merchantReply: {
      message: String,
      repliedAt: Date,
    },

    helpfulCount: { type: Number, default: 0 },
    reportedCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "hidden", "blocked"],
      default: "active",
    },

    editableUntil: Date,
  },
  { timestamps: true }
);

// 🚫 one review per product per order per user
reviewSchema.index({ productId: 1, orderId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
