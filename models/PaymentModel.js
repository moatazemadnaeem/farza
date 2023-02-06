const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema(
  {
    userId:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    tran_ref:{
        type:String,
       
    },
    orderId:{
        type:String,
        required:true
    },
    tran_total:{
        type:String,
      
    },
    tran_currency:{
        type:String,
        default:'EGP'
    },
    customer_details:{
        type:Object,
    },
    shipping_details:{
        type:Object,
    },
    futureDate:{
        type:Date,
    },
    payment_result:{
        type:Object,
        required:true
    },
    msg:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    lon:{
        type:Number,
        required:true
    },
    lat:{
        type:Number,
        required:true
    },
  },
  { timestamps: true }
);

const Payment=mongoose.model("Payment", PaymentSchema);

module.exports = {Payment};