const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {clearAllCart} =require('../../controllers/cart')


router.delete('/clear-cart-items',Auth,clearAllCart)

module.exports={clear_cart_items_route:router}