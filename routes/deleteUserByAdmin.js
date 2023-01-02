const express=require('express')
const {delete_user}=require('../controllers/auth')
const {IsAdminFunc} =require('../middlewares/auth')
const router=express.Router()

router.delete('/delete/:id',IsAdminFunc,delete_user)
module.exports={delete_user:router}