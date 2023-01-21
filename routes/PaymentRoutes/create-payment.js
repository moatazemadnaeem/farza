const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {create_payment} =require('../../controllers/payments')

router.post('/create-payment',Auth,IsUser,create_payment)

module.exports={create_payment_route:router}