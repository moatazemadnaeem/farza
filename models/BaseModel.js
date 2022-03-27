const mongoose=require('mongoose')
const CourseSchema=mongoose.Schema({
    track:{
        type:String,
    },
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    imageSrc:{
        type:String
    },
    courseUrl:{
        type:String
    },
    points:{
        type:Number,
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