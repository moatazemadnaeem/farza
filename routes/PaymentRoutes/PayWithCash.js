const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {PayInCash} =require('../../controllers/payments')

router.post('/cash-payment',Auth,IsUser,PayInCash)

module.exports={cash_payment_route:router}