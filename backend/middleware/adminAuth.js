import jwt from 'jsonwebtoken'
// Middleware function to authenticate admin users
const adminAuth = async (req, res, next) => {
   try {
      const {token} = req.headers;

      if (!token) {
         return res.json({ success: false, message: "Not Authorized. Login Again" });
      }
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);

      if (token_decode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
         return res.json({ success: false, message: "Not Authorized. Login Again." });
      }
      next();

   } catch (error) {
      console.log("Admin authentication error:", error);
      return res.json({ success: false, message: "Authentication failed. Login Again." });
   }
};

export default adminAuth;



