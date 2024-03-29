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
const IsAdminFunc = async(req, res, next) => {
  try{
    const User=await user.findById(req.currentUser.id)
    if(!User){
      return next(new NotAuth('You are not authenticated')) 
    }
    if(User.role!==roles.ADMIN){
      return next(new NotAuth('You are not admin to do this action')) 
    }
    return next()
  }catch(err){
    return next(new BadReqErr(err.message)) 
  }
    
};
const IsSeller = async(req, res, next) => {
  try{
    const User=await user.findById(req.currentUser.id)
    if(!User){
      return next(new NotAuth('You are not authenticated')) 
    }
    if(User.role===roles.ADMIN){
      return next()
    }
    if(User.role!==roles.SELLER){
      return next(new NotAuth('You are not seller to do this action')) 
    }
    return next()
  }catch(err){
    return next(new BadReqErr(err.message)) 
  }
    
};
const IsUser= async(req, res, next) => {
  try{
    const User=await user.findById(req.currentUser.id)
    if(!User){
      return next(new NotAuth('You are not authenticated')) 
    }
    if(User.role===roles.ADMIN){
      return next()
    }
    if(User.role!==roles.USER){
      return next(new NotAuth('You are not user to do this action')) 
    }
    return next()
  }catch(err){
    return next(new BadReqErr(err.message)) 
  }
    
};

module.exports={Auth,IsAdminFunc,IsSeller,IsUser}


