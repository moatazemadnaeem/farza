const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
   
    products: [
      {
         //the company
        userId: { type: String, required: true },
        //the branch of the company
        sellerId:{
          type: String,
          required: true
        },
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        imgPath:{
          type: String,
        },
        reserved:{
          type: Boolean,
        }
      },
    ],
  },
  { timestamps: true }
);

module.exports = {Carts:mongoose.model("Cart", CartSchema)};