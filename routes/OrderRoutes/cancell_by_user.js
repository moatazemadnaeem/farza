const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {cancell_by_user} =require('../../controllers/orders')


router.post('/cancell-order-user',Auth,IsUser,cancell_by_user)

module.exports={cancell_order_user_route:router}