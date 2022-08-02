const mongoose = require("mongoose");
// const {mongooseEventsSerialPlugin,EventNames} =require("mongoose-events");
const expiration=new Date()
expiration.setSeconds(expiration.getSeconds())
const {order_status} =require('../types/status')
const {Products}=require('./Products')
const OrderSchema = new mongoose.Schema(
  {
    //the user that trying to make the order
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
        //make sure if an product is reserved or not
        reserved:{
          type: Boolean,
        }
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
    status: { 
        type: String,
        enum:Object.values(order_status),
        default: order_status.Created
    },
    // expiresAt:{
    //   type:Date,
    //   expires:60
    // }
  },
  { timestamps: true }
);
const expireSchema = new mongoose.Schema({
  createdAt: { type: Date, default: expiration, expires: 60 },
  orderId: { type:mongoose.Schema.Types.ObjectId, ref: 'order_id'}
});
const Orders=mongoose.model("Order", OrderSchema);
const expireTable = mongoose.model('order_expire', expireSchema);

const orderDel = expireTable.watch()
orderDel.on('change',async (change) => {
  const doc=JSON.parse(JSON.stringify(change))
  if(doc.operationType==='delete'){
      try{
        const order= await Orders.findById(doc.documentKey._id)
        if(!order){
          console.log('order expire not found')
        }
        
        order.set({status:order_status.Cancelled})
        await order.save()

        const products=order.products;
        console.log(products)
        for(let i=0;i<products.length;i++){
          const item=products[i]
          
         const __product= await Products.findById(item.productId)
         
         __product.set({fake_quantity:__product.quantity})
         __product.set({reserved:false})
          await __product.save()
        }

      }catch(err){
        console.log(err.message)
      }
  }
})

module.exports = {Orders,expireTable};