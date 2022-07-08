const express = require('express')
const dotenv = require("dotenv").config()
const {routes,database} = require("./config/")
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const uuid = require("uuid")
const PORT = 5505

const app = express()


const {sequelize,sequelize_sqlite} = database

sequelize.sync().then(()=>{
    console.log("connected to db and created neccessary tables")
}).
catch(err=>{console.log(err)})


sequelize_sqlite.sync().then(()=>{
    console.log("created sqlite session store")
})

.catch(err=>{console.log(err)})

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret:process.env.SECRET_KEY,
    genid:uuid.v4,
    resave:false,
    saveUninitialized:false,
    store:new SequelizeStore({db:sequelize_sqlite}),
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge:1000 * 60 * 60 * 24 * 30,
    }
}
    
))

app.use('/user',routes.user)
app.listen(PORT,()=>{
    console.log(`Server Started at port ${PORT}`)
})
