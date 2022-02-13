require('dotenv').config()
const express =require('express') 
const cors=require('cors')
const cookieSession =require('cookie-session') 
require('express-async-errors')
const mongoose =require('mongoose') 
const { signup } =require('./routes/signup') 
const { signin } =require('./routes/signin') 
const { signout } =require('./routes/signout') 
const { current } =require('./routes/current-user') 
const { handelerr } =require('./middlewares/handelError') 
const {notfound}=require('./errorclasses/notfound')
const {BadReqErr}=require('./errorclasses/badReq')
const app=express()
const port=process.env.PORT||4000
app.set('trust proxy',true)
app.use(cors())
app.use(express.json())
//first we make the cookie not encrypted 

app.use(
    cookieSession({
        signed:false,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
)
app.use('/',(req,res)=>{
    res.send('Hello from the api')
})
app.use('/api/users',signup)
app.use('/api/users',signin)
app.use('/api/users',signout)
app.use('/api/users',current)
app.all('*',()=>{
    throw new notfound()
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