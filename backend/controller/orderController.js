import crypto from "crypto";
import { razorpay } from "../utils/razorpay.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import notificationModel from "../models/notificationModel.js";
import { emitMerchantNotification } from "../utils/emitNotification.js";
import { calculateOrder } from "../utils/calculateOrder.js";

//Global Variables
const currency = "inr";

//placeorder COD
// -------------------- PLACE ORDER (COD) --------------------
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, paymentMethod, couponCode } = req.body;

    if (!items || !items.length) {
      return res.json({ success: false, message: "No items in order" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    /* ================= ADDRESS ================= */
    const selectedAddressId = user.selectedAddressId;
    if (!selectedAddressId) {
      return res.json({
        success: false,
        message: "No delivery address selected",
      });
    }

    const address = user.addresses.find(
      (a) => a.addressId === selectedAddressId
    );

    if (!address) {
      return res.json({
        success: false,
        message: "Selected address not found",
      });
    }

    /* ================= FINAL CALCULATION ================= */
    const calculation = await calculateOrder({
      items,
      couponCode,
      user,
      paymentMethod,
      includeCodFee: true,
    });

    if (!calculation.items.length) {
      return res.json({ success: false, message: "Invalid items" });
    }

    /* ================= CREATE ORDER ================= */

    const now = Date.now();

    const itemsWithHistory = calculation.items.map((item) => ({
      ...item,
      itemStatus: "Order Placed",
      statusHistory: [
        {
          status: "Order Placed",
          date: now,
        },
      ],
    }));

    const newOrder = await orderModel.create({
      userId,
      items: itemsWithHistory,
      amount: calculation.payableAmount,
      address,
      paymentMethod,
      payment: paymentMethod !== "cod",
      paymentInfo: paymentMethod !== "cod" ? user.verifiedPayment : null,
      status: "Order Placed",
      date: now,
    });

    /* ================= COUPON MARK ================= */
    if (calculation.couponUsed && couponCode) {
      await userModel.updateOne(
        { _id: userId },
        { $addToSet: { usedCoupons: couponCode.toUpperCase() } }
      );
    }

    /* ================= CLEANUP ================= */
    await userModel.updateOne(
      { _id: userId },
      {
        $set: { cartData: {} },
        $unset: { verifiedPayment: "" }, // 🔥 IMPORTANT
      }
    );

    /* ================= MERCHANT NOTIFICATIONS ================= */
    for (const item of itemsWithHistory) {
      if (!item.sellerId) continue;

      const notification = await notificationModel.create({
        merchantId: item.sellerId,
        type: "NEW_ORDER",
        title: "New Order Received",
        message: `${item.name} (Qty ${item.quantity}, Size ${item.size})`,
        read: false,
        date: Date.now(),
      });

      emitMerchantNotification(item.sellerId, notification.toObject());
    }

    return res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.log("PLACE ORDER ERROR:", err);
    return res.json({
      success: false,
      message: "Unable to place order",
    });
  }
};

// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.userId; // from auth middleware
//     const { items, paymentMethod, couponCode } = req.body;

//     if (!items || items.length === 0) {
//       return res.json({ success: false, message: "No items in order" });
//     }

//     /* =====================================================
//        0️⃣ LOAD USER & COUPON
//     ===================================================== */
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     const appliedCoupon = couponCode?.toUpperCase() || null;

//     let finalAmount = 0;
//     let couponActuallyUsed = false;

//     /* =====================================================
//    LOAD SELECTED ADDRESS
// ===================================================== */
//     const selectedAddressId = user.selectedAddressId;

//     if (!selectedAddressId) {
//       return res.json({
//         success: false,
//         message: "No delivery address selected",
//       });
//     }

//     const address = user.addresses?.find(
//       (a) => a.addressId === selectedAddressId
//     );

//     if (!address) {
//       return res.json({
//         success: false,
//         message: "Selected address not found",
//       });
//     }

//     /* =====================================================
//        1️⃣ ENRICH CART ITEMS WITH PRODUCT DATA
//     ===================================================== */
//     const enrichedItems = await Promise.all(
//       items.map(async (cartItem) => {
//         const product = await productModel.findById(cartItem.productId);

//         if (!product) {
//           throw new Error(`Product not found: ${cartItem.productId}`);
//         }

//         let pricePerUnit = product.actualPrice;
//         let couponApplied = false;

//         // 🔥 COUPON CHECK (ITEM LEVEL)
//         if (
//           appliedCoupon &&
//           product.offerCode &&
//           product.offerCode.toUpperCase() === appliedCoupon &&
//           !user.usedCoupons.includes(appliedCoupon)
//         ) {
//           pricePerUnit = product.discountedPrice;
//           couponApplied = true;
//           couponActuallyUsed = true;
//         }

//         finalAmount += pricePerUnit * cartItem.quantity;

//         return {
//           productId: product._id.toString(),
//           sellerId: product.sellerId?.toString(),
//           shopId: product.shopId || "",

//           name: product.name,
//           brandName: product.brandName,

//           actualPrice: product.actualPrice,
//           discountedPrice: product.discountedPrice,
//           price: product.discountedPrice,

//           quantity: cartItem.quantity,
//           size: cartItem.size,

//           category: product.category,
//           subCategory: product.subCategory,
//           offerCode: product.offerCode || "",
//           couponApplied,

//           image: Array.isArray(product.image) ? product.image : [],
//           productDate: product.date,

//           itemStatus: "Order Placed",
//         };
//       })
//     );

//     if (!enrichedItems.length) {
//       return res.json({ success: false, message: "No valid items to order" });
//     }

//     /* =====================================================
//        2️⃣ CREATE SINGLE COMBINED ORDER
//     ===================================================== */
//     const calculation = await calculateOrder({
//       items,
//       couponCode,
//       user,
//       paymentMethod,
//       includeCodFee: true,
//     });

//     if (!calculation.items.length) {
//       return res.json({ success: false, message: "Invalid order items" });
//     }

//     const newOrder = await orderModel.create({
//       userId,
//       items: calculation.items,
//       amount: calculation.payableAmount,
//       address,
//       paymentMethod,
//       payment: false,
//       status: "Order Placed",
//       date: Date.now(),
//     });
//     /* =====================================================
//        3️⃣ MARK COUPON AS USED (ONLY AFTER SUCCESS)
//     ===================================================== */
//     if (calculation.couponUsed && couponCode) {
//       await userModel.updateOne(
//         { _id: userId },
//         { $addToSet: { usedCoupons: couponCode.toUpperCase() } }
//       );
//     }

//     /* =====================================================
//        3️⃣ CLEAR USER CART
//     ===================================================== */
//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     /* =====================================================
//        4️⃣ CREATE + EMIT MERCHANT NOTIFICATIONS
//     ===================================================== */
//     for (const item of enrichedItems) {
//       if (!item.sellerId) continue;

//       // save notification in DB
//       const notificationDoc = await notificationModel.create({
//         merchantId: item.sellerId,
//         type: "NEW_ORDER",
//         title: "New Order Received",
//         message: `${item.name} (Qty ${item.quantity}, Size ${item.size})`,
//         read: false,
//         date: Date.now(),
//       });

//       // 🔥 convert to plain object before socket emit
//       emitMerchantNotification(item.sellerId, notificationDoc.toObject());
//     }

//     /* =====================================================
//        5️⃣ RESPONSE
//     ===================================================== */
//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       orderId: newOrder._id,
//     });
//   } catch (error) {
//     console.log("PLACE ORDER ERROR:", error);
//     res.json({ success: false, message: error.message });
//   }
// };

// Create razorpay order

const createRazorpayOrder = async (req, res) => {
  try {
    const normalizedPaymentMethod = "online";

    const userId = req.userId;
    const { items, couponCode, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.json({ success: false, message: "No items found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // 🔒 SERVER-SIDE AMOUNT CALCULATION (IMPORTANT)
    const calculation = await calculateOrder({
      items,
      couponCode,
      user,
      paymentMethod: normalizedPaymentMethod,
      includeCodFee: false,
    });

    const amount = calculation.payableAmount;

    if (amount <= 0) {
      return res.json({ success: false, message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    });

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log("RAZORPAY CREATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
    });
  }
};

//Verifying razorpay payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.userId;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({
        success: false,
        message: "Missing Razorpay payment details",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ STORE VERIFIED PAYMENT TEMPORARILY (SAFE)
    await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          verifiedPayment: {
            method: "razorpay",
            razorpay_order_id,
            razorpay_payment_id,
            verifiedAt: Date.now(),
          },
        },
      }
    );

    return res.json({ success: true });
  } catch (err) {
    console.log("RAZORPAY VERIFY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

//placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  return res.json({
    success: false,
    message: "Use /razorpay/create and /razorpay/verify",
  });
};

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

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const now = Date.now();

    order.status = status;

    // update each item
    order.items = order.items.map((item) => ({
      ...item,
      itemStatus: status,
      statusHistory: [...(item.statusHistory || []), { status, date: now }],
    }));

    await order.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId, productId, cancelReason } = req.body;

    if (!cancelReason || !cancelReason.trim()) {
      return res.json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    let updatedItem = null;
    const now = Date.now();
    const NON_CANCELLABLE = ["Shipped", "Out for Delivery", "Delivered"];

    order.items = order.items.map((item) => {
      if (item.productId.toString() === productId.toString()) {
        if (NON_CANCELLABLE.includes(item.itemStatus)) {
          throw new Error("Item cannot be cancelled at this stage");
        }

        updatedItem = item;

        return {
          ...item,
          itemStatus: "Cancelled",
          cancelReason: cancelReason.trim(),
          cancelledAt: now,
          statusHistory: [
            ...(item.statusHistory || []),
            { status: "Cancelled", date: now },
          ],
        };
      }
      return item;
    });

    if (!updatedItem) {
      return res.json({ success: false, message: "Item not found" });
    }

    // 🔁 Coupon rollback (IMPORTANT)
    const couponItems = order.items.filter(
  (item) => item.couponApplied && item.offerCode
);

if (
  couponItems.length > 0 &&
  couponItems.every((item) => item.itemStatus === "Cancelled")
) {
  await userModel.updateOne(
    { _id: userId },
    { $pull: { usedCoupons: couponItems[0].offerCode.toUpperCase() } }
  );
}


    // Optional order status update
    if (order.items.every((i) => i.itemStatus === "Cancelled")) {
      order.status = "Cancelled";
    }

    await order.save();

    if (updatedItem.sellerId) {
      await notificationModel.create({
        merchantId: updatedItem.sellerId,
        title: "Order Item Cancelled",
        message: `${updatedItem.name} cancelled. Reason: ${cancelReason}`,
        read: false,
        date: now,
      });
    }

    return res.json({ success: true, message: "Item cancelled successfully" });
  } catch (err) {
    console.error("CANCEL ORDER ERROR:", err.message);
    return res.json({
      success: false,
      message: err.message || "Unable to cancel order",
    });
  }
};



// const cancelOrder = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { orderId, productId } = req.body;

//     const order = await orderModel.findById(orderId);
//     if (!order) return res.json({ success: false, message: "Order not found" });

//     if (order.status === "Cancelled") {
//       return res.json({ success: false, message: "Order already cancelled" });
//     }

//     if (order.items.some((i) => i.itemStatus === "Delivered")) {
//       return res.json({
//         success: false,
//         message: "Delivered items cannot be cancelled",
//       });
//     }

//     let updatedItem = null;

//     order.items = order.items.map((item) => {
//       if (item.productId.toString() === productId.toString()) {
//         updatedItem = item;
//         return {
//           ...item,
//           itemStatus: "Cancelled",
//           statusHistory: [
//             ...(item.statusHistory || []),
//             {
//               status: "Cancelled",
//               date: Date.now(),
//             },
//           ],
//         };
//       }
//       return item;
//     });

//     if (!updatedItem)
//       return res.json({ success: false, message: "Item not found" });

//     await order.save();

//     /* =====================================================
//    🔒 COUPON ROLLBACK (PARTIAL CANCEL SAFE)
// ===================================================== */
//     const couponItems = order.items.filter((item) => item.couponApplied);

//     // agar coupon laga hi nahi tha → kuch mat karo
//     if (couponItems.length > 0) {
//       const allCouponItemsCancelled = couponItems.every(
//         (item) => item.itemStatus === "Cancelled"
//       );

//       if (allCouponItemsCancelled) {
//         await userModel.updateOne(
//           { _id: userId },
//           { $pull: { usedCoupons: couponItems[0].offerCode.toUpperCase() } }
//         );
//       }
//     }

//     await notificationModel.create({
//       merchantId: updatedItem.sellerId,
//       title: "Order Item Cancelled",
//       message: `User cancelled ${updatedItem.name} (Qty ${updatedItem.quantity}).`,
//       read: false,
//       date: Date.now(),
//     });

//     res.json({ success: true, message: "Item cancelled" });
//   } catch (err) {
//     console.log("CANCEL ERROR:", err);
//     res.json({ success: false, message: "Unable to cancel" });
//   }
// };

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

// -------------------- ORDER DETAILS (Single Order) --------------------
const orderDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({
        success: false,
        message: "Order ID required",
      });
    }

    const order = await orderModel.findOne({
      _id: orderId,
      userId,
    }).lean();

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    // keep item order consistent with userOrders
    order.items.sort((a, b) => {
      const da = a.productDate || a.date || 0;
      const db = b.productDate || b.date || 0;
      return db - da;
    });

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log("ORDER DETAILS ERROR:", err);
    return res.json({
      success: false,
      message: "Unable to fetch order details",
    });
  }
};


export default {
  // COD
  placeOrder,

  // Razorpay
  createRazorpayOrder,
  verifyRazorpayPayment,
  placeOrderRazorpay,

  // Orders
  allOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  trackOrder,
  orderDetails,

  // Coupon & preview
  validateCoupon,
  previewOrder,
};