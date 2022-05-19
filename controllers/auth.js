const {validationResult} =require('express-validator')
const {validateincomingreq}=require('../errorclasses/incomingReq')
const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {user}=require('../models/BaseModel')
const {hashPass,comparePass}=require('../utils/password')
const jwt =require('jsonwebtoken')
const {ValidateReq} =require('../helpers/customValidator')
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
              email:User.email,
              IsAdmin:User.IsAdmin
          },process.env.JWT_KEY)
          req.session={
              jwt:token
          }
          return res.status(201).send({name:User.name,IsAdmin:User.IsAdmin,email:User.email,status:true,token})
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
        email:existingUser.email,
        IsAdmin:existingUser.IsAdmin
    },process.env.JWT_KEY)
    req.session={
        jwt:token
    }
    console.log(existingUser)
    //send data
    res.status(200).send({
        name:existingUser.name,
        email:existingUser.email,
        status:true,
        IsAdmin:existingUser.IsAdmin,
        token
    })
    },
    signout:async(req,res)=>{
        req.session=null
        res.send({
            token:null,
            currentUser:null,
        })
    },
    current:async(req,res)=>{
        //check first is the session object exist and then check jwt
        if(req.currentUser){
            return res.send({currentUser:{User:req.currentUser,status:true}})
        }
        return res.send({currentUser:null})
    },
    update_user:async(req,res)=>{
        const {name,email,password}=req.body
        const {error}=ValidateReq(req.body)
        if(error){
            throw new BadReqErr(error.details[0].message)
        }
        try{
           console.log('working')
           const User= await user.findById(req.currentUser.id)
           User.name=name?name:User.name;
           User.email=email?email:User.email;
           User.password=password?hashPass(password):User.password;
           await User.save()
           
           const token= jwt.sign({
            id:User._id,
            name:User.name,
            email:User.email,
            IsAdmin:User.IsAdmin
            },process.env.JWT_KEY)

            req.session={
                jwt:token
            }
            return res.status(201).send({UserUpdated:{name:User.name,IsAdmin:User.IsAdmin,email:User.email,status:true,token}})
        }catch(err){
           throw new notfound('this user can not be found')
        }
    }
}