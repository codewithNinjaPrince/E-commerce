import express from "express";
import { merchantAuth } from "../middleware/merchantAuth.js";
import {
  getPayments,
  withdrawRequest
} from "../controller/merchantPaymentsController.js";

const router = express.Router();

router.get("/payments", merchantAuth, getPayments);
router.post("/payments/withdraw", merchantAuth, withdrawRequest);

export default router;
