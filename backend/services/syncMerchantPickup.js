import { createPickupLocation, updatePickupLocation } from "./shipRocketPickup.js";
import merchantModel from "../models/merchantModel.js";

export const syncMerchantPickup = async (merchant) => {
  console.log("🚚 SYNC PICKUP STARTED FOR:", merchant._id);

  try {
    // If no pickup yet → CREATE
    if (!merchant.shiprocket?.pickupLocationId) {
      const res = await createPickupLocation(merchant);

      if (res?.success) {
        merchant.shiprocket = {
          pickupLocationId: res.pickup_id,
          pickupCode: res.pickup_location,
          syncedAt: new Date(),
        };
        await merchant.save();
      }
    }

    // If pickup exists → UPDATE
    else {
      const res = await updatePickupLocation(merchant);

      if (res?.success) {
        merchant.shiprocket.syncedAt = new Date();
        await merchant.save();
      }
    }
  } catch (err) {
    console.error("SHIPROCKET PICKUP SYNC ERROR:", err.message);
    // ❗ Do NOT block KYC because of courier failure
  }
};
