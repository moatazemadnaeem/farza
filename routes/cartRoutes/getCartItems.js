const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {getCartItems} =require('../../controllers/cart')


router.get('/get-cart-items',Auth,IsUser,getCartItems)

module.exports={get_cart_items_route:router}