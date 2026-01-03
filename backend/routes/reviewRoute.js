import express from "express";
import {
  addReview,
  getProductReviews,
  updateReview,
  reportReview,
  markReviewHelpful,
  getUserReviews,
  merchantReply,
  getMerchantReviews,
  adminGetReportedReviews,
  adminUpdateReviewStatus,
} from "../controller/reviewController.js";

import authUser from "../middleware/auth.js";
import { merchantAuth } from "../middleware/merchantAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ---------- USER ---------- */
router.post("/add", authUser, addReview);
router.post("/get", getProductReviews);
router.post("/update", authUser, updateReview);
router.post("/report", authUser, reportReview);
router.post("/helpful", authUser, markReviewHelpful);
router.post("/my-reviews", authUser, getUserReviews);

/* ---------- MERCHANT ---------- */
router.post("/merchant-reply", merchantAuth, merchantReply);
router.post("/merchant-reviews", merchantAuth, getMerchantReviews);

/* ---------- ADMIN ---------- */
router.post("/admin/reported", adminAuth, adminGetReportedReviews);
router.post("/admin/update-status", adminAuth, adminUpdateReviewStatus);

export default router;
