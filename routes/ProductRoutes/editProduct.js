const express=require('express')
const {editProduct}=require('../../controllers/products')
const {validatereq}=require('../../middlewares/validateReq')
const {body}= require('express-validator') 
const {Auth,IsSeller} =require('../../middlewares/auth')
const router=express.Router()

router.put('/edit_product',Auth,IsSeller,
[
    body('productId').isMongoId().withMessage('product id must be valid'),
    body('title').optional().isLength({min:2,max:255}).withMessage('title must be at least 3 chars long and 255 max'),
    body('price').optional().isNumeric().isFloat({min:0}).withMessage('price must be valid'),
    body('desc').optional().isLength({min:2,max:2000}).withMessage('desc must be at least 3 chars and 2000 max'),
    body('quantity').optional().isNumeric().isFloat({min:1}).withMessage('quantity should be at least one product'),
    body('factory').optional().isLength({min:2,max:255}).withMessage('factory must be at least 3 chars and 255 max'),
    body('warranty').optional().isLength({min:2,max:255}).withMessage('warranty must be at least 3 chars long and 255 max')
],
validatereq,
editProduct)
module.exports={edit_product:router}