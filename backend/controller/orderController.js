import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
// import Cashfree from 'node-cashfree';


//Global Variables
const currency='inr'
const deliveryCharge=10

//Gateway Initialize
// const cashfree = new Cashfree({
//   appId: process.env.CASHFREE_APP_ID,
//   secretKey: process.env.CASHFREE_SECRET_KEY,
//   env: "TEST" // or "PROD"
// });


//placing orders using Cod Method
const placeOrder= async(req,res)=>{
     try {
      const{userId,items,amount,address}=req.body

      const orderData={
         userId,
         items,
         amount,
         address,
         paymentMethod:"COD",
         payment:false,
         date:Date.now(),
      }

      const newOrder=new orderModel(orderData)
      await newOrder.save()

      await userModel.findByIdAndUpdate(userId,{cartData:{}})
      res.json({success:true,message:"Order Placed"})
     } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
     }
}

//placing orders using Stripe Method
const placeOrderCashfree= async(req,res)=>{
   try {
      const{userId,items,amount,address}=req.body
      const {origin} =req.headers

      const orderData={
         userId,
         items,
         amount,
         address,
         paymentMethod:"Cashfree",
         payment:false,
         date:Date.now(),
      }

      const newOrder=new orderModel(orderData)
      await newOrder.save()

      const line_items=items.map((item)=>({
         price_data:{
            currency:currency,
            product_data:{
               name:item.name
            },
            unit_amount:item.price*100
         },
         quantity:item.quantity
      }))

      line_items.push({
         price_data:{
            currency:currency,
            product_data:{
               name:'Delivery Charges'
            },
            unit_amount:deliveryCharge*100
         },
         quantity:1
      })

      const session=await cashfree.checkout.sesssions.create({
         success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
         cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
         line_items,
         mode:'payment',
      })
      res.json({success:true,session_url:session.url})

   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
   }

}

//Verify Cashfree

const verifyCashfree=async(req,res)=>{

   const{orderId,success,userId}=req.body

   try {
      if(success==='true'){
         await orderModel.findByIdAndUpdate(orderId,{payment:true})
         await userModel.findByIdAndUpdate(userId,{cartData:{}})
         res.json({success:true});
      }else{
         await orderModel.findByIdAndDelete(orderId)
         res.json({success:false})
      }
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
   }

}

//placing orders using Razorpay Method
const placeOrderRazorpay= async(req,res)=>{

}

//All Orders data for Admin Panel
const allOrders= async(req,res)=>{

   try {
      const orders=await orderModel.find({})
      res.json({success:true,orders})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
   }

}

//User Order data for frontend
const userOrders= async(req,res)=>{
   try {
      
       const {userId}=req.body
       const orders =await orderModel.find({userId})
       res.json({success:true,orders})

   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
   }

}

//Update Order Status from Admin Panel
const updateStatus= async(req,res)=>{
   try {
      const {orderId,status}=req.body
      await orderModel.findByIdAndUpdate(orderId,{status})
      res.json({success:true,message:'Status Updated'})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
      
   }

}

export default {verifyCashfree,placeOrder,placeOrderRazorpay,placeOrderCashfree,allOrders,userOrders,updateStatus}