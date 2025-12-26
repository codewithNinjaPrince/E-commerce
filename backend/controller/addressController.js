import User from "../models/userModel.js";
import { nanoid } from "nanoid";
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const address = {
      ...req.body,
      addressId: nanoid(), // ✅ FIX
    };

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });


    // If first address, force default
    if (user.addresses.length === 0) {
      address.isDefault = true;
    }

    // If new address marked default → unset others
    if (address.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
      user.selectedAddressId = address.addressId;
    }

    user.addresses.push(address);

    // If no selected address yet
    if (!user.selectedAddressId) {
      user.selectedAddressId = address.addressId;
    }

    await user.save();

    return res.json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
      selectedAddressId: user.selectedAddressId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "addresses selectedAddressId"
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      addresses: user.addresses,
      selectedAddressId: user.selectedAddressId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const address = user.addresses.find(
      (a) => a.addressId === addressId
    );

    if (!address)
      return res.status(404).json({ success: false, message: "Address not found" });

    // If making this address default
    if (updates.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
      user.selectedAddressId = addressId;
    }

    Object.assign(address, updates);

    await user.save();

    return res.json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
      selectedAddressId: user.selectedAddressId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;

    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const index = user.addresses.findIndex(
      (a) => a.addressId === addressId
    );

    if (index === -1)
      return res.status(404).json({ success: false, message: "Address not found" });

    const wasDefault = user.addresses[index].isDefault;

    user.addresses.splice(index, 1);

    // If default deleted → assign first one
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
      user.selectedAddressId = user.addresses[0].addressId;
    }

    // If no addresses left
    if (user.addresses.length === 0) {
      user.selectedAddressId = "";
    }

    await user.save();

    return res.json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
      selectedAddressId: user.selectedAddressId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;

    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    let found = false;

    user.addresses.forEach((a) => {
      if (a.addressId === addressId) {
        a.isDefault = true;
        found = true;
      } else {
        a.isDefault = false;
      }
    });

    if (!found)
      return res.status(404).json({ success: false, message: "Address not found" });

    user.selectedAddressId = addressId;

    await user.save();

    return res.json({
      success: true,
      message: "Default address updated",
      addresses: user.addresses,
      selectedAddressId: user.selectedAddressId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};
