// import express from "express"; 
// import { addProduct, listProducts, removeProduct, singleProduct } from "../controller/productController.js"; 
// import upload from "../middleware/multer.js"; 
// import adminAuth from "../middleware/adminAuth.js"; 

// const productRouter = express.Router(); 
// productRouter.post("/add",adminAuth,upload.fields([
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//     { name: "image3", maxCount: 1 },
//     { name: "image4", maxCount: 1 },
//     { name: "image5", maxCount: 1 },
//     { name: "image6", maxCount: 1 },
//     { name: "image7", maxCount: 1 },
//     { name: "image8", maxCount: 1 },
//     { name: "image9", maxCount: 1 },
//     { name: "image10", maxCount: 1 }
//   ]), addProduct);

// productRouter.post("/remove", adminAuth, removeProduct);
// productRouter.post("/list",adminAuth, listProducts);
// productRouter.post("/single",adminAuth, singleProduct);

// export default productRouter;

// routes/productRouter.js
import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import optionalAuth from "../middleware/optionalAuth.js"; // new middleware

const productRouter = express.Router();

// Only product creation should be protected by adminAuth
productRouter.post("/add", adminAuth, upload.fields([
  { name: "image1", maxCount: 1 },
  // ... other images
  { name: "image10", maxCount: 1 }
]), addProduct);

// Make listProducts public or optionalAuth (so UI can show different state if logged in)
productRouter.post("/list", optionalAuth, listProducts);

// Single product should be public (or optionalAuth)
productRouter.post("/single", optionalAuth, singleProduct);

// Remove product stays protected
productRouter.post("/remove", adminAuth, removeProduct);

export default productRouter;


//Starting from 6:25 
