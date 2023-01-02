const express=require('express')
const {get_users}=require('../controllers/auth')
const {IsAdminFunc} =require('../middlewares/auth')
const router=express.Router()

router.get('/get-users',IsAdminFunc,get_users)
module.exports={get_users:router}