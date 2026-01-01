import mongoose from "mongoose";

/* ================= ITEM SCHEMA ================= */
const itemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    sellerId: { type: String, required: true },
    name: String,
    brandName: String,
    actualPrice: Number,
    discountedPrice: Number,
    price: Number,
    quantity: Number,
    size: String,
    image: [String],
    shopId: String,
    offerCode: String,
    category: String,
    subCategory: String,
    productDate: Number,
    /* 🔹 CURRENT STATUS (FAST ACCESS) */
    itemStatus: {
      type: String,
      default: "Order Placed",
    },
    /* 🔹 FULL STATUS TIMELINE (SOURCE OF TRUTH) */
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        date: {
          type: Number,
          required: true,
        },
      },
    ],

    cancelReason: {
      type: String,
      default: "",
    },
    cancelledAt: {
      type: Number,
    },
  },
  { _id: false }
);

/* ================= ORDER SCHEMA ================= */
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: {
      type: [itemSchema],
      required: true,
    },

    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    /* 🔹 OVERALL ORDER STATUS (SUMMARY) */
    status: {
      type: String,
      default: "Order Placed",
    },
    paymentMethod: { type: String, required: true },
    payment: {
      type: Boolean,
      default: false,
    },
    /* 🔹 ORDER PLACED TIME */
    date: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ================= MODEL ================= */
const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
