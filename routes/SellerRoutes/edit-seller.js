const express=require('express')
const {Auth,IsSeller}=require('../../middlewares/auth')
const router=express.Router()
const {edit_seller} =require('../../controllers/sellers')
const {body}= require('express-validator') 
const {validatereq}=require('../../middlewares/validateReq')
router.put('/edit-seller',Auth,IsSeller,
[
    body('sellerId').isMongoId().withMessage('seller id must be valid'),
    body('name').optional().isLength({min:2,max:255}).withMessage('name must be at least 3 chars long and 255 max'),
],
validatereq
,edit_seller)

module.exports={edit_seller_route:router}