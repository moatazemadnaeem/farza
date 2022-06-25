const express=require('express')
const {get_users}=require('../controllers/auth')
const {verifyTokenAndAdmin,Auth} =require('../middlewares/auth')
const router=express.Router()

router.get('/get-users',Auth,verifyTokenAndAdmin,get_users)
module.exports={get_users:router}