import express from "express";
import { merchantAuth } from "../middleware/merchantAuth.js";
import { uploadKyc } from "../controller/merchantKycController.js";
import upload from "../middleware/multer.js";

const merchantKycRouter = express.Router();

// upload.single for each doc OR multiple in same request
merchantKycRouter.post(
  "/kyc",
  merchantAuth,
  upload.fields([
    { name: "gstFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 }
  ]),
  uploadKyc
);

export default merchantKycRouter;
