const {validationResult} =require('express-validator')
const {validateincomingreq}=require('../errorclasses/incomingReq')
const {BadReqErr}=require('../errorclasses/badReq')
const {user}=require('../models/BaseModel')
const {hashPass,comparePass}=require('../utils/password')
const jwt =require('jsonwebtoken')
module.exports={
    signup:async(req,res)=>{
        const error =validationResult(req)
        console.log('error:',error.array())
        if(!error.isEmpty()){
            throw new validateincomingreq(error.array())
        }
        const {name,email,password}=req.body;
        console.log(email)
       const exists=await user.findOne({email})
       if(exists){
        console.log('user already exists')
       throw new BadReqErr('Email is already in use')
       }
       else{
          const User= await user.create({name,email,password:hashPass(password)})
          const token= jwt.sign({
              id:User._id,
              name:User.name,
              email:User.email
          },process.env.JWT_KEY)
          req.session={
              jwt:token
          }
          return res.status(201).send({name:User.name,email:User.email})
       } 
    },
    signin:async(req,res)=>{
        
    const {email,password}=req.body;
    //if user exist

    const existingUser=await user.findOne({email})
    if(!existingUser){
        throw new BadReqErr('invalid creds ')
    }

    //check password
    const validate=comparePass(password,existingUser.password)
    if(!validate){
        throw new BadReqErr('invalid creds ')
    }

    //send jwt 
    const token= jwt.sign({
        id:existingUser._id,
        name:existingUser.name,
        email:existingUser.email
    },process.env.JWT_KEY)
    req.session={
        jwt:token
    }
    console.log(existingUser)
    //send data
    res.status(200).send({
        name:existingUser.name,
        email:existingUser.email
    })
    },
    signout:async(req,res)=>{
        req.session=null
        res.send('signed out')
    },
    current:async(req,res)=>{
        //check first is the session object exist and then check jwt
         return res.send({currentUser:req.currentUser||null})
    }
}