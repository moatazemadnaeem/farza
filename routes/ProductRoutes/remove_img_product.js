const express=require('express')
const {Auth,IsSeller}=require('../../middlewares/auth')
const router=express.Router()
const {remove_image_product} =require('../../controllers/products')


router.put('/remove-image-product',Auth,IsSeller,remove_image_product)

module.exports={remove_image_product_route:router}