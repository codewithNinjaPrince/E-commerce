import jwt from "jsonwebtoken";

// const authUser = (req, res, next) => {
//   try {
//     let token = req.headers.token || req.headers.authorization;

//     if (!token)
//       return res.status(401).json({ success: false, message: "Not authorized. Login again" });

//     // If Bearer token format
//     if (token.startsWith("Bearer "))
//       token = token.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Your token contains `id`, NOT `_id`
//     req.userId = decoded.id;     
//     req.body.userId = decoded.id;

//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };

const authUser = (req, res, next) => {
  try {

    let token = req.headers.token || req.headers.authorization;
    console.log("RAW TOKEN:", token);

    if (!token) {
      console.log("Not Authorized");
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


export default authUser;
