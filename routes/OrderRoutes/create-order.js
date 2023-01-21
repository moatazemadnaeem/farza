const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {create_order} =require('../../controllers/orders')


router.post('/create-order',Auth,IsUser,create_order)

module.exports={create_order_route:router}