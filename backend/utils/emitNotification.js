import { io } from "../server.js";

export const emitMerchantNotification = (merchantId, payload) => {
  io.to(merchantId).emit("NEW_NOTIFICATION", payload);
};
