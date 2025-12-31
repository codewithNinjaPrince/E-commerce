import express from "express";
import orderController from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const {
  placeOrder,
  cancelOrder,
  trackOrder,
  allOrders,
  userOrders,
  updateStatus,
  validateCoupon,
  previewOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = orderController;

const orderRouter = express.Router();

/* ================= ADMIN ================= */
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

/* ================= USER ORDER ================= */
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/cancel", authUser, cancelOrder);
orderRouter.post("/track", authUser, trackOrder);
orderRouter.post("/userorders", authUser, userOrders);

/* ================= COUPON / PREVIEW ================= */
orderRouter.post("/validateCoupon", authUser, validateCoupon);
orderRouter.post("/preview", authUser, previewOrder);

/* ================= RAZORPAY ================= */
orderRouter.post("/razorpay/create", authUser, createRazorpayOrder);
orderRouter.post("/razorpay/verify", authUser, verifyRazorpayPayment);

/* ================= BLOCK OLD ROUTE ================= */
orderRouter.post("/razorpay", authUser, (req, res) => {
  res.json({
    success: false,
    message: "Use /razorpay/create and /razorpay/verify",
  });
});

export default orderRouter;


// import express from 'express'
// import orderController from '../controller/orderController.js'
// const {placeOrder,cancelOrder,trackOrder,placeOrderRazorpay, allOrders,userOrders,updateStatus,validateCoupon,previewOrder}=orderController
// import adminAuth from '../middleware/adminAuth.js'
// import authUser from '../middleware/auth.js'

// const orderRouter=express.Router()

// //Admin Features
// orderRouter.post('/list',adminAuth,allOrders)
// orderRouter.post('/status',adminAuth,updateStatus)

// //Payment Features
// orderRouter.post('/place',authUser,placeOrder)
// orderRouter.post('/cancel',authUser,cancelOrder)
// orderRouter.post('/track',authUser,trackOrder)

// orderRouter.post('/validateCoupon',authUser,validateCoupon)
// orderRouter.post('/preview',authUser,previewOrder)
// // Razorpay payment flow
// orderRouter.post("/razorpay/create", authUser, orderController.createRazorpayOrder);
// orderRouter.post("/razorpay/verify", authUser, orderController.verifyRazorpayPayment);



// //User feature
// orderRouter.post('/userorders',authUser,userOrders)

// orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// export default orderRouter