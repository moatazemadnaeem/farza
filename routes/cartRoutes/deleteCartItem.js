const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {deleteCartItems} =require('../../controllers/cart')


router.delete('/delete-cart-items',Auth,deleteCartItems)

module.exports={delete_cart_items_route:router}