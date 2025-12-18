import chatModel from "../models/chatModel.js";
import merchantModel from "../models/merchantModel.js";
import { v2 as cloudinary } from "cloudinary";
import ContactQuery from "../models/contactModel.js";


/* ==============================================================
   SEND MESSAGE (MERCHANT → ADMIN)
============================================================== */
export const sendMerchantMessage = async (req, res) => {
  try {
    const merchantId = req.merchant;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.json({ success: false, message: "Message cannot be empty" });
    }

    await chatModel.create({
      merchantId,
      sender: "merchant",
      message,
    });

    // notify admin
    await notificationModel.create({
      merchantId: merchantId,
      title: "New Message From Merchant",
      message: message.substring(0, 40) + "...",
    });

    res.json({ success: true, message: "Message sent" });
  } catch (error) {
    console.log("Merchant chat error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ==============================================================
   GET ALL CHAT MESSAGES FOR THIS MERCHANT
============================================================== */
export const getMerchantMessages = async (req, res) => {
  try {
    const merchantId = req.merchant;

    const messages = await chatModel
      .find({ merchantId })
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.log("Chat fetch error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ==============================================================
   ADMIN → SEND REPLY
============================================================== */
export const adminReplyToMerchant = async (req, res) => {
  try {
    const { merchantId, message } = req.body;

    if (!merchantId || !message) {
      return res.json({
        success: false,
        message: "Merchant ID and message required",
      });
    }

    const exists = await merchantModel.findById(merchantId);
    if (!exists)
      return res.json({ success: false, message: "Merchant not found" });

    await chatModel.create({
      merchantId,
      sender: "admin",
      message,
    });

    res.json({ success: true, message: "Reply sent" });

    await notificationModel.create({
      merchantId,
      title: "New Message From Admin",
      message: message.substring(0, 40) + "...", // message preview
    });
  } catch (error) {
    console.log("Admin chat error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ==============================================================
   ADMIN → GET MESSAGES OF ONE MERCHANT
============================================================== */
export const adminGetMerchantChat = async (req, res) => {
  try {
    const { merchantId } = req.body;

    const messages = await chatModel
      .find({ merchantId })
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.log("Admin chat fetch error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    let uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "brawvly/contact-support" }
        );

        uploadedFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
          originalName: file.originalname,
        });
      }
    }

    const newQuery = new ContactQuery({
      name,
      email,
      phone,
      message,
      files: uploadedFiles,
    });

    await newQuery.save();

    res.json({
      success: true,
      message: "Query submitted successfully",
    });
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};