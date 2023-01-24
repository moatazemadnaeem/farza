const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {make_product_not_accepted} =require('../../controllers/products')


router.post('/disallow-product',Auth,IsAdminFunc,make_product_not_accepted)

module.exports={disallowProduct:router}