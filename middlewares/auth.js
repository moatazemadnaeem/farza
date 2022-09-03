const {NotAuth}=require('../errorclasses/notauth')
const jwt =require('jsonwebtoken') 
const {user}=require('../models/BaseModel')
const {BadReqErr} =require('../errorclasses/badReq')
const {roles}=require('../types/roles')
const Auth=async(req,res,next)=>{
      try{
        const User=await user.findById(req.currentUser.id)
        if(!User){
          return next(new NotAuth('You are not authenticated')) 
        }
        if(User.roles!==roles.NORMALSELLER){
          return next(new NotAuth('You are not authenticated')) 
        }
      }catch(err){
        return next(new BadReqErr(err.message)) 
      }
    
    if(req.headers.authentication){
        try{
            const payload= jwt.verify(req.headers.authentication,process.env.JWT_KEY)
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

    if(req.headers.authentication){
      try{
          const payload= jwt.verify(req.headers.authentication,process.env.JWT_KEY)
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


