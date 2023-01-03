const {validationResult} =require('express-validator')
const {validateincomingreq}=require('../errorclasses/incomingReq')
const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {user}=require('../models/BaseModel')
const {hashPass,comparePass}=require('../utils/password')
const jwt =require('jsonwebtoken')
const {ValidateReq} =require('../helpers/customValidator')
const {GetRandString}=require('../utils/randomString')
const {SendEmail} =require('../utils/sendEmail')
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary}=require('../utils/uploadImg')
const {roles}=require('../types/roles')
module.exports={
    signup:async(req,res)=>{
        const error =validationResult(req)
        console.log('error:',error.array())
        if(!error.isEmpty()){
            throw new validateincomingreq(error.array())
        }
        const {name,email,password,mobile}=req.body;
        console.log(email)
       const exists=await user.findOne({email})
       if(exists){
        console.log('user already exists')
       throw new BadReqErr('Email is already in use')
       }
       else{
            let img=[];
            if(req.files){
                if(req.files.img.length===undefined){
                    img=[req.files.img];
                }else{
                    img=[...req.files.img];
                }
            }
        
        //   const uniqueString=GetRandString()
          const User= await user.create({name,email,password:hashPass(password),mobile})
          for(let i=0;i<img.length;i++){
            let item=img[i]
            const fileFormat = item.mimetype.split('/')[1]
            const { base64 } = bufferToDataURI(fileFormat, item.data)
            const imageDetails = await uploadToCloudinary(base64, fileFormat)
            console.log(imageDetails)
            User.imgPath.push(imageDetails.url)
            await User.save()
        }
        //   SendEmail(User.email,User.uniqueString)
          return res.status(201).send({name:User.name,email:User.email,mobile,img:User.imgPath,id:User._id,status:true})
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
        id:existingUser._id,
        IsAdmin:existingUser.role===roles.ADMIN?true:false,
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
          try{
            const {name,email,IsAdmin,_id}= await user.findById(req.currentUser.id)
            return res.send({
                name,
                email,
                id:_id,
                status:true
            })
          }catch(err){
            throw new notfound('this user can not be found')
          }
         
        }
        return res.send({currentUser:null})
    },
    update_user:async(req,res)=>{
        if(req.currentUser){
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
                },process.env.JWT_KEY)
    
                req.session={
                    jwt:token
                }
                return res.status(201).send({UserUpdated:{name:User.name,email:User.email,status:true,token}})
            }catch(err){
               throw new notfound('this user can not be found')
            }
        }else{
            return res.send({currentUser:null})
        }
       
    },
    delete_user:async(req,res)=>{
        if(req.params.id){
            try{
               const User= await user.findByIdAndRemove(req.params.id)
               res.send('User Deleted Successfully')
            }catch(err){
                throw new BadReqErr('This user can not be deleted')
            }
        }else{
            throw new BadReqErr('you did not provide an user id')
        }
    },
    get_users:async(req,res)=>{
        try{
            const Users=await user.find({})
            res.send(Users)
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    verfiyUser:async(req,res)=>{
        const {uniqueString}=req.params;
        try{
            const User=await user.findOne({uniqueString})
    
            if(User){
                User.IsValid=true;
                await User.save()
                res.send('<h1>Done Verifying Please Return Back To The App.</h1>')
            }
            else{
                throw new notfound('can not find the user')
            }
        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
}