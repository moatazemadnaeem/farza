const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const mongoose =require('mongoose')
const {Products}=require('../models/Products')
const {Seller} =require('../models/Seller')
const {GetRandString}=require('../utils/randomString')
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary}=require('../utils/uploadImg')
module.exports={
    add_seller_product:async(req,res)=>{
        const {sellerId,...data}=req.body;
        //console.log(data,req.files)
        if(!sellerId||!data||!data.title||!data.price||!data.desc||!data.quantity){
            throw new BadReqErr('Inputs are not valid please check it again')
        }

        try{
           const customId=new mongoose.Types.ObjectId().toHexString()
           const seller= await Seller.findById(sellerId)
           if(!seller){
            throw new notfound()
           }
           let img=[];
           if(req.files){
               if(req.files.img.length===undefined){
                   img=[req.files.img];
               }else{
                   img=[...req.files.img];
               }
           }
          
        //    if(!(typeof(data.categories)==="object")){
        //        data.categories=JSON.parse(data.categories)
        //    }
           if(!(typeof(data.price)==="number")){
               data.price=Number(data.price);       
           }
           //product id
           data._id=customId;
           
           data.imgPath=[];
           //company
           data.userId=req.currentUser.id
           //branch
           data.sellerId=sellerId
           //quantity
           data.fake_quantity=data.quantity

           const product= await Products.create(data)
           for(let i=0;i<img.length;i++){
            let item=img[i]
            const fileFormat = item.mimetype.split('/')[1]
            const { base64 } = bufferToDataURI(fileFormat, item.data)
            const imageDetails = await uploadToCloudinary(base64, fileFormat)
            console.log(imageDetails)
            data.imgPath.push(imageDetails.url)
         }
           product.set({imgPath:data.imgPath})
           await product.save()
           res.send({status: true,product});
        }catch(err){
            throw new BadReqErr(err.message)
        }
        
    },
    add_image_product:async(req,res)=>{
        const {productId}=req.body;
        if(!productId){
            throw new BadReqErr('Please provide product Id')
        }
        try{
            const product= await Products.findById(productId)
            if(!product){
                throw new notfound('not found the product')
            }
            let img=[];
            if(req.files){
                if(req.files.img.length===undefined){
                    img=[req.files.img];
                }else{
                    img=[...req.files.img];
                }
            }
            for(let i=0;i<img.length;i++){
                let item=img[i]
                const fileFormat = item.mimetype.split('/')[1]
                const { base64 } = bufferToDataURI(fileFormat, item.data)
                const imageDetails = await uploadToCloudinary(base64, fileFormat)
                console.log(imageDetails)
                product.imgPath.push(imageDetails.url)
                await product.save()
             }
             return res.status(201).send({status:true,images:product.imgPath})
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
