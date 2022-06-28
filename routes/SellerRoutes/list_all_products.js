const express=require('express')
const router=express.Router()

const {list_all_products} =require('../../controllers/sellers')


router.get('/list-all-products',list_all_products)

module.exports={list_all_products_route:router}