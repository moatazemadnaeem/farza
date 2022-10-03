const mongoose=require('mongoose')

const SellerSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    imgPath:{
        type:[String],
    },
},
{ timestamps: true })
module.exports={Seller:mongoose.model('Seller',SellerSchema)}