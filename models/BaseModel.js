const mongoose=require('mongoose')

const BaseSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    IsAdmin:{
        type:Boolean,
        default:false
    } 
},
{ timestamps: true })
module.exports={user:mongoose.model('User',BaseSchema)}