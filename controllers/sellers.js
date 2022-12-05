const {BadReqErr} =require('../errorclasses/badReq')
const {Seller} =require('../models/Seller')
const {GetRandString} =require('../utils/randomString')
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
module.exports={
    create_seller:async(req,res)=>{
        if(!req.body.name||req.body.name.length===0){
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
            })

           
            for(let i=0;i<img.length;i++){
                let item=img[i]
                console.log(item)
                await s3.putObject({
                    Body: JSON.stringify(req.body),
                    Bucket: process.env.BUCKET,
                    Key: item.stringify(),
                  }).promise()
            }
            res.send({status: true,seller});
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
 
}
//[football,swimming,tshirts] 1
//lets see if product category holds value or equal to 1 
//then we will send it back