const {NotAuth}=require('../errorclasses/notauth')
const jwt =require('jsonwebtoken') 
const Auth=(req,res,next)=>{

    if(!req.session?.jwt){
       return next(new NotAuth('You are not authenticated')) 
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
    try{
          const payload= jwt.verify(req.session.jwt,process.env.JWT_KEY)
          req.currentUser=payload
    }catch(err){
       return next(new NotAuth('You are not authenticated')) 
    }
  return next()
    
}
module.exports={Auth}


