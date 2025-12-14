import express from 'express'
import { loginUser, registerUser, adminLogin} from "../controller/userController.js"
import { getUserProfile, updateUserProfile, updateUserPassword } from "../controller/userProfileController.js";
import { sendOtp, verifyOtp, sendForgotOtp, verifyForgotOtp, resetPassword,} from "../controller/otpController.js";

import authUser from "../middleware/auth.js"

const userRouter = express.Router();

userRouter.post("/send-otp", sendOtp);        
userRouter.post("/verify-otp", verifyOtp);  
userRouter.post("/forgot-password/send-otp", sendForgotOtp);
userRouter.post("/forgot-password/verify-otp", verifyForgotOtp);
userRouter.post("/forgot-password/reset", resetPassword);


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get("/profile", authUser, getUserProfile);
userRouter.post("/update-profile", authUser, updateUserProfile);
userRouter.post("/update-password", authUser, updateUserPassword);

export default userRouter;

//This is also fine and till here video is 5:55
