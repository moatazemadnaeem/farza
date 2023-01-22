const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()
const {getNearestSellersProducts} =require('../../controllers/sellers')

router.get('/get-nearest',Auth,getNearestSellersProducts)

module.exports={get_nearest_route:router}