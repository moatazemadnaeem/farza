const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {add_image_product} =require('../../controllers/products')


router.put('/add-image-product',Auth,add_image_product)

module.exports={add_image_product_route:router}