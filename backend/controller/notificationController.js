import notificationModel from "../models/notificationModel.js";

export const getMerchantNotifications = async (req, res) => {
  try {
    const merchantId = req.merchant;

    const notifications = await notificationModel
      .find({ merchantId })
      .sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Mark all read
export const markAllRead = async (req, res) => {
  try {
    const merchantId = req.merchant;

    await notificationModel.updateMany(
      { merchantId },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete single notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.body;

    await notificationModel.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
