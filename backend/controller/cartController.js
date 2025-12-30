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

/* --------------------------------------------------
   CHANGE SIZE
-------------------------------------------------- */

export const changeSize = async (req, res) => {
  try {
    const { productId, oldSize, newSize, quantity } = req.body;
    const userId = req.userId; // from auth middleware

    if (!productId || !oldSize || !newSize) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (oldSize === newSize) {
      return res.status(400).json({
        success: false,
        message: "Old size and new size are same",
      });
    }

    const user = await userModel.findById(userId);
    if (!user || !user.cartData) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const productCart = user.cartData.get(productId);

    if (!productCart || !productCart.get(oldSize)) {
      return res.status(400).json({
        success: false,
        message: "Old size not found in cart",
      });
    }

    const qty = quantity || productCart.get(oldSize);

    // ❌ remove old size
    productCart.delete(oldSize);

    // ✅ add new size
    productCart.set(newSize, qty);

    // clean empty product
    if (productCart.size === 0) {
      user.cartData.delete(productId);
    } else {
      user.cartData.set(productId, productCart);
    }

    await user.save();

    return res.json({
      success: true,
      message: "Size changed successfully",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("CHANGE SIZE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing size",
    });
  }
};


const saveForLater = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const user = await userModel.findById(req.userId);

    // remove from cart
    if (user.cartData?.get(productId)?.get(size)) {
      user.cartData.get(productId).delete(size);
    }

    // add to saved
    user.savedForLater.push({ productId, size, quantity });

    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getSavedForLater = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).lean();

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      items: user.savedForLater || [],
    });
  } catch (error) {
    console.log("GET SAVED FOR LATER ERROR:", error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

const removeSavedForLater = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const user = await userModel.findById(req.userId);

    user.savedForLater = user.savedForLater.filter(
      (item) => !(item.productId.equals(productId) && item.size === size)
    );

    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};




export { addToCart, updateCart, getUserCart, saveForLater, getSavedForLater, removeSavedForLater };
