import express from "express";
import { merchantAuth } from "../middleware/merchantAuth.js";
import adminAuth from "../middleware/adminAuth.js";

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

/* ------------------- ADMIN ROUTES ------------------- */
chatRouter.post("/admin/send", adminAuth, adminReplyToMerchant);
chatRouter.post("/admin/get", adminAuth, adminGetMerchantChat);

export default chatRouter;
