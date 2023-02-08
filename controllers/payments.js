const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')
const {Orders} =require('../models/Order')
const {order_status}=require('../types/status')
const {AxiosInstancePayment} =require('../axiosConfig')
const {Products} =require('../models/Products')
const {Payment}=require('../models/PaymentModel')
const {user}=require('../models/BaseModel')
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
                // product_found.set({quantity:q2-q1})
                // product_found.set({reserved:true})
                await product_found.save()
            }
            //q1=5 in the store q2=20 result = 15
            if(q2>q1){
                product_found.set({fake_quantity:q2-q1})
                // product_found.set({quantity:q2-q1})
                // product_found.set({reserved:false})
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
        if(paymentRes?.data){
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
       
       const data=req.body;
       console.log('data ==>',data)

       const {tran_ref,cart_id,tran_total,customer_details,shipping_details,payment_result}=data;
       if(payment_result?.response_status==='A'){
        //Run inside if the transaction done perfectly
        const order= await Orders.findOne({_id:cart_id})
        const {userId,mobile}=order;
        order.set({status:order_status.AwaitingDelivering})
        await order.save()
        const products=order.products;
        for(let i=0;i<products.length;i++){
          const item=products[i]
          
         const __product= await Products.findById(item.productId)
         
         __product.set({quantity:__product.fake_quantity})
         if(__product.fake_quantity===0){
          __product.set({reserved:true})
         }else{
          __product.set({reserved:false})
         }
          await __product.save()
        }
        await Payment.create({status:'success',userId,mobile,tran_ref,orderId:cart_id,order,tran_total,customer_details,shipping_details,payment_result,msg:'You paid successfully for this order please wait for the shiping.'})
       }
       else{
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
            await Payment.create({status:'failed',userId,mobile,order,tran_ref,orderId:cart_id,tran_total,payment_result,msg:'This order is cancelled.'})
        }catch(err){
            console.log(err.message)
        }
     
       }
      return res.status(201).send('everything went okay')
    },
    showPaymentForAdmin:async(req,res)=>{
       try{
            const payments=await Payment.find({'payment_result.response_status':'A'})

            if(!payments){
                throw new BadReqErr('can not find payments')
            }
            let shapedPayments=[]
            for(let i=0;i<payments.length;i++){
                const item=payments[i];
                const {mobile,customer_details,lat,lon}=item
                const orderId=item.orderId;
                const order=await Orders.findById(orderId)
                if(order.status===order_status.AwaitingDelivering){
                    const {name}= await user.findById(order.userId)
                    let tempProducts=[]
                    for(let j=0;j<order.products.length;j++){
                        const {productId,quantity}=order.products[j];
                        const PItem=await Products.findById(productId)
                      
                       
                        if(PItem){
                            let lastVideo=PItem.videoPath[PItem.videoPath.length-1]
                            console.log(lastVideo)
                            tempProducts.push({quantity,...PItem.toObject({ virtuals: false }),lastVideo})
                        }
                    }
                    shapedPayments.push({mobile,address:customer_details.address,name,products:tempProducts,lat,lon})
                }
            }
            return res.status(200).send({status:true,payments:shapedPayments})
       }catch(err){
        throw new BadReqErr(err.message)
       }
    },
    PayInCash:async(req,res)=>{
       const {orderId,lon,lat}=req.body;
       if(!orderId||!lon||!lat||typeof lat!=='number'||typeof lon!=='number'){
        throw new BadReqErr('Inputs are not valid please check it again')
       }
       try{
        const order= await Orders.findOne({_id:orderId})
        console.log(order)
         if(order.status!==order_status.AwaitingPayment){
            return res.status(200).send({status:true,msg:order.status})
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
                 error_message={statusCode:400,status:false,msg:'you are trying to purchase too many items from this product but the store does not have those many items or there is someone trying to get this item right now',item}
                 break;
             }
             if(q1<=0){
                 error_message={statusCode:400,status:false,msg:'You ordered zero product please try to add a product',item}
                 break;
             }
             if(q1===q2){
                 //the sub is should happen when we success purshase
                 product_found.set({fake_quantity:q2-q1})
                 // product_found.set({quantity:q2-q1})
                 // product_found.set({reserved:true})
                 await product_found.save()
             }
             //q1=5 in the store q2=20 result = 15
             if(q2>q1){
                 product_found.set({fake_quantity:q2-q1})
                 // product_found.set({quantity:q2-q1})
                 // product_found.set({reserved:false})
                 await product_found.save()
             }
        }
      
        if(error_message){
          return res.status(error_message.statusCode).send(error_message)
        }
        
        order.status=order_status.AwaitingAcceptByAdmin;
        order.lon=lon;
        order.lat=lat;
        // const currentDate = new Date();
        // const futureDate = new Date(currentDate.getTime() + 20 * 60 * 1000);
        // order.set({futureDate:futureDate})
        await order.save()
        return res.status(200).send({status:true,order})
        }
        catch(err){  
         throw new BadReqErr(err.message)
        }
    },
    getAwaitingAccepted:async(req,res)=>{
        try{
            const orders=await Orders.find({status:order_status.AwaitingAcceptByAdmin})
            if(!orders){
                throw new BadReqErr('can not find orders to be accepted')
            }
           
            const o=[]
            for(let i=0;i<orders.length;i++){
                const item=orders[i]
                let products=item.products;
                let tempProducts=[]
                for(let j=0;j<products.length;j++){
                    const {productId,quantity}=products[j];
                    const PItem=await Products.findById(productId)
                    console.log('p its self',PItem)
                    if(PItem){
                        let lastVideo=PItem.videoPath[PItem.videoPath.length-1]
                        tempProducts.push({quantity,...PItem.toObject({ virtuals: false }),lastVideo})
                    }
                }
                o.push({...item.toObject({ virtuals: false }),products:tempProducts})
            }
           
            return res.send({status:true,orders:o})
     
       }catch(err){
        throw new BadReqErr(err.message)
       }
    },
    acceptByAdmin:async(req,res)=>{
        const {orderId}=req.body;
        if(!orderId){
         throw new BadReqErr('Inputs are not valid please check it again')
        }
        try{
            const order=await Orders.findById(orderId)

            if(!order){
                throw new BadReqErr('can not find order')
            }

            const {products,address,mobile,userId,lon,lat}=order
            if(!lat||!lon){
                throw new BadReqErr('there is no lat or lon')
            }
            for(let i=0;i<products.length;i++){
                const item=products[i]
                
               const __product= await Products.findById(item.productId)
               
               __product.set({quantity:__product.fake_quantity})
               if(__product.fake_quantity===0){
                __product.set({reserved:true})
               }else{
                __product.set({reserved:false})
               }
                await __product.save()
            }
            order.status=order_status.AwaitingDelivering;
            await order.save()
            
            const payment=await Payment.create({status:'success',lat,lon,userId,mobile,orderId:order._id,customer_details:{address},payment_result:{'response_status':'A'},msg:'You paid successfully for this order please wait for the shiping.'})

            return res.status(200).send({status:true,order,payment})
       }catch(err){
        throw new BadReqErr(err.message)
       }
    },
    rejectByAdmin:async(req,res)=>{
        const {orderId}=req.body;
        if(!orderId){
         throw new BadReqErr('Inputs are not valid please check it again')
        }
        try{
            const order=await Orders.findById(orderId)
            if(!order){
                throw new BadReqErr('can not find order')
            }
            const {products,address,mobile,userId,lon,lat}=order
            if(!lat||!lon){
                throw new BadReqErr('there is no lat or lon')
            }
            for(let i=0;i<products.length;i++){
                const item=products[i]
                
               const __product= await Products.findById(item.productId)
               
               __product.set({fake_quantity:__product.quantity})
               __product.set({reserved:false})
                await __product.save()
            }
            order.status=order_status.REJECTED;
            await order.save()
            const payment=await Payment.create({status:'failed',lat,lon,userId,mobile,orderId:order._id,customer_details:{address},payment_result:{'response_status':'C'},msg:'You Did not paid for this order please try again.'})

            return res.status(200).send({status:true,order,payment})
       }catch(err){
        throw new BadReqErr(err.message)
       }
    }
}