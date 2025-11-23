import express from "express";
import Email from "../models/emailModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check for duplicates
    const exists = await Email.findOne({ email });

    if (exists) {
      return res.status(409).json({
        message: "Email already subscribed",
      });
    }

    // Save email
    await Email.create({ email });

    res.json({ message: "Subscribed successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
