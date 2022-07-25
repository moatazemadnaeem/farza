const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const mongoose =require('mongoose')
const {Products}=require('../models/Products')
const {Seller} =require('../models/Seller')

module.exports={
    add_seller_product:async(req,res)=>{
        const {sellerId,...data}=req.body;
        //console.log(data,req.files)
        if(!sellerId||!data||!data.title||!data.price||!data.desc||!req.files||!data.categories||!data.quantity){
            throw new BadReqErr('Inputs are not valid please check it again')
        }

        try{
           const customId=new mongoose.Types.ObjectId().toHexString()
           const seller= await Seller.findById(sellerId)
           if(!sellerId){
            throw new notfound()
           }
           const img=req.files.img;
          
           data.img=img.name;
           if(!(typeof(data.categories)==="object")){
               data.categories=JSON.parse(data.categories)
           }
           if(!(typeof(data.price)==="number")){
               data.price=Number(data.price);       
           }
           //product id
           data._id=customId;

           const imgPathVar=`https://farza-e-commerce.herokuapp.com/static/${req.currentUser.id}/Sellers/${seller._id}/Products/${customId}/${img.name} `
           
           data.imgPath=imgPathVar;
           //company
           data.userId=req.currentUser.id
           //branch
           data.sellerId=sellerId
           //quantity
           data.fake_quantity=data.quantity

           const product= await Products.create(data)

           img.mv(`./images/${req.currentUser.id}/Sellers/${seller._id}/Products/${customId}/`+ img.name)

           res.send({status: true,product});
        }catch(err){
            throw new BadReqErr(err.message)
        }
        
    },
    list_all_products:async(req,res)=>{
        try{
            const data=await Products.find({})
            res.send({status:true,products:data})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    list_all_products_based_on_categories:async(req,res)=>{
        const {targetCategories}=req.body
        if(!targetCategories||typeof(targetCategories)!=='object'){
            throw new BadReqErr('Inputs are not valid please check it again')
        }
        try{
            //if one element in categories in the product exist in the target 
            const data=await Products.find({categories:{
                $all:targetCategories
            }})
            
            
            res.send({status:true,products:data})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
}
