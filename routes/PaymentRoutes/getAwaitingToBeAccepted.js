const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {getAwaitingAccepted} =require('../../controllers/payments')

router.get('/awaiting-payment-accept',Auth,IsAdminFunc,getAwaitingAccepted)

module.exports={awaiting_payment_accept_route:router}