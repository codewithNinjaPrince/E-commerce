//This middleware is for the user for the cart purposes
// import jwt from 'jsonwebtoken'

// const authUser=async(req,res,next)=>{
//    const {token}=req.headers

//    if(!token){
//       res.json({success:false,message:"Not authorized Login again"})
//    }

//    try {
//       const token_decode=jwt.verify(token,process.env.JWT_SECRET)
//       req.body.userId=token_decode.id
//       next()
//    } catch (error) {
//       console.log(error)
//       res.json({success:false,message:error.message})
      
//    }
// }
// export default authUser

import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    // Accept tokens sent either as headers.token or Authorization Bearer
    let token = req.headers?.token || req.headers?.authorization;

    if (!token) {
      // No token: user is not logged in -> respond with not authorized
      return res.status(401).json({ success: false, message: "Not authorized. Login again" });
    }

    // If header is "Bearer <token>" extract actual token
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    req.user = token_decode; // also expose req.user if needed
    next();
  } catch (error) {
    console.log("authUser error:", error);
    return res.status(401).json({ success: false, message: "Authentication failed. Login again." });
  }
};

export default authUser;
