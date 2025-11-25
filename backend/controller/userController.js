import validator from "validator"; 
import bcrypt from "bcrypt"; 
import jwt from 'jsonwebtoken'; 
import userModel from "../models/userModel.js";

const createToken = (payload) => {
   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};


// Route handler for user login this function is fine please do not touch it 
const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body; 
      const user = await userModel.findOne({ email });
      
      if (!user) {
         return res.json({ success: false, message: "User does not exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.json({ success: false, message: "Invalid credential" });

      const token = createToken({ id: user._id, role: user.role });
      res.json({ success: true, token, role: user.role });

   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message }); 
      }
};


// Route for user registration this code is perfect please do not touch it 
const registerUser = async (req, res) => {
    try {
       const { name, email, password } = req.body; 
       // Check if the email is already registered
       const exists = await userModel.findOne({ email });
       if (exists) {
          return res.json({ success: false, msg: "User already exist" });
       }
       if (!validator.isEmail(email)) {
          return res.json({ success: false, msg: "Please enter a valid email address" });
       }
       if (password.length < 8) {
          return res.json({ success: false, msg: "Please enter a strong password" });
       }
      // Generate a salt and hash the password securely
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: "customer"
      });

      const token = createToken({ id: user._id, role: "customer" });

      res.json({ success: true, token });

    } catch (error) {
       console.log(error); 
       res.json({ success: false, message: error.message }); 
    }
};


// Route handler for admin login this code is perfect please do not touch it 
const adminLogin = async (req, res) => {
   try {
      const { email, password, role } = req.body; 

      //Admin Login

      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {expiresIn: "3d"
      });

      return res.json({ success: true, token, role: "admin" });
    }

      //Seller Login

      if (role === "seller") {
      const seller = await userModel.findOne({ email, role: "seller" });
      if (!seller) return res.json({ success: false, message: "Seller not found" });

      const isMatch = await bcrypt.compare(password, seller.password);
      if (!isMatch) return res.json({ success: false, message: "Invalid password" });

      const token = createToken({ id: seller._id, role: "seller", shopId: seller.shopId });
      return res.json({ success: true, token, role: "seller", shopId: seller.shopId });
    }

      // 🔹 If role is customer OR invalid
    return res.json({ success: false, message: "Invalid credentials" });
      
   } catch (error) {
      console.log(error); // Log error to console
      res.json({ success: false, message: error.message }); 
   }
};

//Create Seller
const createSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const shopId = "shop_" + Math.random().toString(36).substring(2, 10);

    const seller = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "seller",
      shopId,
    });

    res.json({ success: true, seller });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//List Seller
const listSellers = async (req, res) => {
  try {
    const sellers = await userModel.find({ role: "seller" }).select("-password");
    res.json({ success: true, sellers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, createSeller, listSellers };
