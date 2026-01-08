import axios from "axios";
import { getShiprocketToken } from "./shipRocket.js";
// ---------------- CREATE PICKUP ----------------
export const createPickupLocation = async (merchant) => {
  const token = await getShiprocketToken();

  const payload = {
    pickup_location: merchant.storeName,
    name: merchant.address.contactName,
    email: merchant.email,
    phone: merchant.address.contactPhone,
    address: merchant.address.line1,
    address_2: merchant.address.line2 || "",
    city: merchant.address.city,
    state: merchant.address.state,
    country: merchant.address.country || "India",
    pin_code: merchant.address.pincode,
  };

  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/settings/company/addpickup",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// ---------------- UPDATE PICKUP ----------------
export const updatePickupLocation = async (merchant) => {
  const token = await getShiprocketToken();

  const payload = {
    pickup_location: merchant.shiprocket.pickupCode, // required
    name: merchant.address.contactName,
    email: merchant.email,
    phone: merchant.address.contactPhone,
    address: merchant.address.line1,
    address_2: merchant.address.line2 || "",
    city: merchant.address.city,
    state: merchant.address.state,
    country: merchant.address.country || "India",
    pin_code: merchant.address.pincode,
  };

  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/settings/company/updatepickup",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
