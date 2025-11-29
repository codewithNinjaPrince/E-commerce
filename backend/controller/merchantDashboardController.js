import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

/* =========================================================
   GET MERCHANT DASHBOARD
   ========================================================= */
export const getMerchantDashboard = async (req, res) => {
  try {
    const merchantId = req.merchant;

    // TOTAL PRODUCTS
    const totalProducts = await productModel.countDocuments({
      sellerId: merchantId,
    });

    // RECENT PRODUCTS
    const recentProducts = await productModel
      .find({ sellerId: merchantId })
      .sort({ createdAt: -1 })
      .limit(5);

    // ORDERS OF THIS MERCHANT
    const orders = await orderModel
      .find({ "items.sellerId": merchantId })
      .sort({ date: -1 });

    const totalOrders = orders.length;

    // RECENT ORDERS (first 3)
    const recentOrders = orders.slice(0, 3);

    // REVENUE & EARNINGS
    let totalRevenue = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.sellerId === merchantId) {
          const itemPrice = Number(item.discountedPrice || item.price || 0);
          const qty = Number(item.quantity || 1);

          totalRevenue += itemPrice * qty;
        }
      });
    });

    const commission = 0.1;
    const earnings = Math.floor(totalRevenue * (1 - commission));

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
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET ALL ORDERS FOR MERCHANT
   ========================================================= */

export const getMerchantOrders = async (req, res) => {
  try {
    const merchantId = req.merchantId.toString();

    // Fetch all orders
    const orders = await orderModel.find({}).sort({ date: -1 }).lean();

    // Filter orders for this merchant
    const merchantOrders = orders
      .map((order) => {
        const merchantItems = order.items.filter(
          (item) => item.sellerId?.toString() === merchantId
        );

        if (merchantItems.length === 0) return null;

        return {
          _id: order._id,
          userId: order.userId,
          paymentMethod: order.paymentMethod,
          payment: order.payment,
          date: order.date,
          status: order.status,
          amount: order.amount,
          address: order.address,
          items: merchantItems,   // Only THIS merchant’s items
        };
      })
      .filter(Boolean);

    res.json({ success: true, orders: merchantOrders });
  } catch (err) {
    console.log("MERCHANT ORDER ERROR:", err);
    res.json({ success: false, message: "Unable to fetch orders" });
  }
};


export const updateMerchantItemStatus = async (req, res) => {
  try {
    const merchantId = req.merchant;
    const { orderId, productId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be updated",
      });
    }

    let itemFound = false;

    order.items.forEach((item) => {
      // Ignore items without sellerId
      if (!item?.sellerId) return;

      // Find matching item for this merchant
      if (
        item?.productId?.toString() === productId?.toString() &&
        item?.sellerId?.toString() === merchantId?.toString()
      ) {
        itemFound = true;
        item.itemStatus = status;
      }
    });
    

    if (!itemFound) {
      return res.json({ success: false, message: "Item not accessible" });
    }

    await order.save();
    res.json({ success: true, message: "Status updated", order });

  } catch (err) {
    console.log("UPDATE MERCHANT STATUS ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};
