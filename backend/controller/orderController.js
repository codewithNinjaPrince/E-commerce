import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import notificationModel from "../models/notificationModel.js";
import { emitMerchantNotification } from "../utils/emitNotification.js";

//Global Variables
const currency = "inr";
const deliveryCharge = 10;

//Gateway Initialize
// const cashfree = new Cashfree({
//   appId: process.env.CASHFREE_APP_ID,
//   secretKey: process.env.CASHFREE_SECRET_KEY,
//   env: "TEST" // or "PROD"
// });

//placeorder COD
// -------------------- PLACE ORDER (COD) --------------------
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in order" });
    }

    /* =====================================================
       1️⃣ ENRICH CART ITEMS WITH PRODUCT DATA
    ===================================================== */
    const enrichedItems = await Promise.all(
      items.map(async (cartItem) => {
        const product = await productModel.findById(cartItem.productId);

        if (!product) {
          throw new Error(`Product not found: ${cartItem.productId}`);
        }

        return {
          productId: product._id.toString(),
          sellerId: product.sellerId?.toString(),
          shopId: product.shopId || "",

          name: product.name,
          brandName: product.brandName,

          actualPrice: product.actualPrice,
          discountedPrice: product.discountedPrice,
          price: product.discountedPrice,

          quantity: cartItem.quantity,
          size: cartItem.size,

          category: product.category,
          subCategory: product.subCategory,
          offerCode: product.offerCode || "",

          image: Array.isArray(product.image) ? product.image : [],
          productDate: product.date,

          itemStatus: "Order Placed",
        };
      })
    );

    /* =====================================================
       2️⃣ CREATE SINGLE COMBINED ORDER
    ===================================================== */
    const newOrder = await orderModel.create({
      userId,
      items: enrichedItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    /* =====================================================
       3️⃣ CLEAR USER CART
    ===================================================== */
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    /* =====================================================
       4️⃣ CREATE + EMIT MERCHANT NOTIFICATIONS
    ===================================================== */
    for (const item of enrichedItems) {
      if (!item.sellerId) continue;

      // save notification in DB
      const notificationDoc = await notificationModel.create({
        merchantId: item.sellerId,
        type: "NEW_ORDER",
        title: "New Order Received",
        message: `${item.name} (Qty ${item.quantity}, Size ${item.size})`,
        read: false,
        date: Date.now(),
      });

      // 🔥 convert to plain object before socket emit
      emitMerchantNotification(
        item.sellerId,
        notificationDoc.toObject()
      );
    }

    /* =====================================================
       5️⃣ RESPONSE
    ===================================================== */
    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("PLACE ORDER ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};

//placing orders using Stripe Method
const placeOrderCashfree = async (req, res) => {
  try {
    console.log("🔥 Incoming order items from user:", req.body.items);

    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Cashfree",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await cashfree.checkout.sesssions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Verify Cashfree

const verifyCashfree = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

//All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//User Order data for frontend
// -------------------- USER ORDERS (Frontend) --------------------
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, message: "User ID missing" });
    }

    // Fetch all orders (newest → oldest)
    const orders = await orderModel.find({ userId }).sort({ date: -1 }).lean(); // IMPORTANT → faster + allows editing items[]

    // Sort items inside each order (newest product first)
    orders.forEach((order) => {
      order.items.sort((a, b) => {
        const dateA = a.productDate || a.date || 0;
        const dateB = b.productDate || b.date || 0;
        return dateB - dateA; // newest → oldest
      });
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.log("USER ORDERS ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};

//Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    let updatedItem = null;

    order.items = order.items.map((item) => {
      if (item.productId.toString() === productId.toString()) {
        updatedItem = item;
        return { ...item, itemStatus: "Cancelled" };
      }
      return item;
    });

    if (!updatedItem)
      return res.json({ success: false, message: "Item not found" });

    await order.save();

    await notificationModel.create({
      merchantId: updatedItem.sellerId,
      title: "Order Item Cancelled",
      message: `User cancelled ${updatedItem.name} (Qty ${updatedItem.quantity}).`,
      read: false,
      date: Date.now(),
    });

    res.json({ success: true, message: "Item cancelled" });
  } catch (err) {
    console.log("CANCEL ERROR:", err);
    res.json({ success: false, message: "Unable to cancel" });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId)
      return res.json({ success: false, message: "Order ID missing" });

    // Get latest order

    const order = await orderModel.findById(orderId).lean();
    if (order.status === "Cancelled") {
      return res.json({ success: true, order }); // return but DO NOT update
    }

    if (!order) return res.json({ success: false, message: "Order not found" });

    // (Optional) sort items here also
    order.items = order.items.sort((a, b) => {
      const da = a.productDate || a.updatedAt || a.date || 0;
      const db = b.productDate || b.updatedAt || b.date || 0;
      return db - da;
    });

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log("TRACK ORDER ERROR:", err);
    return res.json({ success: false, message: "Unable to track order" });
  }
};

export default {
  verifyCashfree,
  placeOrder,
  placeOrderRazorpay,
  placeOrderCashfree,
  allOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  trackOrder,
};
