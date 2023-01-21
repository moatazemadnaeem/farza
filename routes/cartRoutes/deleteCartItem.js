const express=require('express')
const {Auth,IsUser}=require('../../middlewares/auth')
const router=express.Router()
const {deleteCartItems} =require('../../controllers/cart')


router.delete('/delete-cart-items',Auth,IsUser,deleteCartItems)

module.exports={delete_cart_items_route:router}