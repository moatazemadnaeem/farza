const {BadReqErr} =require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const mongoose =require('mongoose')
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
    add_seller_product:async(req,res)=>{
        const {sellerId,...data}=req.body;
        //console.log(data,req.files)
        if(!sellerId||!data||!data.title||!data.price||!data.desc||!req.files||!data.categories){
            throw new BadReqErr('Inputs are not valid please check it again')
        }

        try{
            const customId=new mongoose.Types.ObjectId().toHexString()
           const seller= await Seller.findById(sellerId)
           const img=req.files.img;
          
           data.img=img.name;
           if(!(typeof(data.categories)==="object")){
               data.categories=JSON.parse(data.categories)
           }
           if(!(typeof(data.price)==="number")){
               data.price=Number(data.price);       
           }
           data._id=customId;

           const imgPathVar=`https://farza-e-commerce.herokuapp.com/static/${req.currentUser.id}/Sellers/${seller._id}/Products/${customId}/${img.name} `
           data.imgPath=imgPathVar;
           
           seller.products.push(data)

           await seller.save()


           //const product_id=seller.products[seller.products.length-1]._id
           img.mv(`./images/${req.currentUser.id}/Sellers/${seller._id}/Products/${customId}/`+ img.name)
           res.send({status: true,seller_products:seller.products});
        }catch(err){
            throw new BadReqErr(err.message)
        }
        
    },
    list_all_products:async(req,res)=>{
        try{
            const data=await Seller.find({})
            const products=[]
            data.forEach((item)=>{
                products.push(...item.products)
            })
            res.send({status:true,products})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    list_all_products_based_on_categories:async(req,res)=>{
        const {targetCategories}=req.body
        const targetLength=targetCategories.length;
        if(!targetCategories||typeof(targetCategories)!=='object'){
            throw new BadReqErr('Inputs are not valid please check it again')
        }
        try{
            const data=await Seller.find({})
            const products=[]
            //this is one seller
            data.forEach((item)=>{
                //first you will map on every product 
                //get the categories 
                //check if its cat equal to target cat if so return this product or push this item 
                //if not do not push it 
                item.products.forEach((element,index)=>{
                    const currentCategories=item.products[index].categories
                    let sum=0;
                    currentCategories.forEach(r=> {
                        if(targetCategories.indexOf(r) >= 0){
                                sum+=1;
                        }
                        
                    })
                    if(sum!==0){
                        if(sum<=targetLength){
                            products.push(item.products[index])
                        }
                    }
                })

            })
            
            res.send({status:true,products})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
}
//[football,swimming,tshirts] 1
//lets see if product category holds value or equal to 1 
//then we will send it back