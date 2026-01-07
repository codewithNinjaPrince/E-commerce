import axios from "axios";

let cachedToken = null;
let tokenExpiry = null;

export const getShiprocketToken = async () => {
  if (cachedToken && tokenExpiry > Date.now()) {
    return cachedToken;
  }

  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  cachedToken = res.data.token;
  tokenExpiry = Date.now() + 1000 * 60 * 50; // 50 min cache

  return cachedToken;
};
