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
const {verfiy_user}=require('./routes/verfiy-user')
const {add_profile_pic}=require('./routes/AddprofileImg')
// Sellers
const {create_seller_route}=require('./routes/SellerRoutes/create-seller')
const {get_sellers_route}=require('./routes/SellerRoutes/get-sellers')
const {get_seller_by_user_route} = require('./routes/SellerRoutes/get-sellers-by-user')
const {edit_seller_route} = require('./routes/SellerRoutes/edit-seller')
const {get_nearest_route} = require('./routes/SellerRoutes/getNearestSellersProducts')
const {get_seller_products_route} = require('./routes/SellerRoutes/getSellerProducts')
//Products
const {add_seller_product_route} = require('./routes/ProductRoutes/add-seller-products')
const {add_image_product_route}=require('./routes/ProductRoutes/add_image_product')
const {list_all_products_route} = require('./routes/ProductRoutes/list_all_products')
const {list_all_products_based_on_categories_route} = require('./routes/ProductRoutes/list_all_products_based_on_categories')
const {acceptProduct} = require('./routes/ProductRoutes/accept_product_route')
const {list_not_accepted_products_route} = require('./routes/ProductRoutes/list_not_accepted')
const {list_accepted_products_route} = require('./routes/ProductRoutes/list_accepted')
const {edit_product} = require('./routes/ProductRoutes/editProduct')
const {add_video_product_route} = require('./routes/ProductRoutes/add_video_product')
const {disallowProduct} = require('./routes/ProductRoutes/disallow_product')
const {remove_image_product_route} = require('./routes/ProductRoutes/remove_img_product')
const {remove_video_product_route} = require('./routes/ProductRoutes/remove_video')
// Orders
const {create_order_route}=require('./routes/OrderRoutes/create-order')
const {awaiting_delivering_route}=require('./routes/OrderRoutes/awaiting_delivering')
const {mark_delivered_route}=require('./routes/OrderRoutes/mark_order_delivered')
const {cancell_order_admin_route}=require('./routes/OrderRoutes/cancell_by_admin')
const {cancell_order_user_route}=require('./routes/OrderRoutes/cancell_by_user')
const {get_orders_user_route}=require('./routes/OrderRoutes/get_orders_by_user')
//Cart
const {add_cart_items_route}=require('./routes/cartRoutes/add')
const {get_cart_items_route}=require('./routes/cartRoutes/getCartItems')
const {delete_cart_items_route}=require('./routes/cartRoutes/deleteCartItem')
const {clear_cart_items_route}=require('./routes/cartRoutes/clearAllCart')
const {set_quantity_route}=require('./routes/cartRoutes/doQuantityRoute')
//Payments
const {create_payment_route}=require('./routes/PaymentRoutes/create-payment')
const {get_payment_route}=require('./routes/PaymentRoutes/get_payment')
const {show_payment_route}=require('./routes/PaymentRoutes/ShowPaymentForAdmin')
const {accept_payment_route}=require('./routes/PaymentRoutes/AdminAccept')
const {reject_payment_route}=require('./routes/PaymentRoutes/AdminReject')
const {awaiting_payment_accept_route}=require('./routes/PaymentRoutes/getAwaitingToBeAccepted')
const {cash_payment_route}=require('./routes/PaymentRoutes/PayWithCash')

const { handelerr } =require('./middlewares/handelError') 
const {notfound}=require('./errorclasses/notfound')
const {BadReqErr}=require('./errorclasses/badReq')


const path = require('path')
const app=express()
const port=process.env.PORT||9000
app.use(fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
    createParentPath: true,

}));
app.use('/static', express.static(path.join(__dirname, 'images')))
//app.set('trust proxy',true)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded());
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
app.use('/api/users',add_profile_pic)
// app.use('/api/users',verfiy_user)
//Sellers
app.use('/api/sellers',create_seller_route)
app.use('/api/sellers',get_sellers_route)
app.use('/api/sellers',get_seller_by_user_route)
app.use('/api/sellers',edit_seller_route)
app.use('/api/sellers',get_nearest_route)
app.use('/api/sellers',get_seller_products_route)
//Products
app.use('/api/products',add_seller_product_route)
app.use('/api/products',list_all_products_route)
app.use('/api/products',list_all_products_based_on_categories_route)
app.use('/api/products',add_image_product_route)
app.use('/api/products',acceptProduct)
app.use('/api/products',list_not_accepted_products_route)
app.use('/api/products',list_accepted_products_route)
app.use('/api/products',edit_product)
app.use('/api/products',disallowProduct)
app.use('/api/products',add_video_product_route)
app.use('/api/products',remove_image_product_route)
app.use('/api/products',remove_video_product_route)
//Orders
app.use('/api/orders',create_order_route)
app.use('/api/orders',awaiting_delivering_route)
app.use('/api/orders',mark_delivered_route)
app.use('/api/orders',cancell_order_admin_route)
app.use('/api/orders',cancell_order_user_route)
app.use('/api/orders',get_orders_user_route)
//Cart
app.use('/api/cart',add_cart_items_route)
app.use('/api/cart',get_cart_items_route)
app.use('/api/cart',delete_cart_items_route)
app.use('/api/cart',clear_cart_items_route)
app.use('/api/cart',set_quantity_route)
//payments
// app.use('/api/payments',create_payment_route)
// app.use('/api/payments',get_payment_route)
app.use('/api/payments',cash_payment_route)
app.use('/api/payments',awaiting_payment_accept_route)
app.use('/api/payments',accept_payment_route)
app.use('/api/payments',reject_payment_route)
app.use('/api/payments',show_payment_route)
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