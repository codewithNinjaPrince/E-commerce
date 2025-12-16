import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import EmailOtp from "../models/emailOtpModel.js";
import PhoneOtp from "../models/phoneOtpModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route handler for user login this function is fine please do not touch it
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.json({
        success: false,
        message: "Email/Phone and password are required",
      });
    }

    const isEmail = validator.isEmail(identifier);

    const user = await userModel.findOne(
      isEmail ? { email: identifier } : { phone: identifier }
    );

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration this code is perfect please do not touch it
// Route for user registration (OTP protected)
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, identifier, password } = req.body;

    let emailOtp = null;
    let phoneOtp = null;

    /* ---------------- 1️⃣ BASIC VALIDATIONS ---------------- */
    if (!firstName || !lastName) {
      return res.json({ success: false, msg: "Name is required" });
    }

    if (!identifier) {
      return res.json({
        success: false,
        msg: "Email or phone is required",
      });
    }

    const isEmail = validator.isEmail(identifier);

    if (!isEmail && !/^[6-9]\d{9}$/.test(identifier)) {
      return res.json({
        success: false,
        msg: "Please enter a valid email or 10 digit phone number",
      });
    }

    if (!password || password.length < 8) {
      return res.json({
        success: false,
        msg: "Please enter a strong password",
      });
    }

    /* ---------------- 2️⃣ OTP VERIFICATION CHECK ---------------- */
    if (isEmail) {
      emailOtp = await EmailOtp.findOne({
        email: identifier,
        verified: true,
      });

      if (!emailOtp) {
        return res.json({
          success: false,
          msg: "Please verify your email with OTP first",
        });
      }
    } else {
      phoneOtp = await PhoneOtp.findOne({
        phone: identifier,
        verified: true,
      });

      if (!phoneOtp) {
        return res.json({
          success: false,
          msg: "Please verify your phone number with OTP first",
        });
      }
    }

    /* ---------------- 3️⃣ CHECK IF USER EXISTS ---------------- */
    const exists = await userModel.findOne(
      isEmail ? { email: identifier } : { phone: identifier }
    );

    if (exists) {
      return res.json({
        success: false,
        msg: "User already exists",
      });
    }

    /* ---------------- 4️⃣ HASH PASSWORD ---------------- */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* ---------------- 5️⃣ CREATE USER ---------------- */
    const newUser = new userModel({
      firstName,
      lastName,
      email: isEmail ? identifier : undefined,
      phone: !isEmail ? identifier : undefined,
      password: hashedPassword,
      isEmailVerified: isEmail,
      isPhoneVerified: !isEmail,
    });

    const user = await newUser.save();

    /* ---------------- 6️⃣ DELETE OTP RECORD ---------------- */
    if (emailOtp) {
      await EmailOtp.deleteOne({ email: identifier });
    }

    if (phoneOtp) {
      await PhoneOtp.deleteOne({ phone: identifier });
    }

    /* ---------------- 7️⃣ GENERATE TOKEN ---------------- */
    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      message: "Registration successful",
      user: {
        firstName: user.firstName,
      },
    });
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
