import merchantModel from "../models/merchantModel.js";
//Merchant Kyc related thing starts from here
import { v2 as cloudinary } from "cloudinary";
import { syncMerchantPickup } from "../services/syncMerchantPickup.js";

// ---------------- SLUG HELPERS ----------------
const normalize = (str = "") =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const generateMerchantSlug = async ({ storeName, city, phone }) => {
  const base = `${normalize(storeName)}-${normalize(city)}-${phone.slice(-4)}`;

  let slug = base;
  let counter = 1;

  while (await merchantModel.exists({ slug })) {
    slug = `${base}-${counter++}`;
  }

  return slug;
};

// UPLOAD helper
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(file.buffer);
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

    const merchant = await merchantModel.findById(merchantId);
    if (!merchant)
      return res.status(404).json({ success: false, message: "Merchant not found" });

    // ensure objects exist
    merchant.address = merchant.address || {};
    merchant.bank = merchant.bank || {};
    merchant.documents = merchant.documents || {};

    const {
      firstName,
      lastName,
      fatherName,
      dateOfBirth,
      gender,

      contactName,
      contactPhone,
      line1,
      line2,
      landmark,
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

    // ---------------- REQUIRED FIELD VALIDATION ----------------
    if (
      !firstName ||
      !lastName ||
      !contactName ||
      !contactPhone ||
      !line1 ||
      !city ||
      !state ||
      !pincode ||
      !aadhaarNumber ||
      !panNumber ||
      !accountName ||
      !accountNumber ||
      !ifsc ||
      !bankName
    ) {
      return res.status(400).json({
        success: false,
        message: "All mandatory KYC fields must be provided.",
      });
    }

    // ---------------- REQUIRED FILE VALIDATION ----------------
    const hasAadhaar =
      merchant.documents.aadhaarFront && merchant.documents.aadhaarBack;
    const hasPan = merchant.documents.panFile;
    const hasPassbook = merchant.bank.passbookFile;
    const hasProfile = merchant.profileImage;

    if (
      (!files.aadhaarFront && !hasAadhaar) ||
      (!files.aadhaarBack && !hasAadhaar) ||
      (!files.panFile && !hasPan) ||
      (!files.passbookFile && !hasPassbook) ||
      (!files.profileImage && !hasProfile)
    ) {
      return res.status(400).json({
        success: false,
        message: "All mandatory KYC documents must be uploaded.",
      });
    }

    if (gstNumber && !files.gstFile && !merchant.documents.gstFile) {
      return res.status(400).json({
        success: false,
        message: "GST certificate is required when GST number is provided.",
      });
    }

    // ---------------- SAVE TEXT DATA ----------------
    Object.assign(merchant, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fatherName: fatherName || "",
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      aadhaarNumber: aadhaarNumber.trim(),
      panNumber: panNumber.trim(),
      gstNumber: gstNumber || null,
    });

    merchant.address = {
      contactName,
      contactPhone,
      line1,
      line2: line2 || "",
      landmark: landmark || "",
      city,
      state,
      pincode,
      country: country || "India",
    };

    merchant.bank = {
      ...merchant.bank,
      accountName,
      accountNumber,
      ifsc,
      bankName,
      upi: upi || "",
    };

    // ---------------- UPLOAD FILES ----------------
    if (files.aadhaarFront?.[0])
      merchant.documents.aadhaarFront = await uploadToCloudinary(files.aadhaarFront[0], "merchant_kyc");

    if (files.aadhaarBack?.[0])
      merchant.documents.aadhaarBack = await uploadToCloudinary(files.aadhaarBack[0], "merchant_kyc");

    if (files.panFile?.[0])
      merchant.documents.panFile = await uploadToCloudinary(files.panFile[0], "merchant_kyc");

    if (files.gstFile?.[0])
      merchant.documents.gstFile = await uploadToCloudinary(files.gstFile[0], "merchant_kyc");

    if (files.passbookFile?.[0])
      merchant.bank.passbookFile = await uploadToCloudinary(files.passbookFile[0], "merchant_kyc");

    if (files.profileImage?.[0])
      merchant.profileImage = await uploadToCloudinary(files.profileImage[0], "merchant_kyc");

    // ---------------- SLUG ----------------
    if (!merchant.slug) {
      merchant.slug = await generateMerchantSlug({
        storeName: merchant.storeName,
        city,
        phone: merchant.phone,
      });
    }

    merchant.isVerified = false;
    await merchant.save();
    syncMerchantPickup(merchant).catch(err =>
  console.error("SHIPROCKET BACKGROUND ERROR:", err.message)
);


    res.json({ success: true, message: "KYC submitted successfully." });
  } catch (err) {
    console.error("SUBMIT KYC ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// --------------------------------------------------
// UPDATE KYC (Fixed with Cloudinary for ALL files)
// --------------------------------------------------
const updateKyc = async (req, res) => {
  try {
    const merchantId = req.merchant;
    const files = req.files || {};

    const merchant = await merchantModel.findById(merchantId);
    if (!merchant)
      return res.status(404).json({ success: false, message: "Merchant not found" });

    merchant.address ||= {};
    merchant.bank ||= {};
    merchant.documents ||= {};

    const updates = req.body;

    const textFields = [
      "firstName","lastName","fatherName","dateOfBirth","gender",
      "aadhaarNumber","panNumber","gstNumber",
    ];
    textFields.forEach(f => updates[f] !== undefined && (merchant[f] = updates[f]));

    // Address
    const addrFields = [
      "contactName","contactPhone","line1","line2",
      "landmark","city","state","pincode","country"
    ];
    addrFields.forEach(f => {
      if (updates[f] !== undefined) merchant.address[f] = updates[f];
    });

    // Bank
    const bankFields = ["accountName","accountNumber","ifsc","bankName","upi"];
    bankFields.forEach(f => {
      if (updates[f] !== undefined) merchant.bank[f] = updates[f];
    });

    // Files
    if (files.aadhaarFront?.[0])
      merchant.documents.aadhaarFront = await uploadToCloudinary(files.aadhaarFront[0], "merchant_kyc");

    if (files.aadhaarBack?.[0])
      merchant.documents.aadhaarBack = await uploadToCloudinary(files.aadhaarBack[0], "merchant_kyc");

    if (files.panFile?.[0])
      merchant.documents.panFile = await uploadToCloudinary(files.panFile[0], "merchant_kyc");

    if (files.gstFile?.[0])
      merchant.documents.gstFile = await uploadToCloudinary(files.gstFile[0], "merchant_kyc");

    if (files.passbookFile?.[0])
      merchant.bank.passbookFile = await uploadToCloudinary(files.passbookFile[0], "merchant_kyc");

    if (files.profileImage?.[0])
      merchant.profileImage = await uploadToCloudinary(files.profileImage[0], "merchant_kyc");

    // Ensure slug
    if (!merchant.slug) {
      merchant.slug = await generateMerchantSlug({
        storeName: merchant.storeName,
        city: merchant.address.city || "india",
        phone: merchant.phone,
      });
    }

    merchant.isVerified = false;

    await merchant.save();

    

  const shouldSync =
  !merchant.shiprocket?.pickupLocationId ||
  ["contactName","contactPhone","line1","city","state","pincode"]
    .some(f => updates?.[f] !== undefined);

if (shouldSync) {
  syncMerchantPickup(merchant).catch(err =>
    console.error("SHIPROCKET SYNC ERROR:", err.message)
  );
}




    res.json({ success: true, message: "KYC updated successfully.", merchant });
  } catch (err) {
    console.error("UPDATE KYC ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
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
      merchant[path[0]][path[1]] = null;
    } else {
      merchant[validDocs[docType]] = null;
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
