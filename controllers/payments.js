const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')
const {Orders} =require('../models/Order')
const {order_status}=require('../types/status')
const {AxiosInstancePayment} =require('../axiosConfig')
const {Products} =require('../models/Products')
const {Payment}=require('../models/PaymentModel')
module.exports={
    create_payment:async(req,res)=>{
       const {orderId}=req.body;
       if(!orderId){
        throw new BadReqErr('Inputs are not valid please check it again')
       }

       try{
       const order= await Orders.findOne({_id:orderId})
        if(order.status!==order_status.AwaitingPayment){
        throw new BadReqErr('this order is cancelled please order it again')
        }
       const {total_amount,products,address,mobile,userId}=order
       let error_message=false
       for(let i=0;i< products.length;i++){
            const item=products[i]
            //the quantity that a person trying to purchase
            const q1= item.quantity
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
            //fake quantity = real quantity
            const q2=product_found.fake_quantity
        
            if(q1>q2){
                error_message={statusCode:400,status:false,msg:'you are trying to purchase too many items from this product but the store does not have those many items',item}
                break;
            }
            if(q1<=0){
                error_message={statusCode:400,status:false,msg:'You ordered zero product please try to add a product',item}
                break;
            }
            if(q1===q2){
                //the sub is should happen when we success purshase
                product_found.set({fake_quantity:q2-q1})
                product_found.set({quantity:q2-q1})
                product_found.set({reserved:true})
                await product_found.save()
            }
            if(q2>q1){
                product_found.set({fake_quantity:q2-q1})
                product_found.set({quantity:q2-q1})
                product_found.set({reserved:false})
                await product_found.save()
            }
       }
     
       if(error_message){
         return res.status(error_message.statusCode).send(error_message)
       }
        const paymentRes= await AxiosInstancePayment.post('https://secure-egypt.paytabs.com/payment/request',{
            "profile_id":process.env.MERCHANT_FARZA_ID,
            "tran_type": "sale",
            "tran_class": "ecom" ,
            "cart_id":orderId,
            "cart_description": `Order for ${req.currentUser.id}`,
            "cart_currency": "EGP",
            "cart_amount": total_amount,
            "callback": "https://mushy-cow-lapel.cyclic.app/api/payments/get-payment"
        })
       
        order.set({status:order_status.AwaitingDelivering})
        await order.save()
        return res.send({status:true,order})
       }
       catch(err){  
        throw new BadReqErr(err.message)
       }
    },
    get_payment:async(req,res)=>{
       
       const data=req.body;
       console.log('data ==>',data)

       const {tran_ref,cart_id,tran_total,customer_details,shipping_details,payment_result}=data;

       if(payment_result?.response_status==='A'){
        //Run inside if the transaction done perfectly
        const order= await Orders.findOne({_id:cart_id})
        const {userId,mobile}=order;
        order.set({status:order_status.Success})
        await order.save()
        const products=order.products;
        for(let i=0;i<products.length;i++){
          const item=products[i]
          
         const __product= await Products.findById(item.productId)
         
         __product.set({quantity:__product.fake_quantity})
         __product.set({reserved:false})
          await __product.save()
        }
        await Payment.create({userId,mobile,tran_ref,orderId:cart_id,tran_total,customer_details,shipping_details,payment_result,msg:'You paid successfully for this order please wait for the shiping.'})
       }
       if(payment_result?.response_status==='C'){
        //which means its cancelled 
        try{
            const order= await Orders.findOne({_id:cart_id})
            const {userId,mobile}=order;
            order.set({status:order_status.Cancelled})
            await order.save()
            const products=order.products;
            for(let i=0;i<products.length;i++){
              const item=products[i]
              
             const __product= await Products.findById(item.productId)
             
             __product.set({fake_quantity:__product.quantity})
             __product.set({reserved:false})
              await __product.save()
            }
            await Payment.create({userId,mobile,tran_ref,orderId:cart_id,tran_total,payment_result,msg:'This order is cancelled.'})
        }catch(err){
            console.log(err.message)
        }
     
       }
       return res.status(201).send('everything went okay')
       
    }
}