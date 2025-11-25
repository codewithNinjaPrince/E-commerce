// middleware/optionalAuth.js
// import jwt from 'jsonwebtoken';

// const optionalAuth = (req, res, next) => {
//   try {
//     let token = req.headers?.token || req.headers?.authorization;
//     if (!token) {
//       // no token — that's fine for public endpoints
//       return next();
//     }
//     if (typeof token === 'string' && token.startsWith('Bearer ')) token = token.split(' ')[1];
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = token_decode;
//     req.body.userId = token_decode.id;
//     return next();
//   } catch (error) {
//     // If token present but invalid, treat it as unauthorized
//     console.log("optionalAuth - invalid token:", error);
//     // You can choose to next() or return 401. We'll next() so public content still loads.
//     return next();
//   }
// };

// export default optionalAuth;
import jwt from "jsonwebtoken";

const optionalAuth = (req, res, next) => {
  try {
    let token = req.headers.token || req.headers.authorization;

    if (!token) {
      req.user = null;  // important!
      return next();
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // user exists
    req.body.userId = decoded.id;

    return next();
  } catch (error) {
    req.user = null;  // invalid token = treat as guest
    return next();
  }
};

export default optionalAuth;

