const mongoose = require("mongoose");
const {order_status} =require('../types/status')
const OrderSchema = new mongoose.Schema(
  {
    //the user that trying to make the order
    userId: { type: String, required: true },
    products: [
      {
        //the company
        userId: { type: String },
        //the branch of the company
        sellerId:{
          type: String,
          required: true
        },
        productId: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        imgPath:{
          type: String,
        },
      },
    ],
    total_amount: { 
        type: Number, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    mobile:{
      type: String, 
      required: true 
    },
    status: { 
        type: String,
        enum:Object.values(order_status),
        default: order_status.Created
    },
    futureDate:{
      type:Date,
    },
  },
  { timestamps: true }
);

const Orders=mongoose.model("Order", OrderSchema);

module.exports = {Orders};