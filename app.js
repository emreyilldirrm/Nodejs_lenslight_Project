import express from 'express'
import dotenv from 'dotenv'
import conn from './db.js'
import pageRouter from './routes/pageRouter.js'
import photoRouter from './routes/photoRouter.js'
import userRouter from './routes/userRouter.js'
import methodOverride  from 'method-override' //put isteklerini tarayıcıda işlemek için kullanıyoruz
import cookieParser from 'cookie-parser'
import { checkUser } from './middlewares/authMiddleware.js'
import fileUpload from 'express-fileupload'
import { v2 as clouidanry } from 'cloudinary'

dotenv.config()

clouidanry.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

//connection to the DB
conn()


const app = express()
const port = process.env.PORT

// ejs template engine
app.set("view engine","ejs")


//static files middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload({useTempFiles:true}))
app.use(methodOverride('_method',{
    methods: ['POST','GET']
}))

app.use("*",checkUser)//tüm isteklerinde bu metodlarında bu fonksiyonu çalıştır
app.use("/",pageRouter)
app.use("/photos",photoRouter)
app.use("/users",userRouter)


app.listen(port,()=>{
    console.log(`Application on running on port : ${port}`)
})