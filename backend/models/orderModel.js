import mongoose from 'mongoose'

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

    productDate: Number,

    itemStatus: {
      type: String,
      default: "Order Placed",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [itemSchema],     // <-- FIXED
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, default: false },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

const orderModel=mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;