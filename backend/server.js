import express from 'express'; 
import cors from 'cors'; 
import 'dotenv/config'; 
import connectDB from './config/mongodb.js'; 
import connectCloudinary from './config/cloudinary.js'; 
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import emailRouter from './routes/emailRoute.js';

// App configuration
const app = express(); 
const port = process.env.PORT || 4000;

// Initialize connections
connectDB(); 
connectCloudinary(); 

// Middlewares
app.use(express.json()); 
app.use(cors()); 

// API endpoints
app.use('/api/user', userRouter); 
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter)
app.use('/api/email',emailRouter);

// Default route to test if the API is working
app.get('/', (req, res) => {
    res.send("Api working"); 
});

export default app;

// This is fine check at 6:28:47

// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import connectDB from './config/mongodb.js';
// import connectCloudinary from './config/cloudinary.js';

// // Routers
// import userRouter from './routes/userRoute.js';
// import productRouter from './routes/productRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import orderRouter from './routes/orderRoute.js';
// import emailRouter from './routes/emailRoute.js';



// const app = express();

// // PORT (default: 4000)
// const PORT = process.env.PORT || 4000;

// // Connect to MongoDB and Cloudinary
// connectDB();
// connectCloudinary();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);
// app.use('/api/email', emailRouter);

// // Health Check Route
// app.get('/', (req, res) => {
//   res.send("API is working");
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// export default app;

