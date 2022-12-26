const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {mark_order_as_delivered} =require('../../controllers/orders')


router.post('/mark_delivered',Auth,mark_order_as_delivered)

module.exports={mark_delivered_route:router}