const {user}=require('../models/BaseModel')
const {notfound} =require('../errorclasses/notfound')

module.exports={
    registerCourses:async (req,res)=>{
       const {id}=req.currentUser;
       const courseContent=req.body;
       try{
           const User= await user.findById(id);
           User.courses.push(courseContent);
           await User.save();
           return res.status(201).send({courses:User.courses,status:true});

       }catch(err){
          throw new notfound('User does not exist in the DB please try to sign up.');
       }
    },
    getRegisteredCourses:async (req,res)=>{
        const {id}=req.currentUser;
        try{
            const User= await user.findById(id);
            return res.status(200).send({courses:User.courses,status:true});
        }catch(err){
            throw new notfound('User does not exist in the DB please try to sign up.');
        }
    }
}