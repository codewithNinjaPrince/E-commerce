import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for adding product
const addProduct = async (req, res) => {
  try {
    const {
      review,
      noOfPeopleReviewed,
      brandName,
      name,
      actualPrice,
      discountedPrice,
      offerCode,
      description,
      category,
      subCategory,
      sizes,
      bestseller,
      shopId,
      sellerId,
    } = req.body;

    // ======================== BASIC VALIDATIONS ========================

    if (
      !brandName ||
      !name ||
      !actualPrice ||
      !discountedPrice ||
      !description ||
      !category ||
      !subCategory
    ) {
      return res.json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const rating = Number(review);
    const totalPeople = Number(noOfPeopleReviewed);
    const actual = Number(actualPrice);
    const discounted = Number(discountedPrice);

    if (rating > 5)
      return res.json({
        success: false,
        message: "Review cannot exceed 5 stars",
      });
    if (rating < 0)
      return res.json({ success: false, message: "Review cannot be negative" });

    if (totalPeople > 100)
      return res.json({
        success: false,
        message: "Maximum 100 people can review",
      });

    if (actual <= 0 || discounted <= 0) {
      return res.json({
        success: false,
        message: "Prices must be greater than 0",
      });
    }

    // ======================== OFFER CODE VALIDATION ========================
    // Pattern: BrandName + number 10–80 (e.g Prince20)
    const offerRegex = /^[A-Za-z]+(1[0-9]|[2-7][0-9]|80)$/;

    // Only validate if offerCode is provided and not empty
    if (offerCode && offerCode.trim() !== "") {
      if (!offerRegex.test(offerCode)) {
        return res.json({
          success: false,
          message:
            "Offer code must be like BrandName + number between 10 and 80 (e.g. Prince20)",
        });
      }
    }

    // ======================== IMAGE HANDLING ========================

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];
    const image5 = req.files?.image5?.[0];
    const image6 = req.files?.image6?.[0];
    const image7 = req.files?.image7?.[0];
    const image8 = req.files?.image8?.[0];
    const image9 = req.files?.image9?.[0];
    const image10 = req.files?.image10?.[0];

    const images = [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9,
      image10,
    ].filter(Boolean);

    if (images.length > 10) {
      return res.json({ success: false, message: "Maximum 10 images allowed" });
    }

    // ======================== UPLOAD TO CLOUDINARY ========================

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // ======================== SIZES VALIDATION ========================

    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
      if (!Array.isArray(parsedSizes)) throw new Error();
    } catch (err) {
      return res.json({
        success: false,
        message: "Sizes must be a valid array",
      });
    }

    // ======================== FINAL PRODUCT DATA ========================

    const productData = {
      sellerId: req.merchant, // <-- REQUIRED
      shopId: req.merchantShopId || "",
      review: rating,
      noOfPeopleReviewed: totalPeople,
      brandName,
      name,
      actualPrice: actual,
      discountedPrice: discounted,
      offerCode: offerCode && offerCode.trim() !== "" ? offerCode : null,
      description,
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for listing product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct };

//This code is fine please do not touch it ending at 7:08:40
