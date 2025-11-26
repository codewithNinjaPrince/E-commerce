import userModel from "../models/userModel.js"


//Add products to User cart
const addToCart=async(req,res)=>{
   try {
      const{userId,itemId,size}=req.body
      const userData=await userModel.findById(userId)
      let cartData=await userData.cartData;

      if(cartData[itemId]){
         if(cartData[itemId][size]){
            cartData[itemId][size]+=1
         }else{
            cartData[itemId][size]=1
         }
      }else{
         cartData[itemId]={}
         cartData[itemId][size]=1
      }
      await userModel.findByIdAndUpdate(userData,{cartData})
      res.json({success:true,message:"Added to Cart"})

   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
   }
}
//update User cart
const updateCart=async(req,res)=>{
   try {
      const {userId,itemId,size,quantity}=req.body

      const userData=await userModel.findById(userId)
      let cartData= await userData.cartData

      cartData[itemId][size]=quantity

      await userModel.findByIdAndUpdate(userData,{cartData})
      res.json({success:true,message:"Cart Updated"})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
   }

}
//get User cart
const getUserCart=async(req,res)=>{
   try {
      const{userId}=req.body

      if (!userId) {
      return res.json({ success:false, message:"User not authorized" });
      }

      const userData=await userModel.findById(userId)
      if (!userData) {
      return res.json({ success:false, message:"User not found" });
      }

      return res.json({ success:true, cartData:userData.cartData });

   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
   }

}

export {addToCart,updateCart,getUserCart}
