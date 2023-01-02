const express=require('express')
const {Auth,IsAdminFunc}=require('../../middlewares/auth')
const router=express.Router()
const {accept_product} =require('../../controllers/products')


router.post('/accept-product',Auth,IsAdminFunc,accept_product)

module.exports={acceptProduct:router}