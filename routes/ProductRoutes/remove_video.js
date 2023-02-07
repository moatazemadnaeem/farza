const express=require('express')
const {Auth,IsSeller}=require('../../middlewares/auth')
const router=express.Router()
const {remove_video_product} =require('../../controllers/products')


router.put('/remove-video-product',Auth,IsSeller,remove_video_product)

module.exports={remove_video_product_route:router}