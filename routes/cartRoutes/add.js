const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {addCartItems} =require('../../controllers/cart')


router.post('/add-cart-items',Auth,IsUser,addCartItems)

module.exports={add_cart_items_route:router}