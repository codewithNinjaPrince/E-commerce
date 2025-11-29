import merchantModel from "../models/merchantModel.js";

/**
 * GET MERCHANT PAYMENTS / WALLET INFO
 * Route: GET /api/merchant/payments
 */
export const getPayments = async (req, res) => {
  try {
    const merchantId = req.merchant;

    const merchant = await merchantModel.findById(merchantId).select(
      "earningsAvailable earningsWithdrawn totalRevenue"
    );

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    res.json({
      success: true,
      wallet: {
        available: merchant.earningsAvailable,
        withdrawn: merchant.earningsWithdrawn,
        totalRevenue: merchant.totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching payments info",
    });
  }
};

/**
 * REQUEST WITHDRAWAL
 * Route: POST /api/merchant/payments/withdraw
 * Body: { amount }
 */
export const withdrawRequest = async (req, res) => {
  try {
    const merchantId = req.merchant;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.json({
        success: false,
        message: "Invalid withdrawal amount",
      });
    }

    // Fetch Merchant
    const merchant = await merchantModel.findById(merchantId);

    if (!merchant) {
      return res.json({
        success: false,
        message: "Merchant not found",
      });
    }

    // Check if enough balance
    if (amount > merchant.earningsAvailable) {
      return res.json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Simulated withdrawal process (will replace later with RazorpayX / Cashfree Payout)
    merchant.earningsAvailable -= amount;
    merchant.earningsWithdrawn += amount;

    await merchant.save();

    res.json({
      success: true,
      message: "Withdrawal request submitted",
      updatedWallet: {
        available: merchant.earningsAvailable,
        withdrawn: merchant.earningsWithdrawn,
        totalRevenue: merchant.totalRevenue,
      },
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message || "Unable to process withdrawal",
    });
  }
};
