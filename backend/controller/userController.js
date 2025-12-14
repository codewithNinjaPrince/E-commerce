import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import EmailOtp from "../models/emailOtpModel.js";

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
      res.json({
        success: true,
        token,
        user: {
          firstName: user.firstName,
        },
      });
    } else {
      res.json({ success: false, message: "Invalid username or Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration this code is perfect please do not touch it
// Route for user registration (OTP protected)
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1️⃣ Basic validations
    if (!firstName || !lastName) {
      return res.json({ success: false, msg: "Name is required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        msg: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        msg: "Please enter a strong password",
      });
    }

    // 2️⃣ Check OTP verification
    const otpRecord = await EmailOtp.findOne({
      email,
      verified: true,
    });

    if (!otpRecord) {
      return res.json({
        success: false,
        msg: "Please verify your email with OTP first",
      });
    }

    // 3️⃣ Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        msg: "User already exists",
      });
    }

    // 4️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5️⃣ Create user
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isEmailVerified: true, // ✅ confirmed
    });

    const user = await newUser.save();

    // 6️⃣ Delete OTP record (important)
    await EmailOtp.deleteOne({ email });

    // 7️⃣ Generate token
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};

// Route handler for admin login this code is perfect please do not touch it
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
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
