const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {create_order} =require('../../controllers/orders')


router.post('/create-order',Auth,create_order)

module.exports={create_order_route:router}