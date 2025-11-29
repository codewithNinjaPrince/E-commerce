import express from "express";
import { merchantAuth } from "../middleware/merchantAuth.js";
import { getMerchantOrders,getMerchantDashboard, updateMerchantItemStatus } from "../controller/merchantDashboardController.js";

const merchantDashboardRouter = express.Router();

merchantDashboardRouter.get("/dashboard", merchantAuth, getMerchantDashboard);

// Dashboard stats
merchantDashboardRouter.get("/", merchantAuth, getMerchantDashboard);

// List orders
merchantDashboardRouter.get("/orders", merchantAuth, getMerchantOrders);

// Update order status
merchantDashboardRouter.post("/update-merchant-item-status",merchantAuth,updateMerchantItemStatus)

export default merchantDashboardRouter;
