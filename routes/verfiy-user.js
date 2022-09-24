const express=require('express')
const {verfiyUser}=require('../controllers/auth')
const router=express.Router()

router.get('/verfiy-user/:uniqueString',verfiyUser)
module.exports={verfiy_user:router}