const mongoose=require('mongoose')

const ProductSchema=mongoose.Schema({
    title:{
        type: String, 
        required: true, 
    },
    desc: { 
        type: String, 
        required: true, 
    },
    img: { 
        type: String, 
        required: true 
    },
    categories: { 
        type: Array ,
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
})

const SellerSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true,
    },
    products:[ProductSchema],
    
},
{ timestamps: true })
module.exports={Seller:mongoose.model('Seller',SellerSchema)}