const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')

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
                img:img.name
            })
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
    add_seller_product:async(req,res)=>{
        const {sellerId,...data}=req.body;
        //console.log(data,req.files)
        if(!sellerId||!data||!data.title||!data.price||!data.desc||!req.files||!data.categories){
            throw new BadReqErr('Inputs are not valid please check it again')
        }

        try{
           const seller= await Seller.findById(sellerId)
           const img=req.files.img;
          
           data.img=img.name;
           if(!(typeof(data.categories)==="object")){
               data.categories=JSON.parse(data.categories)
           }
           if(!(typeof(data.price)==="number")){
               data.price=Number(data.price);       
           }
          
           seller.products.push(data)

           await seller.save()
           const product_id=seller.products[seller.products.length-1]._id
           img.mv(`./images/${req.currentUser.id}/Sellers/${seller._id}/Products/${product_id}/`+ img.name)
           res.send({status: true,seller_products:seller.products});
        }catch(err){
            throw new BadReqErr(err.message)
        }
        
    }
}