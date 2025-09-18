import validator from "validator"; 
import bcrypt from "bcrypt"; 
import jwt from 'jsonwebtoken'; 
import userModel from "../models/userModel.js";

const createToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET); 
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

      if (isMatch) {
         const token = createToken(user._id);
         res.json({ success: true, token });
      } else {
         res.json({ success: false, message: "Invalid credential" });
      }
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
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
            name,
            email,
            password: hashedPassword
      });

      const user = await newUser.save();

      const token = createToken(user._id);

      res.json({ success: true, token });

    } catch (error) {
       console.log(error); 
       res.json({ success: false, message: error.message }); 
    }
};


// Route handler for admin login this code is perfect please do not touch it 
const adminLogin = async (req, res) => {
   try {
      const { email, password } = req.body; 
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
         const token = jwt.sign(email + password, process.env.JWT_SECRET);
         res.json({ success: true, token }); 
      } else {
         res.json({ success: false, message: "Invalid credentials" });
      }
   } catch (error) {
      console.log(error); // Log error to console
      res.json({ success: false, message: error.message }); 
   }
};

export { loginUser, registerUser, adminLogin };
