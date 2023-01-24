const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')
const {Carts}=require('../models/Cart')
const {Products}=require('../models/Products')
module.exports={

    addCartItems:async(req,res)=>{
        try{

            const data=req.body;//products
            if(data.userId!==req.currentUser.id){
                throw new NotAuth('not auth')
            }
           
            if(!data.products||data.products.length===0){
                throw new BadReqErr('provide valid product')
            }
            
            const count=await Carts.find({userId:data.userId}).count()
            if(count===0){
               await Carts.create({
                    userId:data.userId,
                    products:[]
                }) 
            }

            const fetchCurrentUserCart=await Carts.findOne({userId:data.userId})
            console.log(fetchCurrentUserCart)

            for(let i=0;i<data.products.length;i++){
                const item=data.products[i];
                let foundItem =false;
                fetchCurrentUserCart.products.forEach((element)=>{
                    if(element.productId===pId){
                        foundItem=true
                    }
                })
                if(foundItem){
                    throw new BadReqErr('you can not add item already added in the cart')
                }else{
                    fetchCurrentUserCart.products.push(item)
                    await fetchCurrentUserCart.save()
                }
            }
    
           return res.status(201).send({status:true,msg:'product added to cart'})
        }catch(err){
            throw new BadReqErr(err.message)
        }

    },
    getCartItems:async(req,res)=>{
        try{
            const fetchCurrentUserCart=await Carts.findOne({userId:req.currentUser.id})
            if(!fetchCurrentUserCart){
                throw new BadReqErr('cart is not created or not found')
            }
            return res.status(200).send({status:true,Products:fetchCurrentUserCart[0].products})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    deleteCartItems:async(req,res)=>{
        try{

            const {ItemId}=req.body
            if(!ItemId||typeof(ItemId)!=='string'||ItemId.length===0){
                throw new BadReqErr()
            }
            const found=await Carts.findOne({userId:req.currentUser.id})
            if(found){
               const newProducts=found.products.filter((item)=>{
                if(item._id.toString()!==ItemId){
                    return item
                }
                })
                
                found.products=newProducts;
                await found.save()
            }else{
                throw new BadReqErr('can not find the cart for this user')
            }
            return res.status(200).send({status:true,msg:'product removed from the cart'})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    clearAllCart:async(req,res)=>{
        try{
            const found=await Carts.findOne({userId:req.currentUser.id})
            if(found){
                found.products=[];
                await found.save()
            }else{
                throw new BadReqErr('can not find the cart for this user')
            }
            return res.status(200).send({status:true,msg:'all products in the cart cleared'})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    doQuantity:async(req,res)=>{
        try{

            const {ItemId,count}=req.body
            if(!ItemId||typeof(ItemId)!=='string'||ItemId.length===0||!count||typeof(count)!=='number'||count===0){
                throw new BadReqErr('please check your inputs')
            }
            const found=await Carts.findOne({userId:req.currentUser.id})
            if(found){
                let p=[]
                for(let i=0;i<found.products.length;i++){
                    const item=found.products[i];
                    if(item._id.toString()===ItemId){
                        p.push({...item,quantity:count});
                    }else{
                        p.push(item);
                    }
                }
                found.products=p;
                await found.save()
            }else{
                throw new BadReqErr('can not find the cart for this user')
            }
            return res.status(200).send({status:true,msg:'the quantity is set now'})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
   
}