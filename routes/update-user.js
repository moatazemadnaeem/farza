const express=require('express')
const {update_user}=require('../controllers/auth')
const {validatereq}=require('../middlewares/validateReq')
const {body}= require('express-validator') 
const {Auth} =require('../middlewares/auth')
const router=express.Router()

router.put('/update_user',Auth,update_user)
module.exports={updateUser:router}