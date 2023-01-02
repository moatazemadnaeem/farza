const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {get_awaiting_delivering_orders} =require('../../controllers/orders')


router.get('/awaiting_delivering',Auth,IsAdminFunc,get_awaiting_delivering_orders)

module.exports={awaiting_delivering_route:router}