import axios from "axios";

const sendSms = async (phone, message) => {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",          // ✅ CHEAP OTP ROUTE
        message,
        language: "english",
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "SMS SEND ERROR:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send SMS");
  }
};

export default sendSms;
