import express from "express";
import { registerMerchant, loginMerchant, getMerchantProfile, updateMerchantProfile, updateMerchantPassword, verifyMerchantPassword, getMerchantStoreBySlug, getMerchantSlugById } from "../controller/merchantController.js";
import { merchantAuth } from "../middleware/merchantAuth.js";

const merchantRouter = express.Router();

// REGISTER
merchantRouter.post("/register", registerMerchant);

//GET SLUG
merchantRouter.get("/store/:slug", getMerchantStoreBySlug);

merchantRouter.get("/slug/:merchantId", getMerchantSlugById);
// LOGIN
merchantRouter.post("/login", loginMerchant);

// GET PROFILE (Protected)
merchantRouter.get("/profile", merchantAuth, getMerchantProfile);

merchantRouter.post("/update-profile", merchantAuth, updateMerchantProfile);

merchantRouter.post("/update-password", merchantAuth, updateMerchantPassword);

merchantRouter.post("/verify-password", merchantAuth, verifyMerchantPassword);


export default merchantRouter



