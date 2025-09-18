import express from 'express'; 
import cors from 'cors'; 
import 'dotenv/config'; 
import connectDB from './config/mongodb.js'; 
import connectCloudinary from './config/cloudinary.js'; 
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

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

// Default route to test if the API is working
app.get('/', (req, res) => {
    res.send("Api working"); 
});

// Start the server
app.listen(port, () => console.log('server started on PORT :' + port));


//This is fine check at 6:28:47
