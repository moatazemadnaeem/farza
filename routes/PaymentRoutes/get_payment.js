const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {get_payment} =require('../../controllers/payments')

router.post('/get-payment',get_payment)

module.exports={get_payment_route:router}