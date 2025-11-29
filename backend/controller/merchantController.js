import merchantModel from "../models/merchantModel.js";
import productModel from "../models/productModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// --------------------------------------------------
// REGISTER MERCHANT
// --------------------------------------------------
export const registerMerchant = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      storeName,
      storeDescription,
      businessType,
      address,
    } = req.body;

    const exists = await merchantModel.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email or Phone already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMerchant = new merchantModel({
      name,
      email,
      phone,
      password: hashedPassword,
      storeName,
      storeDescription,
      businessType: businessType || "Individual",
      address: address || {},
    });

    await newMerchant.save();

    res.json({ success: true, message: "Merchant registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// LOGIN MERCHANT
// --------------------------------------------------
export const loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const merchant = await merchantModel.findOne({ email });
    if (!merchant)
      return res
        .status(400)
        .json({ success: false, message: "Merchant not found" });

    if (merchant.status === "banned")
      return res
        .status(403)
        .json({ success: false, message: "Your account is banned." });

    if (merchant.status === "inactive")
      return res
        .status(403)
        .json({ success: false, message: "Your account is inactive." });

    const match = await bcrypt.compare(password, merchant.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    merchant.lastLogin = Date.now();
    await merchant.save();

    res.json({
      success: true,
      token,
      merchant: {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email,
        storeName: merchant.storeName,
        isVerified: merchant.isVerified,
        status: merchant.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// GET MERCHANT PROFILE
// --------------------------------------------------
export const getMerchantProfile = async (req, res) => {
  try {
    const merchant = await merchantModel
      .findById(req.merchant)
      .select("-password");
    if (!merchant)
      return res
        .status(404)
        .json({ success: false, message: "Merchant not found" });

    res.json({ success: true, merchant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// ADD MERCHANT PRODUCT  (CLOUDINARY WORKING VERSION)
// --------------------------------------------------
export const addMerchantProduct = async (req, res) => {
  try {
    const sellerId = req.merchant;

    if (!req.files || req.files.length === 0) {
      return res.json({
        success: false,
        message: "At least 1 image is required",
      });
    }

    const uploadedImages = [];

    for (let file of req.files) {
      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "merchant_products",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(file.buffer);
      });

      uploadedImages.push(uploaded.secure_url);
    }

    const product = new productModel({
      sellerId,
      shopId: req.body.shopId || "",
      name: req.body.name,
      brandName: req.body.brandName,
      description: req.body.description,
      actualPrice: Number(req.body.actualPrice),
      discountedPrice: Number(req.body.discountedPrice),
      offerCode: req.body.offerCode || "",
      category: req.body.category,
      subCategory: req.body.subCategory,
      review: Number(req.body.review) || 0,
      noOfPeopleReviewed: Number(req.body.noOfPeopleReviewed) || 0,
      sizes: JSON.parse(req.body.sizes || "[]"),
      bestseller: req.body.bestseller === "true",
      image: uploadedImages,
      date: Date.now(), // ⭐ FIXED
    });

    await product.save();

    return res.json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// LIST MERCHANT PRODUCTS
// --------------------------------------------------
export const listMerchantProducts = async (req, res) => {
  try {
    const sellerId = req.merchant;

    const products = await productModel
      .find({ sellerId })
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// DELETE PRODUCT
// --------------------------------------------------
export const removeMerchantProduct = async (req, res) => {
  try {
    const sellerId = req.merchant;
    const { productId } = req.body;

    await productModel.findOneAndDelete({ _id: productId, sellerId });

    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --------------------------------------------------
// UPDATE PRODUCT
// --------------------------------------------------
export const updateMerchantProduct = async (req, res) => {
  try {
    const sellerId = req.merchant;
    const {
      productId,
      brandName,
      name,
      description,
      actualPrice,
      discountedPrice,
      offerCode,
      category,
      subCategory,
      sizes,
      bestseller,
      existingImages,
      review,
      noOfPeopleReviewed
    } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is missing" });
    }

    // Parse existing images (old cloudinary URLs)
    let oldImages = [];
    try {
      oldImages = JSON.parse(existingImages || "[]");
      if (!Array.isArray(oldImages)) oldImages = [];
    } catch {
      oldImages = [];
    }

    // Upload new images
    const newImages = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "merchant_products",
                resource_type: "image",
                transformation: [{ quality: "auto" }],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(file.buffer);
        });

        newImages.push(uploaded.secure_url);
      }
    }

    const finalImages = [...oldImages, ...newImages];

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, sellerId },
      {
        brandName,
        name,
        description,
        actualPrice,
        discountedPrice,
        offerCode,
        review,
        noOfPeopleReviewed,
        category,
        subCategory,
        sizes: sizes ? JSON.parse(sizes) : [],
        bestseller: bestseller === "true",
        image: finalImages,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};


//For merchant profile update
export const updateMerchantProfile = async (req, res) => {
  try {
    const merchantId = req.merchant;

    const { name, phone, email, storeName, storeDescription, address } =
      req.body;

    const updatedMerchant = await merchantModel.findByIdAndUpdate(
      merchantId,
      {
        name,
        phone,
        email,
        storeName,
        storeDescription,
        address: {
          fullAddress: address, // <-- The ONLY valid key
        },
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      merchant: updatedMerchant,
    });
  } catch (error) {
    console.log("PROFILE UPDATE ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};

export const updateMerchantPassword = async (req, res) => {

  try {
    const merchantId = req.merchantId;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.json({
        success: false,
        message: "Both old and new passwords are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const merchant = await merchantModel.findById(merchantId);
    if (!merchant) {
      return res.json({ success: false, message: "Merchant not found." });
    }

    // verify old password
    const isMatch = await bcrypt.compare(oldPassword, merchant.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect old password.",
      });
    }

    // check if same password
    const isSamePassword = await bcrypt.compare(newPassword, merchant.password);
    if (isSamePassword) {
      return res.json({
        success: false,
        message: "New password cannot be the same as old password.",
      });
    }

    // hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    merchant.password = hashed;

    await merchant.save();

    return res.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log("PASSWORD UPDATE ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};

