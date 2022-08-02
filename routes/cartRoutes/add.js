const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {addCartItems} =require('../../controllers/cart')


router.post('/add-cart-items',Auth,addCartItems)

module.exports={add_cart_items_route:router}