import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routers
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import emailRouter from "./routes/emailRoute.js";
import favoriteRoute from "./routes/favoriteRoute.js";


// Merchant Routes
import merchantRouter from "./routes/merchantRoute.js";
import merchantProductRouter from "./routes/merchantProductRoute.js";
import merchantDashboardRouter from "./routes/merchantDashboardRoute.js";
import merchantKycRouter from "./routes/merchantKycRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import chatRouter from "./routes/chatRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

// DB & Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/email", emailRouter);
app.use("/api/form",chatRouter);
app.use("/api/favorites", favoriteRoute);


// Merchant
app.use("/api/merchant", merchantRouter);
app.use("/api/merchant/kyc", merchantKycRouter);
app.use("/api/merchant/product", merchantProductRouter);
app.use("/api/merchant/dashboard", merchantDashboardRouter);
app.use("/api/merchant/notifications", notificationRouter);

// Root
app.get("/", (req, res) => {
  res.send("API is working");
});

// ================= SOCKET.IO =================
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join_merchant", (merchantId) => {
    if (!merchantId) return;
    socket.join(merchantId);
    console.log(`🏪 Merchant joined room: ${merchantId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on port ${PORT}`);
});

export default app;
