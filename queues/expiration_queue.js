const  Queue  =require("bull") ;
const {Orders}=require('../models/Order')
const {order_status}=require('../types/status')
const {Products}=require('../models/Seller')
const expirationQueue=new Queue('order:expiration',{
    redis:{
        host:process.env.REDIS_HOST
    }
})

expirationQueue.process(async(job)=>{
    console.log('expiration is completed',job.data.orderId)
    const order= Orders.findById(job.data.orderId)
    order.set({status:order_status.Cancelled})
    await order.save()
    for(let i=0;i< job.data.products.length;i++){
        const item=job.data.products[i]
        const product_found=await Products.findById(item.productId)
        if(!product_found){
            console.log('product not found')
        }
        product_found.set({reserved:false})
        product_found.set({fake_quantity:product_found.quantity})
        await product_found.save()
    }
    
})
module.exports={expirationQueue} 
