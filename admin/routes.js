const express = require("express")
const {authenticateAdmin} = require("../services/auth")
const {
    handleLogin,
    handleRegister,
    handleLogout,
    addBook,
    getCustomers, 
    getCategories, 
    addFaculty, 
    addSchool,
    addDepartment,
    addEvent,
    authenticate,
    editProfile,
    changePassword,
    getOrders,
    getOrder,
    updateOrder,
    updateCommunityStatus,
    editBook,
    deleteBook,
    editEvent
} = require("./controllers")

const adminRoute = express.Router()
adminRoute.use(express.json())

//authentication routes
adminRoute.post("/login",handleLogin)
adminRoute.post("/signup",handleRegister)
adminRoute.post("/logout",authenticateAdmin,handleLogout)
adminRoute.post('/change-password',authenticateAdmin,changePassword)
adminRoute.post("/",authenticateAdmin,authenticate)

//settings routes
adminRoute.post('/update-profile',authenticateAdmin,editProfile)

//events routes
adminRoute.post('/add-event',authenticateAdmin,addEvent)
adminRoute.post('/edit-event/:event_id',authenticateAdmin,editEvent)

//community routes
adminRoute.post("/update-community/:id",authenticateAdmin,updateCommunityStatus)

//book routes
adminRoute.post("/add-book",authenticateAdmin,addBook)
adminRoute.post("/edit-book/:book_id",authenticateAdmin,editBook)
adminRoute.post("/delete-book/:book_id",authenticateAdmin,deleteBook)

//order routes 
adminRoute.post("/orders",authenticateAdmin,getOrders)
adminRoute.post("/orders/:id",authenticateAdmin,getOrder)
adminRoute.post("/order/update/:id",authenticateAdmin,updateOrder)


//customers routes
adminRoute.post("/customers",authenticateAdmin,getCustomers)

//categories routes
adminRoute.post("/categories",authenticateAdmin,getCategories)
adminRoute.post("/add-faculty",authenticateAdmin,addFaculty)
adminRoute.post("/add-school",authenticateAdmin,addSchool)
adminRoute.post("/add-department/:fid",authenticateAdmin,addDepartment)


module.exports = adminRoute