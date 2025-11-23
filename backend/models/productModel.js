//This is good for work and will work properly 
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    brandName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    actualPrice: { type: Number, required: true, min: 1 },
    discountedPrice: { type: Number, required: true, min: 1 },
    offerCode: { type: String, required: false, default: "" },
    review: { type: Number, default: 0, min: 0, max: 5 },
    noOfPeopleReviewed: { type: Number, default: 0, max: 100 },
    image: {type: [String],   // only URLs
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "Maximum 10 images allowed",
      },
    },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: {type: [String],required: true},
    bestseller: { type: Boolean, default: false },
    date: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
