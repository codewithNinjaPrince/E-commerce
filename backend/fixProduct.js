import mongoose from "mongoose";
import Product from "./models/productModel.js"; // correct path
import dotenv from "dotenv";

dotenv.config();

async function fixProducts() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");

  const products = await Product.find();

  for (let p of products) {
    const updated = {
      brandName: p.brandName || "No Brand",
      actualPrice: p.actualPrice || p.price || 0,
      discountedPrice: p.discountedPrice || p.price || 0,
      offerCode: p.offerCode || "",
      review: p.review || 4.2,
      noOfPeopleReviewed: p.noOfPeopleReviewed || 0,
    };

    await Product.findByIdAndUpdate(p._id, updated);
  }

  console.log("All products updated to new schema ✓");
  process.exit();
}

fixProducts();
