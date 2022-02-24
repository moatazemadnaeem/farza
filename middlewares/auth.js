const {NotAuth}=require('../errorclasses/notauth')
const jwt =require('jsonwebtoken') 
const Auth=(req,res,next)=>{
    if(!req.session?.jwt){
        next(new NotAuth('You are not authenticated')) 
    }else{
        try{
          const payload= jwt.verify(req.session.jwt,process.env.JWT_KEY)
          req.currentUser=payload
        }catch(err){
            next(new NotAuth('You are not authenticated')) 
        }
        next()
    }
}
module.exports={Auth}