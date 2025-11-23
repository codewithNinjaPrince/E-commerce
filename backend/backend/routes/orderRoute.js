import express from 'express'
import orderController from '../controller/orderController.js'
const {placeOrder,placeOrderRazorpay,placeOrderCashfree,allOrders,userOrders,updateStatus,verifyCashfree}=orderController
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter=express.Router()

//Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/cashfree',authUser,placeOrderCashfree)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

//User feature
orderRouter.post('/userorders',authUser,userOrders)

//verify payment
orderRouter.post('/verifyCashfree',authUser,verifyCashfree)

export default orderRouter
