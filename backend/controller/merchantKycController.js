import merchantModel from "../models/merchantModel.js";

/**
 * Upload KYC Documents
 * Routes:
 *  POST /api/merchant/kyc
 *
 * Multer fields expected:
 *  - gstFile
 *  - panFile
 *  - aadhaarFront
 *  - aadhaarBack
 */

export const uploadKyc = async (req, res) => {
  try {
    const merchantId = req.merchant; // set by merchantAuth middleware
    const files = req.files || {};

    if (!merchantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — merchant ID missing",
      });
    }

    // Fetch merchant from DB
    const merchant = await merchantModel.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    // Debugging logs to verify properly
    console.log("KYC Upload:", {
      merchantId,
      uploadedFiles: Object.keys(files),
    });

    // -----------------------------
    // --- 1. GST FILE -------------
    // -----------------------------
    if (files.gstFile && files.gstFile[0]) {
      merchant.documents.gstFile = files.gstFile[0].path || files.gstFile[0].filename;
    }

    // -----------------------------
    // --- 2. PAN FILE -------------
    // -----------------------------
    if (files.panFile && files.panFile[0]) {
      merchant.documents.panFile = files.panFile[0].path || files.panFile[0].filename;
    }

    // -----------------------------
    // --- 3. AADHAAR FRONT --------
    // -----------------------------
    if (files.aadhaarFront && files.aadhaarFront[0]) {
      merchant.documents.aadhaarFront =
        files.aadhaarFront[0].path || files.aadhaarFront[0].filename;
    }

    // -----------------------------
    // --- 4. AADHAAR BACK ---------
    // -----------------------------
    if (files.aadhaarBack && files.aadhaarBack[0]) {
      merchant.documents.aadhaarBack =
        files.aadhaarBack[0].path || files.aadhaarBack[0].filename;
    }

    // KYC uploaded ⇒ now needs manual verification
    merchant.isVerified = false;

    await merchant.save();

    return res.json({
      success: true,
      message: "KYC documents uploaded successfully. Verification pending.",
      merchant: {
        id: merchant._id,
        isVerified: merchant.isVerified,
        documents: merchant.documents,
      },
    });
  } catch (error) {
    console.error("KYC Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload KYC documents",
    });
  }
};
