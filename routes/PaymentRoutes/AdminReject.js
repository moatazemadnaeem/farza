const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {rejectByAdmin} =require('../../controllers/payments')

router.post('/reject-payment',Auth,IsAdminFunc,rejectByAdmin)

module.exports={reject_payment_route:router}