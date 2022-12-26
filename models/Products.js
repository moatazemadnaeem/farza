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
    imgPath:{
        type: [String], 
    },
    categories: { 
        type: Array ,
    },
    price: { 
        type: Number, 
        required: true 
    },
    //branch x or y
    sellerId:{
        type: String, 
        required: true 
    },
    // company
    userId:{
        type:String,
        required:true,
    },
    // max quantity for x product
    quantity: {
        type: Number,
        required:true,
        default: 10,
    },
    fake_quantity: {
        type: Number,
        default: 10,
    },
    //reserved bool to mark a product as reserved or not
    reserved:{
        type:Boolean,
        default: false,
    },
})
module.exports={Products:mongoose.model('Products',ProductSchema)}