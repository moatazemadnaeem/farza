const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {create_payment} =require('../../controllers/payments')

router.post('/create-payment',Auth,create_payment)

module.exports={create_payment_route:router}