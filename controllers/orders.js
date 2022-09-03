const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')
const mongoose =require('mongoose')
const {Orders}=require('../models/Order')
const {Products} =require('../models/Products')
const {order_status}=require('../types/status')


module.exports={
    create_order:async(req,res)=>{
        const data=req.body;

        if(data.userId!==req.currentUser.id){
            throw new NotAuth('not authenticated')
        }
        if(!data.products||data.products.length===0||!data.address||!data.total_amount||!data.mobile||data.mobile.length!==11){
            throw new BadReqErr('Inputs are not valid please check it again')
        }
        const order= await Orders.create({
            userId:req.currentUser.id,
            products:data.products,
            total_amount: data.total_amount,
            address: data.address,
            mobile:data.mobile,
            status: order_status.AwaitingPayment,
        })
     
        return res.status(201).send({status:true,order})
       
    }
 
}