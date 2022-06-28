const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()

const {get_seller_by_user} =require('../../controllers/sellers')


router.get('/get-sellers-by-user',Auth,get_seller_by_user)

module.exports={get_seller_by_user_route:router}