const express=require('express')
const router=express.Router()

const {list_all_products_based_on_categories} =require('../../controllers/sellers')


router.get('/list-all-products-based-on-categories',list_all_products_based_on_categories)

module.exports={list_all_products_based_on_categories_route:router}