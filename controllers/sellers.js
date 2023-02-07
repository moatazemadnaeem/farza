const {BadReqErr} =require('../errorclasses/badReq')
const {Seller} =require('../models/Seller')
const {GetRandString} =require('../utils/randomString')
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary}=require('../utils/uploadImg')
const {Products}=require('../models/Products')
const {distance}=require('../utils/getDistance')
module.exports={
    create_seller:async(req,res)=>{
        if(!req.body.name||req.body.name.length===0||!req.body.lat||!req.body.lon){
            throw new BadReqErr('Inputs are not valid please check it again')
        }
        try{
            let img=[];
            if(req.files){
                if(req.files.img.length===undefined){
                    img=[req.files.img];
                }else{
                    img=[...req.files.img];
                }
            }
          

            const seller= await Seller.create({
                userId:req.currentUser.id,
                name:req.body.name,
                lat:req.body.lat,
                lon:req.body.lon,
               
            })
           
            for(let i=0;i<img.length;i++){
                let item=img[i]
                console.log(item)
                const fileFormat = item.mimetype.split('/')[1]
                const { base64 } = bufferToDataURI(fileFormat, item.data)
                const imageDetails = await uploadToCloudinary(base64, fileFormat)
                console.log(imageDetails)
                seller.imgPath.push(imageDetails.url)
                await seller.save()
            }
            res.send({status: true,seller,image:seller.imgPath.length===0?'no image':seller.imgPath[0]});
        }catch(err){
            throw new BadReqErr(err.message)

        }
    },
    get_sellers:async(req,res)=>{
        try{
            const data=await Seller.find({})
            res.send({status:true,data})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    get_seller_by_user:async(req,res)=>{
        const userId=req.currentUser.id
        try{
            const data=await Seller.find({userId})
            res.send({status:true,data})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    edit_seller:async(req,res)=>{
        const {sellerId,name,lat,lon}=req.body;
        if(!sellerId){
            throw new BadReqErr('Please provide seller Id')
        }
        try{
            const seller= await Seller.findById(sellerId)
            if(!seller){
                throw new notfound('not found the seller')
            }
            
            seller.name=name?name:seller.name;
            seller.lat=lat?lat:seller.lat;
            seller.lon=lon?lon:seller.lon;
           
            await seller.save()

            return res.status(200).send({status:true,seller})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    getNearestSellersProducts:async(req,res)=>{
        const {lat,lon} =req.body;
        if(!lat||!lon){
            throw new BadReqErr('Please provide the right creds.')
        }
        try{
                const NearestSellersProducts=await Seller.find({})
                const distanceFromCurrLocation=NearestSellersProducts.map((item)=>{
                    if(item.lat&&item.lon){
                        const dist= distance(lat,lon,item.lat,item.lon)
                        return {dist,name:item.name,id:item._id}
                    }
                    else{
                        return null;
                    }
                })
                const filterNull=distanceFromCurrLocation.filter((item)=>item!==null)
                const nearest=filterNull.sort((a,b)=>a.dist-b.dist)
               
                if(!nearest||nearest.length===0){
                    throw new BadReqErr('There are no nearest products')
                }
                let products=[]
                for(let i=0;i<nearest.length;i++){
                    const {id,name}=nearest[i];
                    const p=await Products.find({sellerId:id,accepted:true})
                    if(p.length!==0){
                        const sp={sellerName:name,products:p}
                        products.push(sp)
                    }
                }
                return res.status(200).send({msg:'Fetched Nearest Products Successfully',products,status:true})
            }
        catch(err){
            throw new BadReqErr(err.message)
        }
    },
    getSellerProducts:async(req,res)=>{
        const {sellerId,userId}=req.body;
        if(!sellerId){
            throw new BadReqErr('Please provide seller Id')
        }
        if(userId!==req.currentUser.id){
            throw new BadReqErr('You are not allowed to do this')
        }
        try{
            const products= await Products.find({sellerId,accepted:true})
            if(!products){
                throw new notfound('not found the products for this seller')
            }
            return res.status(200).send({status:true,products})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
}
