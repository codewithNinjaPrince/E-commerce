import bcrypt from "bcrypt";
import EmailOtp from "../models/emailOtpModel.js";
import transporter from "../config/email.js";
import userModel from "../models/userModel.js";

export const sendOtp = async (req, res) => {
  try {
    const { email, firstName } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser && existingUser.password) {
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please login.",
        code: "EMAIL_EXISTS",
      });
    }

    const lastOtp = await EmailOtp.findOne({ email });

    if (lastOtp && lastOtp.updatedAt > Date.now() - 60 * 1000) {
      return res.status(429).json({
        success: false,
        code: "TOO_MANY_REQUESTS",
        message: "Please wait before requesting another OTP",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await EmailOtp.findOneAndUpdate(
      { email },
      {
        otp,
        expiresAt: expiry,
        verified: false,
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"Brawvly Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Brawvly Verification Code",
      html: `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
    <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:8px; padding:30px;">
      
      <h2 style="color:#111; text-align:center;">Verify your email</h2>
      
      <p style="color:#555; font-size:15px;">
        Hi <b>${firstName || "there"}</b> 👋,<br/><br/>
        Use the OTP below to verify your email address for your <b>Brawvly</b> account.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="
          display:inline-block;
          font-size:32px;
          letter-spacing:6px;
          font-weight:bold;
          color:#111;
          background:#f0f0f0;
          padding:12px 24px;
          border-radius:6px;">
          ${otp}
        </span>
      </div>

      <p style="color:#555; font-size:14px;">
        ⏱ This OTP will expire in <b>5 minutes</b>.<br/>
        🚫 Do not share this code with anyone.
      </p>

      <hr style="margin:30px 0;" />

      <p style="font-size:12px; color:#888; text-align:center;">
        If you didn’t request this, you can safely ignore this email.<br/>
        © ${new Date().getFullYear()} Brawvly
      </p>
    </div>
  </div>
  `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await EmailOtp.findOne({ email });

  if (!record) {
    return res.json({ success: false, message: "OTP not found" });
  }

  if (record.expiresAt.getTime() < Date.now()) {
    return res.json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  record.verified = true;
  await record.save();

  res.json({ success: true, message: "Email verified successfully" });
};

//Forgot Password

export const sendForgotOtp = async (req, res) => {
  try {
    const { email, firstName } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        code: "EMAIL_NOT_FOUND",
        message: "Email not registered",
      });
    }
    const lastOtp = await EmailOtp.findOne({ email });

    if (lastOtp && lastOtp.updatedAt > Date.now() - 60 * 1000) {
      return res.status(429).json({
        success: false,
        code: "TOO_MANY_REQUESTS",
        message: "Please wait before requesting another OTP",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await EmailOtp.findOneAndUpdate(
      { email },
      {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: false,
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
  from: `"Brawvly Support" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Reset your Brawvly password",
  html: `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
    <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:8px; padding:30px;">
      
      <h2 style="color:#111; text-align:center;">Reset your password</h2>
      
      <p style="color:#555; font-size:15px;">
        Hi <b>${firstName || user.firstName || "there"}</b> 👋,<br/><br/>
        Use the OTP below to reset your <b>Brawvly</b> account password.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="
          display:inline-block;
          font-size:32px;
          letter-spacing:6px;
          font-weight:bold;
          color:#111;
          background:#f0f0f0;
          padding:12px 24px;
          border-radius:6px;">
          ${otp}
        </span>
      </div>

      <p style="color:#555; font-size:14px;">
        ⏱ This OTP will expire in <b>5 minutes</b>.<br/>
        🚫 Do not share this code with anyone.
      </p>

      <hr style="margin:30px 0;" />

      <p style="font-size:12px; color:#888; text-align:center;">
        If you didn’t request this password reset, you can safely ignore this email.<br/>
        © ${new Date().getFullYear()} Brawvly
      </p>
    </div>
  </div>
  `,
});


    res.json({ success: true });
  } catch (error) {
    console.error("FORGOT OTP ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyForgotOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await EmailOtp.findOne({ email });

  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    if (!record) {
      return res.status(400).json({
        code: "OTP_NOT_FOUND",
        message: "OTP not found",
      });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        code: "OTP_EXPIRED",
        message: "OTP expired",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        code: "OTP_INVALID",
        message: "Invalid OTP",
      });
    }
  }

  record.verified = true;
  await record.save();

  res.json({ success: true });
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  const otpRecord = await EmailOtp.findOne({ email, verified: true });
  if (!otpRecord) {
    return res.status(400).json({ message: "OTP not verified" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await userModel.updateOne({ email },{ password: hashed, isEmailVerified: true });

  await EmailOtp.deleteOne({ email });

  res.json({ success: true });
};
