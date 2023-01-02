const express=require('express')
const router=express.Router()
const {Auth,IsAdminFunc}=require('../../middlewares/auth')

const {list_not_accepted_products} =require('../../controllers/products')


router.get('/list-not-accepted-products',Auth,IsAdminFunc,list_not_accepted_products)

module.exports={list_not_accepted_products_route:router}