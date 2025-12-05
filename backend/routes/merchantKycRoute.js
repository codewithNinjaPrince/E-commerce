import express from "express";
import upload from "../middleware/multer.js";
import { merchantAuth } from "../middleware/merchantAuth.js";
import {submitKyc, updateKyc, deleteKycDocument } from "../controller/merchantKycController.js";

const merchantKycRouter = express.Router();


merchantKycRouter.post(
  "/",
  merchantAuth,
  upload.fields([
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "gstFile", maxCount: 1 },
    { name: "passbookFile", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  submitKyc
);

merchantKycRouter.put(
  "/",
  merchantAuth,
  upload.fields([
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "gstFile", maxCount: 1 },
    { name: "passbookFile", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  updateKyc
);

merchantKycRouter.delete("/:docType", merchantAuth, deleteKycDocument);

export default merchantKycRouter;


