const express=require('express')
const router=express.Router()
const {Auth,IsAdminFunc}=require('../../middlewares/auth')

const {list_accepted_products} =require('../../controllers/products')


router.get('/list-accepted-products',Auth,IsAdminFunc,list_accepted_products)

module.exports={list_accepted_products_route:router}