const {BadReqErr} =require('../errorclasses/badReq')
const {Seller} =require('../models/Seller')
module.exports={
    create_seller:async(req,res)=>{
        if(!req.files||!req.body.name||req.body.name.length===0){
            throw new BadReqErr('Inputs are not valid please check it again')
        }
       
        // console.log('body-->',req.body)
        // console.log('files-->',req.files)
        try{

            const img=req.files.img;
            console.log(img)
            //name=id 
            //After getting the name and saving the file in the disk 
            //We will create a new record give it name of the branch and name og the image
            //there will be a list of records in the seller but lets assume there is only one record 
            //we will make a route to get this record and to view the image we will get its name and put it in /static/image_name
            //and this will make our image be visible on the client
            const seller= await Seller.create({
                userId:req.currentUser.id,
                name:req.body.name,
                img:img.name,
            })
            seller.set({imgPath:`https://farza-e-commerce.herokuapp.com/static/${req.currentUser.id}/Sellers/${seller._id}/${img.name} `})
            await seller.save()
            img.mv(`./images/${req.currentUser.id}/Sellers/${seller._id}/`+ img.name)

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