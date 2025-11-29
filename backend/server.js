import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// Routers
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import emailRouter from './routes/emailRoute.js';

// MERCHANT ROUTES
import merchantRouter from './routes/merchantRoute.js';
import merchantKycRouter from './routes/merchantKycRoute.js';
import merchantProductRouter from './routes/merchantProductRoute.js';
import merchantPaymentsRouter from './routes/merchantPaymentsRoute.js';
import merchantDashboardRouter from './routes/merchantDashboardRoute.js';
import notificationRouter from "./routes/notificationRoute.js";
import chatRouter from "./routes/chatRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// ======================
// GLOBAL MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ✅ LOGGER (must be BEFORE routes)
app.use((req, res, next) => {
  console.log(`🔥 ${req.method}  ${req.originalUrl}`);
  next();
});

// ================================
//       USER + STORE ROUTES
// ================================
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/email', emailRouter);

// ================================
//       MERCHANT ROUTES FIXED
// ================================

// 1️⃣ Merchant Auth (MUST come BEFORE other merchant routes)
app.use('/api/merchant', merchantRouter);

// 2️⃣ Merchant Product CRUD
app.use('/api/merchant/product', merchantProductRouter);

// 3️⃣ Merchant KYC
app.use('/api/merchant/kyc', merchantKycRouter);

// 4️⃣ Merchant Payments
app.use('/api/merchant/payments', merchantPaymentsRouter);

// 5️⃣ Merchant Dashboard
app.use('/api/merchant/dashboard', merchantDashboardRouter);

// 6️⃣ Merchant Notifications
app.use("/api/merchant/notifications", notificationRouter);

// 7️⃣ Chat Support
app.use("/api/chat", chatRouter);

// ================================
//           ROOT ROUTE
// ================================
app.get('/', (req, res) => {
  res.send("API is working");
});

// ================================
//         START SERVER
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
