const mongoose=require('mongoose')

const ProductSchema=mongoose.Schema({
    title:{
        type: String, 
        required: true, 
        unique: true
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
        type: Array 
    },
    price: { 
        type: Number, 
        required: true 
    },
})

const SellerSchema=mongoose.Schema({
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
module.exports={user:mongoose.model('Seller',SellerSchema)}