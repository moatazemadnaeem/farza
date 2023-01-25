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
       
    },
    get_awaiting_delivering_orders:async(req,res)=>{
        try{
            const orders=await Orders.find({status:'awaiting-delivering'})
            return res.send({status:true,orders})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    mark_order_as_delivered:async(req,res)=>{
        const {orderId}=req.body;
        if(!orderId){
            throw new BadReqErr('please provide order id')
        }
        try{
            const order=await Orders.findById(orderId)
            if(!order){
                throw new notfound('can not find this order')
            }
            order.set({status:order_status.Delivered})
            await order.save()
            return res.send({status:true,order})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    cancell_by_user:async(req,res)=>{
        const {orderId}=req.body;
        if(!orderId){
            throw new BadReqErr('please provide order id')
        }
        try{
            const order=await Orders.findById(orderId)
            if(!order){
                throw new notfound('can not find this order')
            }
            order.set({status:order_status.CancelledByUser})
            await order.save()
            return res.send({status:true,order})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    cancell_by_admin:async(req,res)=>{
        const {orderId}=req.body;
        if(!orderId){
            throw new BadReqErr('please provide order id')
        }
        try{
            const order=await Orders.findById(orderId)
            if(!order){
                throw new notfound('can not find this order')
            }
            order.set({status:order_status.REJECTED})
            await order.save()
            return res.send({status:true,order})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    get_all_orders_by_user:async(req,res)=>{
        try{
            const orders=await Orders.find({userId:req.currentUser.id})
            if(!orders){
                throw new notfound('can not find orders for this user')
            }
          
            return res.send({status:true,orders})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
 
}