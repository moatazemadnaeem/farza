const express =require('express')
const {registerCourses} =require('../controllers/courses')
const {Auth} =require('../middlewares/auth')
const router=express.Router()

router.patch('/register_courses',Auth,registerCourses)
module.exports={courses:router}