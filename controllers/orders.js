const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')
const mongoose =require('mongoose')
const {Orders,expireTable}=require('../models/Order')
const {Products} =require('../models/Products')
const {order_status}=require('../types/status')


module.exports={
    create_order:async(req,res)=>{
        //1- once he click pay button 
        //2- client will send me the list of products that a user wants to purshase
        //3- I will create an order for that it is expires at some point of time lets says for 10 min 
        //4- He must pay in this range to avoid un expected behaviour
        //5- to do that we will need redis and bull 
        const data=req.body;

        if(data.userId!==req.currentUser.id){
            throw new NotAuth()
        }
        if(!data.products||data.products.length===0||!data.address||!data.total_amount){
            throw new BadReqErr()
        }
        //create new order with the data
        //then we will push a job to a queue
        //then we will mark the status to awaiting 
        //if everything went ok then we will mark it to success
        //but there is a problem we know that we have a list of products and each product have a quantity for it and when a user make an order 
        //for some product while another user making a payment we need to make sure that the product is not reserved
        let error_message=false
        for(let i=0;i< data.products.length;i++){
            const item=data.products[i]
            const q1= item.quantity
            //the quantity that a person trying to purchase
            let product_found=false;
            try{
                product_found=await Products.findById(item.productId)
            }catch(err){
                error_message={statusCode:400,status:false,msg:err.message}
                break;
            }

            if(!product_found){
                error_message={statusCode:404,status:false,msg:'this product is not found',item}
                break;
            }

            if(product_found.reserved){
                error_message={statusCode:400,status:false,msg:'the product is already reserved',item}
                break;
            }

            const q2=product_found.fake_quantity
            //total
            
            if(q1>q2){
                
                error_message={statusCode:400,status:false,msg:'you are trying to purchase too many items from this product but the store does not have those many items',item}
                // console.log(error_message)
                break;
            }
           
            if(q1===q2){
                //the sub is should happen when we success purshase
                product_found.set({fake_quantity:q2-q1})
                product_found.set({reserved:true})
                await product_found.save()
            }

            if(q2>q1){
                product_found.set({fake_quantity:q2-q1})
                product_found.set({reserved:false})
                await product_found.save()
            }
        }
      
        //list of products now are reserved by current user
        //now lets make an order
        // console.log(error_message)
        if(error_message){
          return res.status(error_message.statusCode).send(error_message)
        }
        // const expiration=new Date()
        // expiration.setSeconds(expiration.getSeconds())
        const order= await Orders.create({
            userId:req.currentUser.id,
            products:data.products,
            total_amount: data.total_amount,
            address: data.address,
            status: order_status.AwaitingPayment,
        })
        await expireTable.create({
            _id:order._id
        })
        return res.status(201).send({status:true,order})
       
    }
 
}