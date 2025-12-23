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

    const cartData = user.cartData; // 🔥 THIS IS A MAP

    if (quantity <= 0) {
      // ❌ remove size
      if (cartData.has(itemId)) {
        const sizeMap = cartData.get(itemId);
        sizeMap.delete(size);

        // ❌ remove productId if empty
        if (sizeMap.size === 0) {
          cartData.delete(itemId);
        }
      }
    } else {
      // ✅ update quantity
      if (!cartData.has(itemId)) {
        cartData.set(itemId, new Map());
      }
      cartData.get(itemId).set(size, quantity);
    }

    user.markModified("cartData"); // 🔥 REQUIRED
    await user.save();

    return res.json({ success: true });
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
