const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {doQuantity} =require('../../controllers/cart')


router.post('/set-quantity',Auth,IsUser,doQuantity)

module.exports={set_quantity_route:router}