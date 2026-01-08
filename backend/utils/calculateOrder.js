import productModel from "../models/productModel.js";

const extractDiscountPercent = (code = "") => {
  const match = code.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const calculateOrder = async ({
  items,
  couponCode,
  user,
  paymentMethod,
  includeCodFee = false,
}) => {
  let actualTotal = 0;
  let discountedTotal = 0;
  let finalTotal = 0;
  let couponUsed = false;

  const appliedCoupon = couponCode?.toUpperCase() || null;
  const calculatedItems = [];

  for (const cartItem of items) {
    const product = await productModel.findById(cartItem.productId);
    if (!product) continue;

    const actualPrice = product.actualPrice;
    const basePrice = product.discountedPrice;

    let finalPricePerUnit = basePrice;
    let couponApplied = false;

    actualTotal += actualPrice * cartItem.quantity;
    discountedTotal += basePrice * cartItem.quantity;

    // ✅ COUPON APPLY (SAFE)
    if (
      appliedCoupon &&
      product.offerCode &&
      product.offerCode.toUpperCase() === appliedCoupon &&
      !user.usedCoupons.includes(appliedCoupon)
    ) {
      const discountPercent = extractDiscountPercent(appliedCoupon);

      // 🔒 HARD LIMIT (business rule)
      if (discountPercent > 0 && discountPercent <= 50) {
        finalPricePerUnit = Math.round(
          basePrice - (basePrice * discountPercent) / 100
        );

        couponApplied = true;
        couponUsed = true;
      }
    }

    finalTotal += finalPricePerUnit * cartItem.quantity;

    calculatedItems.push({
      productId: product._id,
      sellerId: product.sellerId,
      name: product.name,
      size: cartItem.size,
      quantity: cartItem.quantity,

      actualPrice,
      discountedPrice: basePrice,
      finalPrice: finalPricePerUnit,

      offerCode: product.offerCode,
      couponApplied,
      image: product.image,
      itemStatus: "Order Placed",
    });
  }

  /* ================= FEES ================= */
  /* ================= DELIVERY FEE SYSTEM ================= */

  let deliveryFee = 0;

  if (finalTotal >= 1000) deliveryFee = 0;
  else if (finalTotal >= 600) deliveryFee = 19;
  else if (finalTotal >= 300) deliveryFee = 29;
  else deliveryFee = 39;
  const codFee = paymentMethod === "cod" ? 9 : 0;

  console.log("PAYMENT METHOD:", paymentMethod);
  console.log("COD FEE:", codFee);

  const discountAmount = discountedTotal - finalTotal;

  return {
    items: calculatedItems,

    actualTotal,
    discountedAmount: finalTotal,

    discountAmount,

    deliveryFee,
    codFee,
    payableAmount: finalTotal + deliveryFee + codFee,

    couponUsed,
  };
};
