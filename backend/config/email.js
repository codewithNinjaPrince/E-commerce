import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Brevo
  port: process.env.EMAIL_PORT,
  secure: false, // true only for 465
  auth: {
    user: process.env.EMAIL_USER, // Brevo SMTP login
    pass: process.env.EMAIL_PASS, // Brevo SMTP key
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ Brevo SMTP error:", err);
  } else {
    console.log("✅ Brevo SMTP connected (OTP ready)");
  }
});

export default transporter;

