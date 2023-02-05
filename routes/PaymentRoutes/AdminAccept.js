const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {acceptByAdmin} =require('../../controllers/payments')

router.post('/accept-payment',Auth,IsAdminFunc,acceptByAdmin)

module.exports={accept_payment_route:router}