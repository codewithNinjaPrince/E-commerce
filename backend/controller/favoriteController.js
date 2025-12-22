import User from "../models/userModel.js";

/* --------------------------------------------------
   ADD TO FAVORITES (ATOMIC & SAFE)
-------------------------------------------------- */
export const addToFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.json({ success: false, message: "Invalid request" });
    }

    // 🔥 Atomic + no duplicates
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { favorites: productId },
      }
    );

    return res.json({
      success: true,
      message: "Added to favorites",
    });
  } catch (error) {
    console.log("ADD FAVORITE ERROR:", error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

/* --------------------------------------------------
   REMOVE FROM FAVORITES (ATOMIC)
-------------------------------------------------- */
export const removeFromFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.json({ success: false, message: "Invalid request" });
    }

    await User.updateOne(
      { _id: userId },
      {
        $pull: { favorites: productId },
      }
    );

    return res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.log("REMOVE FAVORITE ERROR:", error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

/* --------------------------------------------------
   GET USER FAVORITES (REFRESH SAFE)
-------------------------------------------------- */
export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).lean(); // 🔥 same as cart

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      favorites: user.favorites || [],
    });
  } catch (error) {
    console.log("GET FAVORITES ERROR:", error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};
