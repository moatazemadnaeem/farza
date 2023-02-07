const express=require('express')
const {Auth,IsSeller}=require('../../middlewares/auth')
const router=express.Router()
const {add_video_product} =require('../../controllers/products')


router.put('/add-video-product',Auth,IsSeller,add_video_product)

module.exports={add_video_product_route:router}