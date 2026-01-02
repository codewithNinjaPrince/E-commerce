import mongoose from "mongoose";
import merchantModel from "../models/merchantModel.js";
import { generateMerchantSlug } from "../utils/generateSlug.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ LOAD ENV
dotenv.config({ path: path.join(__dirname, "../.env") });

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // 🔍 FIND MERCHANTS WITHOUT SLUG
    const merchants = await merchantModel.find({
      $or: [{ slug: { $exists: false } }, { slug: "" }],
    });

    console.log(`🔍 Found ${merchants.length} merchants without slug`);

    for (const merchant of merchants) {
      const city = merchant.address?.city || "";
      const slug = generateMerchantSlug(merchant.storeName, city);

      merchant.slug = slug;
      await merchant.save();

      console.log(`✔ ${merchant.storeName} → ${slug}`);
    }

    console.log("🎉 Slug migration completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
};

run();
