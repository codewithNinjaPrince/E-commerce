import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import notificationModel from "../models/notificationModel.js";
import { emitMerchantNotification } from "../utils/emitNotification.js";
import { calculateOrder } from "../utils/calculateOrder.js";

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
    const { items, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in order" });
    }

    /* =====================================================
       0️⃣ LOAD USER & COUPON
    ===================================================== */
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const appliedCoupon = couponCode?.toUpperCase() || null;

    let finalAmount = 0;
    let couponActuallyUsed = false;

    /* =====================================================
   LOAD SELECTED ADDRESS
===================================================== */
const selectedAddressId = user.selectedAddressId;

if (!selectedAddressId) {
  return res.json({
    success: false,
    message: "No delivery address selected",
  });
}

const address = user.addresses?.find(
  (a) => a.addressId === selectedAddressId
);

if (!address) {
  return res.json({
    success: false,
    message: "Selected address not found",
  });
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

        let pricePerUnit = product.actualPrice;
        let couponApplied = false;

        // 🔥 COUPON CHECK (ITEM LEVEL)
        if (
          appliedCoupon &&
          product.offerCode &&
          product.offerCode.toUpperCase() === appliedCoupon &&
          !user.usedCoupons.includes(appliedCoupon)
        ) {
          pricePerUnit = product.discountedPrice;
          couponApplied = true;
          couponActuallyUsed = true;
        }

        finalAmount += pricePerUnit * cartItem.quantity;

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
          couponApplied,

          image: Array.isArray(product.image) ? product.image : [],
          productDate: product.date,

          itemStatus: "Order Placed",
        };
      })
    );

    if (!enrichedItems.length) {
      return res.json({ success: false, message: "No valid items to order" });
    }

    /* =====================================================
       2️⃣ CREATE SINGLE COMBINED ORDER
    ===================================================== */
    const calculation = await calculateOrder({
      items,
      couponCode,
      user,
      paymentMethod,
      includeCodFee: true,
    });

    if (!calculation.items.length) {
      return res.json({ success: false, message: "Invalid order items" });
    }

    const newOrder = await orderModel.create({
      userId,
      items: calculation.items,
      amount: calculation.payableAmount,
      address,
      paymentMethod,
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });
    /* =====================================================
       3️⃣ MARK COUPON AS USED (ONLY AFTER SUCCESS)
    ===================================================== */
    if (calculation.couponUsed && couponCode) {
  await userModel.updateOne(
    { _id: userId },
    { $addToSet: { usedCoupons: couponCode.toUpperCase() } }
  );
}

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
      emitMerchantNotification(item.sellerId, notificationDoc.toObject());
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
    const userId = req.userId;
    const { orderId, productId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (order.status === "Cancelled") {
      return res.json({ success: false, message: "Order already cancelled" });
    }

    if (order.items.some((i) => i.itemStatus === "Delivered")) {
      return res.json({
        success: false,
        message: "Delivered items cannot be cancelled",
      });
    }

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

    /* =====================================================
   🔒 COUPON ROLLBACK (PARTIAL CANCEL SAFE)
===================================================== */
    const couponItems = order.items.filter((item) => item.couponApplied);

    // agar coupon laga hi nahi tha → kuch mat karo
    if (couponItems.length > 0) {
      const allCouponItemsCancelled = couponItems.every(
        (item) => item.itemStatus === "Cancelled"
      );

      if (allCouponItemsCancelled) {
        await userModel.updateOne(
          { _id: userId },
          { $pull: { usedCoupons: couponItems[0].offerCode.toUpperCase() } }
        );
      }
    }

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

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;

    if (!code) {
      return res.json({ success: false, message: "Enter coupon code" });
    }

    const coupon = code.toUpperCase();

    // 1️⃣ User already used?
    const user = await userModel.findById(userId);

    if (user.usedCoupons.includes(coupon)) {
      return res.json({
        success: false,
        message: "Coupon already used",
      });
    }

    // 2️⃣ Merchant-created coupon exists?
    const productExists = await productModel.exists({
      offerCode: { $regex: `^${coupon}$`, $options: "i" },
    });

    if (!productExists) {
      return res.json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // ✅ VALID (but NOT consumed)
    return res.json({
      success: true,
      couponCode: coupon,
      message: "Coupon applied successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Coupon check failed" });
  }
};

const previewOrder = async (req, res) => {
  try {
    const { items, couponCode, paymentMethod } = req.body;
    const user = req.user; // auth middleware se

    if (couponCode) {
      const used = user.usedCoupons.includes(couponCode.toUpperCase());
      if (used) {
        return res.json({
          success: false,
          code: "COUPON_ALREADY_USED",
          message: "Coupon applied previously",
        });
      }
    }

    const summary = await calculateOrder({
      items,
      couponCode,
      user,
      paymentMethod,
    });

    return res.json({
      success: true,
      ...summary,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Preview failed",
    });
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
  validateCoupon,
  previewOrder,
};
