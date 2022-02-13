const {NotAuth}=require('../errorclasses/notauth')
import jwt from 'jsonwebtoken'
const Auth=(req,res,next)=>{
    if(!req.session?.jwt){
        next(new NotAuth('You are not authenticated')) 
    }else{
        try{
           jwt.verify(req.session.jwt,process.env.JWT_KEY)
        }catch(err){
            next(new NotAuth('You are not authenticated')) 
        }
        next()
    }
}
module.exports={Auth}