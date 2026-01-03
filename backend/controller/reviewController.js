import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

/* ----------------------------------------
   1️⃣ ADD REVIEW
---------------------------------------- */
export const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, reviewText, title, images = [] } = req.body;
    const userId = req.userId;

    const order = await Order.findOne({
      _id: orderId,
      userId,
      "items.productId": productId,
      status: "Delivered",
    });

    if (!order)
      return res.json({ success: false, message: "Review not allowed" });

    const review = await Review.create({
      productId,
      orderId,
      userId,
      rating,
      title,
      reviewText,
      images,
      editableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Update product rating cache
    const product = await Product.findById(productId);
    product.ratingCount += 1;
    product.ratingBreakdown[rating] += 1;

    const total =
      product.ratingBreakdown[1] * 1 +
      product.ratingBreakdown[2] * 2 +
      product.ratingBreakdown[3] * 3 +
      product.ratingBreakdown[4] * 4 +
      product.ratingBreakdown[5] * 5;

    product.ratingAvg = (total / product.ratingCount).toFixed(1);
    await product.save();

    res.json({ success: true, reviewId: review._id });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/* ----------------------------------------
   2️⃣ GET PRODUCT REVIEWS
---------------------------------------- */
export const getProductReviews = async (req, res) => {
  const { productId, sort = "recent" } = req.body;

  const sortMap = {
    recent: { createdAt: -1 },
    high: { rating: -1 },
    low: { rating: 1 },
    helpful: { helpfulCount: -1 },
  };

  const reviews = await Review.find({
    productId,
    status: "active",
  }).sort(sortMap[sort] || sortMap.recent);

  res.json({ success: true, reviews });
};

/* ----------------------------------------
   3️⃣ UPDATE REVIEW (7 days)
---------------------------------------- */
export const updateReview = async (req, res) => {
  const { reviewId, rating, reviewText, title, images } = req.body;
  const userId = req.userId;

  const review = await Review.findOne({
    _id: reviewId,
    userId,
    editableUntil: { $gt: new Date() },
  });

  if (!review)
    return res.json({ success: false, message: "Edit not allowed" });

  review.rating = rating ?? review.rating;
  review.reviewText = reviewText ?? review.reviewText;
  review.title = title ?? review.title;
  review.images = images ?? review.images;

  await review.save();
  res.json({ success: true });
};

/* ----------------------------------------
   4️⃣ REPORT REVIEW
---------------------------------------- */
export const reportReview = async (req, res) => {
  const { reviewId } = req.body;

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { reportedCount: 1 } },
    { new: true }
  );

  if (review.reportedCount >= 5) {
    review.status = "hidden";
    await review.save();
  }

  res.json({ success: true });
};

/* ----------------------------------------
   5️⃣ MARK REVIEW HELPFUL 👍
---------------------------------------- */
export const markReviewHelpful = async (req, res) => {
  const { reviewId } = req.body;

  await Review.findByIdAndUpdate(reviewId, {
    $inc: { helpfulCount: 1 },
  });

  res.json({ success: true });
};

/* ----------------------------------------
   6️⃣ GET USER REVIEWS
---------------------------------------- */
export const getUserReviews = async (req, res) => {
  const userId = req.userId;

  const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
  res.json({ success: true, reviews });
};

/* ----------------------------------------
   7️⃣ MERCHANT REPLY
---------------------------------------- */
export const merchantReply = async (req, res) => {
  const { reviewId, message } = req.body;

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, "merchantReply.message": { $exists: false } },
    {
      merchantReply: {
        message,
        repliedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!review)
    return res.json({ success: false, message: "Reply not allowed" });

  res.json({ success: true });
};

/* ----------------------------------------
   8️⃣ GET MERCHANT REVIEWS
---------------------------------------- */
export const getMerchantReviews = async (req, res) => {
  try {
    const products = await Product.find(
      { merchantId: req.merchantId },
      { _id: 1 }
    );

    if (!products.length) {
      return res.json({ success: true, reviews: [] });
    }

    const productIds = products.map(p => p._id);

    const reviews = await Review.find({
      productId: { $in: productIds },
    }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


/* ----------------------------------------
   9️⃣ ADMIN – GET REPORTED REVIEWS
---------------------------------------- */
export const adminGetReportedReviews = async (req, res) => {
  const reviews = await Review.find({
    reportedCount: { $gt: 0 },
  }).sort({ reportedCount: -1 });

  res.json({ success: true, reviews });
};

/* ----------------------------------------
   🔟 ADMIN – UPDATE REVIEW STATUS
---------------------------------------- */
export const adminUpdateReviewStatus = async (req, res) => {
  const { reviewId, status } = req.body;

  await Review.findByIdAndUpdate(reviewId, { status });
  res.json({ success: true });
};
