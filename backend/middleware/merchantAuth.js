import jwt from "jsonwebtoken";

export const merchantAuth = (req, res, next) => {
  try {
    let token = req.headers?.authorization || req.headers?.token;

    if (!token)
      return res.status(401).json({ success: false, message: "Not authorized" });

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.merchantId = decoded.id;
    req.merchant = decoded.id; // optional


    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
