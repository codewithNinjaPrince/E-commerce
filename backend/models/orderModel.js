import mongoose from 'mongoose'

const orderSchema= new mongoose.Schema({
   userId:{type:String,required:true},
   items:{type:Array,required:true},
   amount:{type:Number,required:true},
   address:{type:Object,required:true},
   status:{type:String,required:true,default:'Order Placed'},
   paymentMethod:{type:String,required:true},
   payment:{type:Boolean,required:true,default:false},
   sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
   shopId: { type: String, required: true },
   date:{type:Number,required:true}
})

const orderModel=mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;
