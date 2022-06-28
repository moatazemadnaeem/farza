const express=require('express')
const {Auth}=require('../../middlewares/auth')
const router=express.Router()

const {get_sellers} =require('../../controllers/sellers')


router.get('/get-sellers',get_sellers)

module.exports={get_sellers_route:router}