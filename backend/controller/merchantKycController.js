import merchantModel from "../models/merchantModel.js";
//Merchant Kyc related thing starts from here
import { v2 as cloudinary } from "cloudinary";

// UPLOAD helper
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    ).end(file.buffer);
  });
};

/**
 * FULL KYC SUBMISSION CONTROLLER
 * POST /api/merchant/kyc
 * Requires: personal info + bank info + document uploads
 */

// --------------------------------------------------
// SUBMIT FULL KYC
// --------------------------------------------------
const submitKyc = async (req, res) => {
  try {
    const merchantId = req.merchant;
    const files = req.files || {};

    if (!merchantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — merchant ID missing",
      });
    }

    const merchant = await merchantModel.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const {
      firstName,
      lastName,
      fatherName,
      dateOfBirth,
      gender,
      fullAddress,
      city,
      state,
      pincode,
      country,
      aadhaarNumber,
      panNumber,
      gstNumber,
      accountName,
      accountNumber,
      ifsc,
      bankName,
      upi,
    } = req.body;

    // REQUIRED CHECK
    if (!firstName || !lastName || !aadhaarNumber || !panNumber) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    // PERSONAL DETAILS
    merchant.firstName = firstName;
    merchant.lastName = lastName;
    merchant.fatherName = fatherName || "";
    merchant.dateOfBirth = dateOfBirth || "";
    merchant.gender = gender || "";

    // ADDRESS
    merchant.address = {
      fullAddress,
      city,
      state,
      pincode,
      country: country || "India",
    };

    // KYC IDs
    merchant.aadhaarNumber = aadhaarNumber;
    merchant.panNumber = panNumber;
    merchant.gstNumber = gstNumber || null;

    // BANK DETAILS
    merchant.bank.accountName = accountName || "";
    merchant.bank.accountNumber = accountNumber || "";
    merchant.bank.ifsc = ifsc || "";
    merchant.bank.bankName = bankName || "";
    merchant.bank.upi = upi || "";

    // FILE UPLOADS
    // CLOUDINARY UPLOADS
    if (files.aadhaarFront?.[0])
      merchant.documents.aadhaarFront = await uploadToCloudinary(
        files.aadhaarFront[0],
        "merchant_kyc"
      );

    if (files.aadhaarBack?.[0])
      merchant.documents.aadhaarBack = await uploadToCloudinary(
        files.aadhaarBack[0],
        "merchant_kyc"
      );

    if (files.panFile?.[0])
      merchant.documents.panFile = await uploadToCloudinary(
        files.panFile[0],
        "merchant_kyc"
      );

    if (files.gstFile?.[0])
      merchant.documents.gstFile = await uploadToCloudinary(
        files.gstFile[0],
        "merchant_kyc"
      );

    if (files.passbookFile?.[0])
      merchant.bank.passbookFile = await uploadToCloudinary(
        files.passbookFile[0],
        "merchant_kyc"
      );

    if (files.profileImage?.[0])
      merchant.profileImage = await uploadToCloudinary(
        files.profileImage[0],
        "merchant_kyc"
      );

    // Mark as pending verification
    merchant.isVerified = false;

    await merchant.save();

    return res.json({
      success: true,
      message: "KYC submitted successfully.",
    });
  } catch (error) {
    console.log("SUBMIT KYC ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "KYC submission failed",
    });
  }
};

// --------------------------------------------------
// UPDATE KYC
// --------------------------------------------------
// --------------------------------------------------
// UPDATE KYC (Fixed with Cloudinary for ALL files)
// --------------------------------------------------
const updateKyc = async (req, res) => {
  try {
    const merchantId = req.merchant;
    const files = req.files || {};

    const merchant = await merchantModel.findById(merchantId);
    if (!merchant)
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });

    const updates = req.body;

    // BASIC TEXT UPDATES
    const fields = [
      "firstName",
      "lastName",
      "fatherName",
      "dateOfBirth",
      "gender",
      "aadhaarNumber",
      "panNumber",
      "gstNumber",
    ];

    fields.forEach((field) => {
      if (updates[field] !== undefined) merchant[field] = updates[field];
    });

    // ADDRESS UPDATES
    const addr = ["fullAddress", "city", "state", "pincode", "country"];
    addr.forEach((key) => {
      if (updates[key] !== undefined) merchant.address[key] = updates[key];
    });

    // BANK UPDATES
    const bankFields = [
      "accountName",
      "accountNumber",
      "ifsc",
      "bankName",
      "upi",
    ];
    bankFields.forEach((f) => {
      if (updates[f] !== undefined) merchant.bank[f] = updates[f];
    });

    // -------- CLOUDINARY UPLOADS (ALL 6 FILES) --------
    if (files.aadhaarFront?.[0])
      merchant.documents.aadhaarFront = await uploadToCloudinary(
        files.aadhaarFront[0],
        "merchant_kyc"
      );

    if (files.aadhaarBack?.[0])
      merchant.documents.aadhaarBack = await uploadToCloudinary(
        files.aadhaarBack[0],
        "merchant_kyc"
      );

    if (files.panFile?.[0])
      merchant.documents.panFile = await uploadToCloudinary(
        files.panFile[0],
        "merchant_kyc"
      );

    if (files.gstFile?.[0])
      merchant.documents.gstFile = await uploadToCloudinary(
        files.gstFile[0],
        "merchant_kyc"
      );

    if (files.passbookFile?.[0])
      merchant.bank.passbookFile = await uploadToCloudinary(
        files.passbookFile[0],
        "merchant_kyc"
      );

    // ⭐ YOU FORGOT THIS EARLIER
    if (files.profileImage?.[0])
      merchant.profileImage = await uploadToCloudinary(
        files.profileImage[0],
        "merchant_kyc"
      );

    merchant.isVerified = false; // re-verification

    await merchant.save();

    return res.json({
      success: true,
      message: "KYC updated successfully.",
      merchant,
    });
  } catch (err) {
    console.log("UPDATE KYC ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "KYC update failed",
    });
  }
};

// --------------------------------------------------
// DELETE SPECIFIC KYC DOCUMENT
// --------------------------------------------------
const deleteKycDocument = async (req, res) => {
  try {
    const merchantId = req.merchant;
    const { docType } = req.params;

    const merchant = await merchantModel.findById(merchantId);
    if (!merchant)
      return res
        .status(404)
        .json({ success: false, message: "Merchant not found" });

    const validDocs = {
      aadhaarFront: "documents.aadhaarFront",
      aadhaarBack: "documents.aadhaarBack",
      panFile: "documents.panFile",
      gstFile: "documents.gstFile",
      passbookFile: "bank.passbookFile",
      profileImage: "profileImage",
    };

    if (!validDocs[docType]) {
      return res.status(400).json({
        success: false,
        message: "Invalid document type",
      });
    }

    // Clear the field
    const path = validDocs[docType].split(".");
    if (path.length === 2) {
      merchant[path[0]][path[1]] = "";
    } else {
      merchant[validDocs[docType]] = "";
    }

    merchant.isVerified = false;

    await merchant.save();

    return res.json({
      success: true,
      message: `${docType} deleted successfully.`,
    });
  } catch (err) {
    console.log("DELETE KYC DOCUMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete document",
    });
  }
};
export { updateKyc, submitKyc, deleteKycDocument };
