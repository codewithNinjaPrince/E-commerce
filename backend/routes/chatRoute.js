import express from "express";
import upload from "../middleware/multer.js";
import { merchantAuth } from "../middleware/merchantAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import { submitContactForm } from "../controller/chatController.js";

import {
  sendMerchantMessage,
  getMerchantMessages,
  adminReplyToMerchant,
  adminGetMerchantChat,
} from "../controller/chatController.js";

const chatRouter = express.Router();

/* ------------------- MERCHANT ROUTES ------------------- */
chatRouter.post("/merchant/send", merchantAuth, sendMerchantMessage);
chatRouter.get("/merchant/messages", merchantAuth, getMerchantMessages);

// Customer chat support
chatRouter.post("/contact", upload.array("files", 5), submitContactForm);

/* ------------------- ADMIN ROUTES ------------------- */
chatRouter.post("/admin/send", adminAuth, adminReplyToMerchant);
chatRouter.post("/admin/get", adminAuth, adminGetMerchantChat);

export default chatRouter;
