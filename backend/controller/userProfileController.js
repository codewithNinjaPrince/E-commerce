import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import bcrypt from "bcrypt";

// =============================
// 📌 GET USER PROFILE + STATS
// =============================
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // comes from authUser

    const user = await userModel.findById(userId).lean();
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure safe address object
    const safeUser = {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
    };

    // Fetch all user orders
    const orders = await orderModel.find({ userId }).lean();

    let totalOrders = orders.length;
    let totalSpent = 0;
    let totalDiscount = 0;

    orders.forEach((order) => {
      totalSpent += order.amount;

      order.items.forEach((item) => {
        const saved =
          (item.actualPrice - item.discountedPrice) * item.quantity;

        if (saved > 0) totalDiscount += saved;
      });
    });

    const discountPercentage =
      totalSpent > 0
        ? Math.round((totalDiscount / (totalSpent + totalDiscount)) * 100)
        : 0;

    return res.json({
      success: true,
      user: safeUser,
      stats: {
        totalOrders,
        totalSpent,
        totalDiscount,
        discountPercentage,
      },
    });
  } catch (err) {
    console.log("PROFILE ERROR:", err);
    return res.json({
      success: false,
      message: "Failed to load profile",
    });
  }
};

// =============================
// 📌 UPDATE USER PROFILE
// =============================
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;

    // Guarantee address exists
    data.address = data.address || {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    );

    return res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated",
    });
  } catch (err) {
    console.log("PROFILE UPDATE ERROR:", err);
    return res.json({ success: false, message: "Update failed" });
  }
};

// =============================
// 📌 UPDATE PASSWORD
// =============================
export const updateUserPassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Match old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Save new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated",
    });
  } catch (err) {
    console.log("PASSWORD UPDATE ERROR:", err);
    return res.json({ success: false, message: "Failed to update password" });
  }
};
