import jwt from 'jsonwebtoken'
// Middleware function to authenticate admin users
const adminAuth = async (req, res, next) => {
   try {
      const {token} = req.headers;

      if (!token) {
         return res.json({ success: false, message: "Not Authorized. Login Again" });
      }
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!token_decode.role) {
         return res.json({ success: false, message: "Not Authorized. Login Again." });
      }

      // Allow admin and seller
      if (token_decode.role === "admin" || token_decode.role === "seller") {
         req.user = token_decode;   // Store decoded details for routes
         return next();
      }

      // Otherwise reject
      return res.json({ success: false, message: "Not Authorized. Login Again." });

   } catch (error) {
      console.log("Admin/Seller auth error:", error);
      return res.json({ success: false, message: "Authentication failed. Login Again." });
   }
};

export default adminAuth;
