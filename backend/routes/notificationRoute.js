import express from "express";
import { merchantAuth } from "../middleware/merchantAuth.js";
import {
  getMerchantNotifications,
  markAllRead,
  deleteNotification,
} from "../controller/notificationController.js";

const notificationRouter = express.Router();

// Fetch all notifications
notificationRouter.get("/", merchantAuth, getMerchantNotifications);

// Mark all as read
notificationRouter.post("/mark-all-read", merchantAuth, markAllRead);

// Delete notification
notificationRouter.post("/delete", merchantAuth, deleteNotification);

export default notificationRouter;
