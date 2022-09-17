const mongoose=require('mongoose')
const {roles}=require('../types/roles')
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
    mobile:{
        type:String,
        required:true,
    },
    role: { 
        type: String,
        enum:Object.values(roles),
        default:roles.NORMALSELLER
    },
    IsValid:{
        type:Boolean,
        default:false
    },
    uniqueString:{
        type:String,
        required:true
    }
},
{ timestamps: true })
module.exports={user:mongoose.model('User',BaseSchema)}