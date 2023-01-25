const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {cancell_by_admin} =require('../../controllers/orders')


router.post('/cancell-order-admin',Auth,IsAdminFunc,cancell_by_admin)

module.exports={cancell_order_admin_route:router}