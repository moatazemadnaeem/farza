const express =require('express')
const {getRegisteredCourses} =require('../controllers/courses')
const {Auth} =require('../middlewares/auth')
const router=express.Router()

router.get('/get_courses',Auth,getRegisteredCourses)
module.exports={get_courses:router}