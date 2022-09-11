const {Admin} = require('../models')
const { Query } = require('../../services/queries')
const validateForms = require("../../services/validator")
const bcrypt = require("bcrypt")

async function handleLogin(req,res){
  const {email,password} = req.body
  const result = {
    status:"pending",
    error:"process is still pending"
  }
  const error = validateForms([
    {inputField:email,inputType:"email"},
    {inputField:password,inputType:"password"}
  ])
  if(error.length === 0){
    try {
      const existingUser = await Admin.findOne({where:{email:email}})
      if(existingUser === null){
        result.status = "Failed"
        result.error = "admin does not exist"
      }
      else{
      const detailsIsCorrect = bcrypt.compareSync(password,existingUser.password)
        console.log(detailsIsCorrect)
       if(detailsIsCorrect){
          result.status = "success"
          result.error =""
          req.session.admin = {email}
          result.admin = {
            firstname:existingUser.first_name,
            lastname:existingUser.last_name,
            phone_no:existingUser.phone_no,
            email,
            profile_picture:existingUser.profile_picture,
            createdAt:existingUser.createdAt,
            location:existingUser.location,
            address:existingUser.location
          }
       }
        else{
          result.status = "unauthorized"
          result.error = "Incorrect Password or Email"
        }

      }
    } catch (error) {
      console.log(err)
      result.status = "server error"
      result.error = "An Error occured in our server please try again later"
    }
  }else{
    result.status = "field error"
    result.error = error
  }
  res.json(result)
}

async function handleRegister(req,res){
    const result = {
        status:"pending",
        error:"The process is still pending"
       }
    
       const {firstname,lastname,password,email,phone} = req.body
    
      const error = validateForms([
        {inputField:email,inputType:"email"},
        {inputField:password,inputType:"password"},
        {inputField:firstname,inputType:"text",inputName:"FirstName"},
        {inputField:lastname,inputType:"text",inputName:"LastName"},
        {inputField:phone,inputType:"phone"},
      ])
      if(error.length === 0){
        try {
           const userExists  = await Admin.findOne({where:{email:email}})
           if(userExists === null){
             const passSalt = await bcrypt.genSalt()
             const hashedPassword = await bcrypt.hash(password,passSalt)
             await Admin.create({
              last_name:lastname,
              first_name:firstname,
              password:hashedPassword,
              email:email,
              phone_no:phone,
             })
    
             req.session.admin = {
              email,
             }
             
             result.status = "success"
             result.admin ={
              ...req.session.
              admin,
              firstname,
              lastname,
              phone_no:phone,
              profile_picture:"",
              location:"",
              address:""
             }
    
             res.status(201)
           }
           else{
            result.status = "failed"
            result.error = "user already exists"
           }
         } catch (error) {
          console.log(error)
          result.status = "failed"
          result.error = "internal server error"
         }
      }else{
        result.status = "field error",
        result.error = error
      }
    
    res.json(result)
}
async function handleLogout(req,res){
    const response ={
        status:"",
        error:[]
       }
        await delete req.session.admin
        response.status = "sucess"
        response.message = "Logged Out Successfully"
    
       res.json(response)
}
async function authenticate(req,res){
  const {email} = req.session.admin
  const response = {
    status:"pending",
    error:"the process is still pending"
  }
   try {
    const user = await Admin.findOne({
      attributes:["last_name","first_name","email","phone_no","profile_picture","location","address"],
      where:{
        email
      }
    })
    response.status ="logged in"
    response.error = ""
    response.admin = user
   } catch (error) {
    console.log(error)
    response.status = "failed"
    response.error = "internal server error"
   }
   res.json(response)
}
async function editProfile(req,res){
  const {firstname,lastname,recieved_email,phone_no,profile_picture,location,address} = req.body
  const  {email} = req.session.admin
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const userQuery = new Query(Admin)
  const queryResponse = await userQuery.readOne({email:recieved_email},"user")
  if(queryResponse.user){
    const updateResponse = await userQuery.update({
      first_name:firstname,
      last_name:lastname,
      email:recieved_email,
      profile_picture,
      phone_no,
      location,
      address
    },{email:email})
    req.session.user = (updateResponse.status == "success" && (email.toLowerCase() != recieved_email.toLowerCase()))
    ?{email:recieved_email}:
    req.session.user
    response = {...response,...updateResponse}
  }else{
    response = {...response,...queryResponse}
  }
  res.json(response)
}

async function changePassword(req,res){
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const {email} = req.session.admin
  const {current_password,new_password} = req.body
  const query = new Query(Admin)
  const errors = validateForms(
    [
      {inputField:current_password,inputType:"password",inputName:"Current_Password"},
      {inputField:new_password,inputType:"password",inputName:"New_Password"}
  ])
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(new_password,salt)

  if(errors.length === 0){
   const findQuery = await query.readOne({email},"admin")
   const passCheck = await bcrypt.compare(current_password,findQuery.admin.password)
   if(passCheck){
    const queryRes = await query.update({
      password:hashedPassword
    },{email})
    response = {...response,...queryRes}
   }else{
     response.status = "password error"
     response.error = "your current password provided is not the same as your password"
   }
  }else{
   response.status = "field error"
   response.error = errors
  }
  res.json(response)
}
module.exports = {
    handleLogin,
    handleRegister,
    handleLogout,
    authenticate,
    editProfile,
    changePassword
}