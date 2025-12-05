import express from "express";
import {
  addMerchantProduct,
  listMerchantProducts,
  removeMerchantProduct,
  updateMerchantProduct,
  getSingleMerchantProduct
} from "../controller/merchantController.js";
import upload from "../middleware/multer.js";
import { merchantAuth } from "../middleware/merchantAuth.js";

const merchantProductRouter = express.Router();

merchantProductRouter.post("/add", merchantAuth, upload.array("images"), addMerchantProduct);
merchantProductRouter.get("/list", merchantAuth, listMerchantProducts);
merchantProductRouter.post("/remove", merchantAuth, removeMerchantProduct);
merchantProductRouter.post("/update", merchantAuth, upload.array("images"),updateMerchantProduct
);
merchantProductRouter.post("/single", merchantAuth, getSingleMerchantProduct);

export default merchantProductRouter;
