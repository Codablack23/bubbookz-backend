const express = require('express')
const {userSignUp,userLogin, logoutHandler} = require('./controller')
const userRoute = express.Router()
const {authenticate} = require("../services/auth")

userRoute.use(express.json())


userRoute.post('/login',userLogin)
userRoute.post('/register',userSignUp)
userRoute.post('/logout',authenticate,logoutHandler)

userRoute.post('/reset-password/:id',(req,res)=>{
    res.json({
        name:"Name"
    })
})


userRoute.get('/events',(req,res)=>{
    res.json({
        name:"Name"
    })
})
userRoute.get('/communities',(req,res)=>{
    res.json({
        name:"Name"
    })
})
userRoute.get('/settings',(req,res)=>{
    res.json({
        name:"Name"
    })
})
userRoute.post('/settings',(req,res)=>{
    res.json({
        name:"Name"
    })
})
userRoute.post('/orders',(req,res)=>{
    res.json({
        name:"Name"
    })
}).post("/orders",(req,res)=>{

})


module.exports = userRoute