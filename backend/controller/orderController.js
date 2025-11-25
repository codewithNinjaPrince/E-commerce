import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

const currency = 'inr';
const deliveryCharge = 10;

/* ============================================================
   1️⃣  PLACE ORDER (COD)
============================================================ */
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const updatedItems = items.map(item => ({
      ...item,
      sellerId: item.sellerId,
      shopId: item.shopId
    }));

    const newOrder = new orderModel({
      userId,
      items: updatedItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ============================================================
   2️⃣  PLACE ORDER (CASHFREE) — Placeholder (No Crash)
============================================================ */
const placeOrderCashfree = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const updatedItems = items.map(item => ({
      ...item,
      sellerId: item.sellerId,
      shopId: item.shopId,
    }));

    const newOrder = new orderModel({
      userId,
      items: updatedItems,
      amount,
      address,
      paymentMethod: "Cashfree",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    // YOU WILL ADD CASHFREE SESSION CODE HERE LATER
    res.json({ success: true, message: "Cashfree session disabled here", orderId: newOrder._id });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ============================================================
   3️⃣  VERIFY CASHFREE PAYMENT
============================================================ */
const verifyCashfree = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true });
    }

    // Delete unpaid order
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ============================================================
   4️⃣  PLACE ORDER (RAZORPAY) — Blank for Now
============================================================ */
const placeOrderRazorpay = async (req, res) => {
  res.json({ success: false, message: "Razorpay not implemented yet" });
};


/* ============================================================
   5️⃣  ADMIN / SELLER — ALL ORDERS
============================================================ */
const allOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      orders = await orderModel.find({});
    } else {
      orders = await orderModel.find({ "items.shopId": req.user.shopId });
    }

    res.json({ success: true, orders });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ============================================================
   6️⃣  USER ORDERS
============================================================ */
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ============================================================
   7️⃣  UPDATE ORDER STATUS (ADMIN / SELLER)
============================================================ */
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    // Admin can edit anything
    if (req.user.role === "admin") {
      await orderModel.findByIdAndUpdate(orderId, { status });
      return res.json({ success: true, message: "Status Updated" });
    }

    // Sellers can update only their own orders
    const sellerShop = req.user.shopId;
    const belongsToSeller = order.items.some(item => item.shopId === sellerShop);

    if (!belongsToSeller) {
      return res.json({ success: false, message: "Not authorized" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ============================================================
   EXPORT
============================================================ */
export default {
  placeOrder,
  placeOrderCashfree,
  verifyCashfree,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus
};
