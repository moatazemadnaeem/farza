const express=require('express')
const {Auth,IsSeller}=require('../../middlewares/auth')
const router=express.Router()

const {getSellerProducts} =require('../../controllers/sellers')


router.post('/get-sellers-products',Auth,IsSeller,getSellerProducts)

module.exports={get_seller_products_route:router}