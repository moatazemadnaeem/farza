const {user}=require('../models/BaseModel')
const {notfound} =require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')

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
        console.log(req.currentUser)
        const {id}=req.currentUser;
        try{
            const User= await user.findById(id);
            return res.status(200).send({courses:User.courses,status:true});
        }catch(err){
            throw new notfound('User does not exist in the DB please try to sign up.');
        }
    }
}
//each course will have its track html->front html->10 points 

//over all points client will handel it so may be 50 points 30/50 and so on 