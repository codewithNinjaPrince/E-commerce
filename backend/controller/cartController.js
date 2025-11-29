import userModel from "../models/userModel.js";

//Add products to User cart
// cartController.js (fixed addToCart)
import productModel from "../models/productModel.js";

const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.json({ success: false, message: "Missing itemId or size" });
    }

    // Resolve user id from common locations your app might use
    // Adapt these keys to what your auth middleware actually sets (req.user, req.userId, etc).
    const userId = req.userId || req.user?._id || req.user || req.body.userId;

    if (!userId) {
      console.log("addToCart: missing userId - headers:", req.headers);
      return res.json({ success: false, message: "Not authenticated" });
    }

    // Find user
    const user = await userModel.findById(userId);

    if (!user) {
      console.log("addToCart: user not found for id:", userId);
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure cartData exists and is a plain object
    const cart = user.cartData && typeof user.cartData === "object" ? user.cartData : {};

    // Basic product existence check (optional but helpful)
    const product = await productModel.findById(itemId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Update cart in-memory
    if (cart[itemId]) {
      cart[itemId][size] = (cart[itemId][size] || 0) + 1;
    } else {
      cart[itemId] = { [size]: 1 };
    }

    // Save back to user document
    user.cartData = cart;
    await user.save();

    return res.json({ success: true, message: "Item added to cart", cartData: cart });
  } catch (err) {
    console.error("addToCart ERROR:", err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

//update User cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userData, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//get User cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User not authorized" });
    }

    const userData = await userModel.findById(userId);
    

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, cartData:userData.cartData});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
