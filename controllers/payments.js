const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')
const {Orders} =require('../models/Order')
const {order_status}=require('../types/status')
const {AxiosInstancePayment} =require('../axiosConfig')
module.exports={
    create_payment:async(req,res)=>{
       const {orderId}=req.body;
       if(!orderId){
        throw new BadReqErr('Inputs are not valid please check it again')
       }

       try{
       const order= await Orders.findOne({_id:orderId})
       if(order.status===order_status.Cancelled){
        throw new BadReqErr('this order is cancelled please order it again')
       }
       const {products,address,total_amount}=order
        
        const paymentRes= await AxiosInstancePayment.post('https://secure-egypt.paytabs.com/payment/request',{
            "profile_id":process.env.MERCHANT_FARZA_ID,
            "tran_type": "sale",
            "tran_class": "ecom" ,
            "cart_id":orderId,
            "cart_description": `Order for ${req.currentUser.id}`,
            "cart_currency": "EGP",
            "cart_amount": total_amount,
            "callback": "https://farza-e-commerce.herokuapp.com/api/payments/get-payment",
            "customer_details": {
                "address": address,
            }
       })
       
        if(paymentRes?.data){
            console.log(paymentRes.data)
            res.send(paymentRes.data)
        }else{
            throw new BadReqErr('something went wrong while preparing the payment link')
        }
       }
       catch(err){  
        throw new BadReqErr(err.message)
       }
    },
    get_payment:async(req,res)=>{
       
        console.log(req)
        res.send({
            req,
            body:req.body
        })
       
    }
}