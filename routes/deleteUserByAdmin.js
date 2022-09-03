const express=require('express')
const {delete_user}=require('../controllers/auth')
const {verifyTokenAndAdmin} =require('../middlewares/auth')
const router=express.Router()

router.delete('/delete/:id',verifyTokenAndAdmin,delete_user)
module.exports={delete_user:router}