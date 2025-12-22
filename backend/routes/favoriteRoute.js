import express from "express";
import {
  addToFavorite,
  removeFromFavorite,
  getFavorites,
} from "../controller/favoriteController.js";
import authUser from "../middleware/auth.js";

const favoriteRouter = express.Router();

/* ---------------- FAVORITES ROUTES (CART STYLE) ---------------- */

// GET USER FAVORITES (refresh-safe)
favoriteRouter.post("/get", authUser, getFavorites);

// ADD TO FAVORITES
favoriteRouter.post("/add", authUser, addToFavorite);

// REMOVE FROM FAVORITES
favoriteRouter.post("/remove", authUser, removeFromFavorite);

export default favoriteRouter;



