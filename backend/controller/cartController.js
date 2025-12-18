import userModel from "../models/userModel.js";

/* --------------------------------------------------
   ADD TO CART (ATOMIC & SAFE)
-------------------------------------------------- */
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    if (!itemId || !size || !userId) {
      return res.json({ success: false, message: "Invalid request" });
    }

    // 🔥 Atomic increment (no race conditions)
    await userModel.updateOne(
      { _id: userId },
      {
        $inc: {
          [`cartData.${itemId}.${size}`]: 1,
        },
      }
    );

    return res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

/* --------------------------------------------------
   UPDATE CART (SET / REMOVE)
-------------------------------------------------- */
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size, quantity } = req.body;

    if (!userId || !itemId || !size) {
      return res.json({ success: false, message: "Invalid request" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData || {};

    // ❌ Remove item
    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];

        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } 
    // ✅ Update quantity
    else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    user.cartData = cartData;
    user.markModified("cartData"); // 🔥 VERY IMPORTANT
    await user.save();

    return res.json({ success: true, cartData });
  } catch (error) {
    console.log("UPDATE CART ERROR:", error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

/* --------------------------------------------------
   GET USER CART (REFRESH SAFE)
-------------------------------------------------- */
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).lean(); // 🔥 FIX

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

export { addToCart, updateCart, getUserCart };
