const express=require('express')
const {delete_user}=require('../controllers/auth')
const {verifyTokenAndAdmin,Auth} =require('../middlewares/auth')
const router=express.Router()

router.delete('/delete/:id',Auth,verifyTokenAndAdmin,delete_user)
module.exports={delete_user:router}