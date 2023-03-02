const express = require('express')
const dotenv = require("dotenv").config()
const fileUpload = require("express-fileupload")
const {routes,database} = require("./config/")
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const uuid = require("uuid")
const cors = require("cors")
const { authenticateAdmin, authenticateAll } = require('./services/auth')
const { Uploads } = require('./admin/models')
const PORT = 5505
const oneMonth = 1000 * 60 * 60 * 24 * 30
const MB = 1024 * 1024
const app = express()
const fs = require('fs')
const server = require("http").createServer(app)


const {sequelize} = database

sequelize.sync({alter:true}).then(()=>{
    console.log("connected to db and created neccessary tables")
}).
catch(err=>{console.log(err)})


// sequelize_sqlite.sync().then(()=>{
//     console.log("created sqlite session store")
// })

.catch(err=>{console.log(err)})

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    limits:{fileSize:15 * MB},
    abortOnLimit:true,
    limitHandler:function(req,res,next){
        res.json({
            status:"failed",
            error:"file size exceeded 15MB"
        })
    }
}))
// const whitelist = [
//     "http://localhost:5503",
//     "http://localhost:3006",
//     "https://www.bubbookz.com",
//     "https://bubbookz.com",
//     "https://app.bubbookz.com",
//     "https://admin.bubbookz.com",
//     "https://bubbookz.vercel.app",
//     "https://bubbookz-admin.vercel.app"
// ]
app.use(cors({
    credentials:true,
    origin:[
    "http://localhost:5503",
    "http://localhost:3006",
    "https://www.bubbookz.com",
    "https://bubbookz.com",
    "https://app.bubbookz.com",
    "https://admin.bubbookz.com",
    "https://bubbookz.vercel.app",
    "https://bubbookz-admin.vercel.app"
    ]
}))



app.use(session({
    secret:process.env.SECRET_KEY,
    genid:uuid.v4,
    resave:false,
    saveUninitialized:false,
    proxy:true,
    name:"api.bubbookz",
    store:new SequelizeStore({db:sequelize}),
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge:oneMonth,
        sameSite:false,
    }
}
    
))

app.use('/user',routes.user)
app.use("/books",routes.book_store)
app.use("/communities",routes.communities)
app.use("/events",routes.events)
app.use("/admin",routes.admin)


app.post("/upload",authenticateAll,async function(req,res){
    const response = {
        status:'ongoing',
        error:"the process is still pending"
    }
    const id = uuid.v4()
    const file_name =`${id}-${req.files[0].name}`
   try {
    const fileUploadRes = await req.files[0].mv(`./public/uploads/${file_name}`)
    console.log(fileUploadRes)
    const domain = `${req.protocol}://${req.get('host')}`
    console.log(domain)
    const fileExists = fs.existsSync(`./public/uploads/${file_name}`)
    if(fileExists){
      const queryResponse = await Uploads.create({
         upload_id:id,
         name:req.files[0].name,
         url:`${domain}/uploads/${file_name}`,
         location:`./public/uploads/${file_name}`
        })
      if(queryResponse){
        response.status = "success"
        response.error = ""
        response.file = {
         id,
         name:req.files[0].name,
         url:`${domain}/uploads/${file_name}`
        }
      }
      else{
        fs.unlinkSync(`/public/uploads/${file_name}`)
        response.status = "upload error"
        response.error = "could not upload please try again later"
      }
    }
    else{
        response.status = "upload error"
        response.error = "could not upload please try again later"
    }
   } catch (error) {
    console.log(error)
    response.status = "server error"
    response.error = "an error occured in our server please try again later"
   } 
   res.send(response)
 })

server.listen(PORT,()=>{
    console.log(`Server Started at port ${PORT}`)
})
