const express = require ('express');
const {
    userSignUp, 
    userLogin, 
    logoutHandler, 
    getEvents, 
    getCommunities, 
    changePassword, 
    addAddress,
    getOrders,
    updateAddress,
    updateDetails,
    updatePreference,
    updateStudentDetails,
    updateAlertPref,
    getAddress,
    getUserDetails,
    getUserSchoolDetails,
    getPreference,
    getAlertPreference,
    checkUser,
    getSingleAddress,
    getOrder,
    createOrder,
    handleGoogleSignUp,
    handleGoogleLogin
} = require('./controller');
const userRoute = express.Router();
const {authenticate} = require('../services/auth');

userRoute.use(express.json());

//user authentication and registration endpoints
userRoute.post('/login', userLogin);
userRoute.post('/register', userSignUp);
userRoute.post("/google-login",handleGoogleLogin)
userRoute.post("/google-signup",handleGoogleSignUp)
userRoute.post('/logout', authenticate, logoutHandler);
userRoute.post('/reset-password/:id');
userRoute.post("/auth",authenticate,checkUser)

//user dashboard endpoints 
userRoute.post('/events',authenticate,getEvents);
userRoute.post('/orders',authenticate,getOrders)
userRoute.post('/orders/create',authenticate,createOrder)
userRoute.post('/orders/:id',authenticate,getOrder)
userRoute.post('/communities',authenticate,getCommunities);

//orders


//user settings endpoints

userRoute.post('/settings/change-password',authenticate,changePassword);

userRoute.post('/settings/address',authenticate,getAddress);
userRoute.post("/settings/address/:id",authenticate,getSingleAddress)
userRoute.post('/settings/address/add',authenticate,addAddress);
userRoute.post('/settings/address/update/:id',authenticate,updateAddress);

userRoute.post('/settings/',authenticate,getUserDetails)
userRoute.post("/settings/edit",authenticate,updateDetails)
userRoute.post("/settings/student-details",authenticate,getUserSchoolDetails)
userRoute.post("/settings/student-details/update",authenticate,updateStudentDetails)

userRoute.post("/settings/preferences",authenticate,getPreference)
userRoute.post("/settings/preferences/update",authenticate,updatePreference)

userRoute.post("/settings/notifications",authenticate,getAlertPreference)
userRoute.post("/settings/notifications/update",authenticate,updateAlertPref)

module.exports = userRoute;
