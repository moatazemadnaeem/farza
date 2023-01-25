const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {get_all_orders_by_user} =require('../../controllers/orders')


router.get('/get_orders_user',Auth,IsUser,get_all_orders_by_user)

module.exports={get_orders_user_route:router}