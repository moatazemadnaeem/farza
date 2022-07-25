require('dotenv').config()
const express =require('express') 
const cors=require('cors')
const cookieSession =require('cookie-session') 
require('express-async-errors')
const fileUpload = require('express-fileupload');

const mongoose =require('mongoose') 
//Auth
const { signup } =require('./routes/signup') 
const { signin } =require('./routes/signin') 
const { signout } =require('./routes/signout') 
const { current } =require('./routes/current-user') 
const {updateUser} =require('./routes/update-user')
const {delete_user} =require('./routes/deleteUserByAdmin')
const {get_users} =require('./routes/get_users')
// Sellers
const {create_seller_route}=require('./routes/SellerRoutes/create-seller')
const {get_sellers_route}=require('./routes/SellerRoutes/get-sellers')
const {get_seller_by_user_route} = require('./routes/SellerRoutes/get-sellers-by-user')
const {add_seller_product_route} = require('./routes/ProductRoutes/add-seller-products')
const {list_all_products_route} = require('./routes/ProductRoutes/list_all_products')
const {list_all_products_based_on_categories_route} = require('./routes/ProductRoutes/list_all_products_based_on_categories')
// Orders
const {create_order_route}=require('./routes/OrderRoutes/create-order')

const { handelerr } =require('./middlewares/handelError') 
const {notfound}=require('./errorclasses/notfound')
const {BadReqErr}=require('./errorclasses/badReq')

const redis = require('redis');

const client = redis.createClient(6379,process.env.REDIS_HOST);
client.on('connect',()=>{
    console.log('connected!!!!!!!!')
})
client.on('error', err => {
    console.log('Error ' + err);
});
const path = require('path')
const app=express()
const port=process.env.PORT||9000
app.use(fileUpload({
    createParentPath: true
}));
app.use('/static', express.static(path.join(__dirname, 'images')))
//app.set('trust proxy',true)

app.use(cors())
app.use(express.json())
//first we make the cookie not encrypted 
//one month the cookie will last 
app.use(
    cookieSession({
        signed:false,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
)
//Auth
app.use('/api/users',signup)
app.use('/api/users',signin)
app.use('/api/users',signout)
app.use('/api/users',current)
app.use('/api/users',updateUser)
app.use('/api/users',delete_user)
app.use('/api/users',get_users)
//Sellers
app.use('/api/sellers',create_seller_route)
app.use('/api/sellers',get_sellers_route)
app.use('/api/sellers',get_seller_by_user_route)
//Products
app.use('/api/products',add_seller_product_route)
app.use('/api/products',list_all_products_route)
app.use('/api/products',list_all_products_based_on_categories_route)
//Orders
app.use('/api/orders',create_order_route)

app.all('*',()=>{
    throw new notfound('can not find this page please try again')
})
app.use(handelerr)
const start=async()=>{
    if(!process.env.JWT_KEY){
        throw new BadReqErr('Jwt is not defined')
    }
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('connected to db')
    }catch (err){
        console.log(err,'err to connect')
    }

    app.listen(port,()=>{
        console.log(`listening in port ${port}`)
    })
}
start()