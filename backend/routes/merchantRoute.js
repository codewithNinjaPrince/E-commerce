import express from "express";
import { registerMerchant, loginMerchant, getMerchantProfile, updateMerchantProfile, updateMerchantPassword } from "../controller/merchantController.js";
import { merchantAuth } from "../middleware/merchantAuth.js";

const merchantRouter = express.Router();


// REGISTER
merchantRouter.post("/register", registerMerchant);

// LOGIN
merchantRouter.post("/login", loginMerchant);

// GET PROFILE (Protected)
merchantRouter.get("/profile", merchantAuth, getMerchantProfile);

merchantRouter.post("/update-profile", merchantAuth, updateMerchantProfile);

merchantRouter.post("/update-password", merchantAuth, updateMerchantPassword);


export default merchantRouter;
