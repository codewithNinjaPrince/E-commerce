import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

/* =========================================================
   GET MERCHANT DASHBOARD
   ========================================================= */
export const getMerchantDashboard = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    /* ---------------- PRODUCTS ---------------- */
    const totalProducts = await productModel.countDocuments({
      sellerId: merchantId,
    });

    const recentProducts = await productModel
      .find({ sellerId: merchantId })
      .sort({ createdAt: -1 })
      .limit(5);

    /* ---------------- ORDERS ---------------- */
    const orders = await orderModel.find({
      "items.sellerId": merchantId,
    });

    let totalOrders = 0; // ✅ ALL orders (any status)
    let totalRevenue = 0; // ✅ ONLY delivered revenue

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.sellerId?.toString() !== merchantId.toString()) return;

        // ✅ COUNT EVERY ORDER (except cancelled if you want)
        if (item.itemStatus !== "Cancelled") {
          totalOrders += 1;
        }

        // ✅ REVENUE ONLY WHEN DELIVERED
        if (item.itemStatus === "Delivered") {
          const price = Number(item.discountedPrice || item.price || 0);
          const qty = Number(item.quantity || 1);
          totalRevenue += price * qty;
        }
      });
    });

    /* ---------------- EARNINGS ---------------- */
    const commission = 0.03;
    const earnings = Math.floor(totalRevenue * (1 - commission));

    /* ---------------- RECENT ORDERS ---------------- */
    const recentOrders = orders
      .map((order) => ({
        ...order.toObject(),
        items: order.items.filter(
          (item) =>
            item.sellerId?.toString() === merchantId.toString() &&
            item.itemStatus !== "Cancelled"
        ),
      }))
      .filter((o) => o.items.length > 0)
      .slice(0, 3);

    res.json({
      success: true,
      totalProducts,
      totalOrders,
      totalRevenue,
      earnings,
      recentOrders,
      recentProducts,
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET ALL ORDERS FOR MERCHANT
   ========================================================= */

export const getMerchantOrders = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    const orders = await orderModel
      .find({ "items.sellerId": merchantId })
      .sort({ createdAt: -1 });

    // 🔥 ONLY MERCHANT ITEMS
    const filteredOrders = orders.map((order) => {
      const merchantItems = order.items.filter(
        (item) => item.sellerId?.toString() === merchantId.toString()
      );

      return {
        ...order.toObject(),
        items: merchantItems,
      };
    });

    res.json({ success: true, orders: filteredOrders });
  } catch (err) {
    console.log("GET MERCHANT ORDERS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateMerchantItemStatus = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const { orderId, productId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    let itemFound = false;

    order.items.forEach((item) => {
      if (
        item.productId?.toString() === productId?.toString() &&
        item.sellerId?.toString() === merchantId.toString()
      ) {
        itemFound = true;
        item.itemStatus = status;
      }
    });

    if (!itemFound) {
      return res.json({
        success: false,
        message: "Item does not belong to this merchant",
      });
    }

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.log("UPDATE STATUS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
