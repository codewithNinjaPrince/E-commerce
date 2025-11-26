import express from 'express'
import { loginUser, registerUser, adminLogin } from "../controller/userController.js"
import { createSeller, listSellers } from "../controller/userController.js";
import adminAuth from "../middleware/adminAuth.js";


const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
// Admin creates seller
userRouter.post("/admin/create-seller", adminAuth, createSeller);

// Admin gets list of sellers
userRouter.get("/admin/sellers", adminAuth, listSellers);
export default userRouter;

//This is also fine and till here video is 5:55
