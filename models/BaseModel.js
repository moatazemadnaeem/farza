const mongoose=require('mongoose')
const CourseSchema=mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    }
})
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
    courses:[CourseSchema]
})
module.exports={user:mongoose.model('User',BaseSchema)}