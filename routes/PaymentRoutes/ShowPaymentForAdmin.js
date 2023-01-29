const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {showPaymentForAdmin} =require('../../controllers/payments')

router.get('/show-payment',Auth,IsAdminFunc,showPaymentForAdmin)

module.exports={show_payment_route:router}