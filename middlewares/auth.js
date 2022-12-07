const {NotAuth}=require('../errorclasses/notauth')
const jwt =require('jsonwebtoken') 
const {user}=require('../models/BaseModel')
const {BadReqErr} =require('../errorclasses/badReq')
const {roles}=require('../types/roles')
const {IsValidUser}=require('../utils/IsValidUser')
const Auth=async(req,res,next)=>{
   
    if(req.headers.authentication||req.body.authentication){
        try{
            const authentication=req.headers.authentication?req.headers.authentication:req.body.authentication
            const payload= jwt.verify(authentication,process.env.JWT_KEY)
            req.currentUser=payload
            const validated= await IsValidUser(payload)
            if(!validated){
              return next(new NotAuth('Please check your email to validate')) 
            }
          }catch(err){
            return next(new NotAuth('You are not authenticated')) 
          }
         
        return next()
    }
    if(!req.session?.jwt){
       return next(new NotAuth('You are not authenticated')) 
    }
    try{
          const payload= jwt.verify(req.session.jwt,process.env.JWT_KEY)
          req.currentUser=payload
          const validated=await IsValidUser(payload)
          if(!validated){
            return next(new NotAuth('Please check your email to validate')) 
          }
    }catch(err){
       return next(new NotAuth('You are not authenticated')) 
    }
    
  return next()
    
}
const verifyTokenAndAdmin = async(req, res, next) => {
  try{
    const User=await user.findById(req.currentUser.id)
    if(!User){
      return next(new NotAuth('You are not authenticated')) 
    }
    if(User.roles!==roles.ADMIN){
      return next(new NotAuth('You are not admin to do this action')) 
    }
  }catch(err){
    return next(new BadReqErr(err.message)) 
  }

    if(req.headers.authentication||req.body.authentication){
      try{
          const authentication=req.headers.authentication?req.headers.authentication:req.body.authentication
          const payload= jwt.verify(authentication,process.env.JWT_KEY)
          req.currentUser=payload
        }catch(err){
          return next(new NotAuth('You are not authenticated')) 
        }
       
      return next()
  }
  if(!req.session?.jwt){
     return next(new NotAuth('You are not authenticated')) 
  }
  try{
        const payload= jwt.verify(req.session.jwt,process.env.JWT_KEY)
        req.currentUser=payload
  }catch(err){
     return next(new NotAuth('You are not authenticated')) 
  }
  
return next()
};

module.exports={Auth,verifyTokenAndAdmin}


