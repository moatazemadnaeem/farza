const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const mongoose =require('mongoose')
const {Products}=require('../models/Products')
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const {Seller} =require('../models/Seller')
const {GetRandString}=require('../utils/randomString')
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary,uploadVideosToCloudinary}=require('../utils/uploadImg')
module.exports={
    add_seller_product:async(req,res)=>{
        const {sellerId,...data}=req.body;
        //console.log(data,req.files)
        if(!sellerId||!data||!data.title||!data.price||!data.prevPrice||!data.desc||!data.quantity||!data.factory||!data.warranty){
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
          
           if(data.categories&&!(typeof(data.categories)==="object")){
               data.categories=JSON.parse(data.categories)
           }
           if(!(typeof(data.price)==="number")||!(typeof(data.prevPrice)==="number")){
               data.price=Number(data.price); 
               data.prevPrice=Number(data.prevPrice)
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
           console.log(seller)
           res.send({status: true,product:{...product.toObject({ virtuals: false }),sellerName:seller?seller.name:'No seller'}});
        }catch(err){
            throw new BadReqErr(err.message)
        }
        
    },
    add_image_product:async(req,res)=>{
        const {productId,userId,sellerId}=req.body;
        if(!productId||!userId||!sellerId){
            throw new BadReqErr('Please provide product Id')
        }
       
        try{
            const product= await Products.findOne({_id:productId,userId,sellerId})
            if(!product){
                throw new BadReqErr('not found the product')
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
             let L=product.imgPath.length-1;
             if(L<0){
                return res.status(200).send({status:true,images:product.imgPath,lastImg:'there is no last image'})
             }
             return res.status(200).send({status:true,images:product.imgPath,lastImg:product.imgPath[L]})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    remove_image_product:async(req,res)=>{
        const {productId,userId,sellerId,url}=req.body;
        if(!productId||!userId||!sellerId||!url){
            throw new BadReqErr('Please provide product Id')
        }
        try{
            const product= await Products.findOne({_id:productId,userId,sellerId})
            if(!product){
                throw new BadReqErr('not found the product')
            }
            let newImgPath=product.imgPath.filter((item)=>item!==url)
           
            product.imgPath=newImgPath;
            await product.save()
            let L=product.imgPath.length-1;
            if(L<0){
               return res.status(200).send({status:true,images:product.imgPath,lastImg:'there is no last image'})
            }
            return res.status(200).send({status:true,images:product.imgPath,lastImg:product.imgPath[L]})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    list_all_products:async(req,res)=>{
        try{
            const data=await Products.find({accepted:true})
            const p=[]
            for(let i=0;i<data.length;i++){
                const item=data[i]
                const sellerId=item.sellerId
                console.log(item)
                const seller= await Seller.findById(sellerId)
                console.log(seller)
                p.push({sellerName:seller?seller.name:'No seller',...item.toObject({ virtuals: false })}) 
            }
           
            res.send({status:true,products:p})
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
            const data=await Products.find({accepted:true,categories:{
                $all:targetCategories
            }})
            const p=[]
            for(let i=0;i<data.length;i++){
                const item=data[i]
                const sellerId=item.sellerId
                const seller= await Seller.findById(sellerId)
                p.push({sellerName:seller?seller.name:'No seller',...item.toObject({ virtuals: false })}) 
            }    
            res.send({status:true,products:p})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    accept_product:async(req,res)=>{
        const {productId}=req.body;
        if(!productId){
            throw new BadReqErr('Inputs are not valid please check it again')
        }
        try{
            const p=await Products.findById(productId)
            p.accepted=true;
            await p.save()
            return res.send({status:true,product:p})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    make_product_not_accepted:async(req,res)=>{
        const {productId}=req.body;
        if(!productId){
            throw new BadReqErr('Inputs are not valid please check it again')
        }
        try{
            const p=await Products.findOneAndDelete({_id:productId})
            if(!p){
                throw new BadReqErr('can not find this product')
            }
            return res.send({status:true,product:p,msg:"product is now not accepted"})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    list_not_accepted_products:async(req,res)=>{
        try{
            const data=await Products.find({accepted:false})
            const p=[]
            for(let i=0;i<data.length;i++){
                const item=data[i]
                const sellerId=item.sellerId
                const seller= await Seller.findById(sellerId)
                p.push({sellerName:seller?seller.name:'No seller',...item.toObject({ virtuals: false })}) 
            }    
            return res.send({status:true,products:p})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    list_accepted_products:async(req,res)=>{
        try{
            const p=await Products.find({accepted:true})
            return res.send({status:true,products:p})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    editProduct:async(req,res)=>{
        const {productId,title,price,desc,quantity,factory,warranty,prevPrice}=req.body;
        if(!productId){
            throw new BadReqErr('Please provide product Id')
        }
        try{
            const product= await Products.findById(productId)
            if(!product){
                throw new notfound('not found the product')
            }
            product.title=title?title:product.title;
            product.price=price?price:product.price;
            product.prevPrice=prevPrice?prevPrice:product.prevPrice;
            product.desc=desc?desc:product.desc;
            product.quantity=quantity?quantity:product.quantity;
            product.fake_quantity=quantity?quantity:product.fake_quantity;
            product.factory=factory?factory:product.factory;
            product.warranty=warranty?warranty:product.warranty;

            await product.save()

            return res.status(200).send({status:true,product})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    add_video_product:async(req,res)=>{
        const {productId,userId,sellerId}=req.body;
        if(!productId||!userId||!sellerId){
            throw new BadReqErr('Please provide product Id')
        }
       
        try{
            const product= await Products.findOne({_id:productId,userId,sellerId,accepted:true})
            if(!product){
                throw new BadReqErr('not found the product')
            }
            
            let video=[];
            if(req.files){
                if(req.files.video.length===undefined){
                    video=[req.files.video];
                }else{
                    video=[...req.files.video];
                }
            }
            for(let i=0;i<video.length;i++){
                let item=video[i]
                console.log(item)
                const fileName = item.name.split('.')[0]
                const fileFormat = item.mimetype.split('/')[1]
                let file=await uploadVideosToCloudinary(item.data,fileFormat,fileName)
                console.log(file)
                if(file){
                    product.videoPath.push(file.url)
                    await product.save()
                }
             }
             let L=product.videoPath.length-1;
             if(L<0){
                return res.status(200).send({status:true,msg:'done',videos:product.videoPath,lastVideo:'there is no last video'})
            }
            return res.status(200).send({status:true,msg:'done',videos:product.videoPath,lastVideo:product.videoPath[product.videoPath.length-1]})
        }catch(err){
            throw new BadReqErr(err.message)
        }
      
    },
    remove_video_product:async(req,res)=>{
        const {productId,userId,sellerId,url}=req.body;
        if(!productId||!userId||!sellerId||!url){
            throw new BadReqErr('Please provide product Id')
        }
        try{
            const product= await Products.findOne({_id:productId,userId,sellerId})
            if(!product){
                throw new BadReqErr('not found the product')
            }
            let newVideoPath=product.videoPath.filter((item)=>item!==url)
           
            product.videoPath=newVideoPath;
            await product.save()
            let L=product.videoPath.length-1;
            if(L<0){
               return res.status(200).send({status:true,videos:product.videoPath,lastImg:'there is no last image'})
            }
            return res.status(200).send({status:true,images:product.videoPath,lastImg:product.videoPath[L]})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
}
