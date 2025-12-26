import express from "express";
import authUser from "../middleware/auth.js";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controller/addressController.js";

const addressRouter = express.Router();

/* ================= ADDRESS ROUTES ================= */

// Add new address
addressRouter.post("/add", authUser, addAddress);

// Get all addresses of logged-in user
addressRouter.get("/get", authUser, getAddresses);

// Update address
addressRouter.put("/update/:id", authUser, updateAddress);

// Delete address
addressRouter.delete("/delete/:id", authUser, deleteAddress);

// Set default address
addressRouter.patch("/default/:id", authUser, setDefaultAddress);

export default addressRouter;

