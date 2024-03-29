const express=require('express')
const {Auth,IsSeller}=require('../../middlewares/auth')
const router=express.Router()
const {add_seller_product} =require('../../controllers/products')

//This route will handel creating a seller to access this route you must be authenticated 
//You can create a multi branches or sellers 
//each seller have a list of products
//to create a products inside a seller we will provide another route that will handel put request 
//To create a seller you must provide name image but not required a list of products
router.post('/add-seller-product',Auth,IsSeller,add_seller_product)

module.exports={add_seller_product_route:router}