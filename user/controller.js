const {User} = require('./models')
const validateForms = require("../services/validator")
const bcrypt = require("bcrypt")


async function userLogin(req,res){
  const result ={
    status:"Bad Request",
    error:""
  }
  const {email, password} = req.body

  const error = validateForms([
    {inputField:email,inputType:"email"},
    {inputField:password,inputType:"password"}
  ])
  if(error.length === 0){
    try {
      const existingUser = await User.findOne({where:{Email:email}})
      if(existingUser === null){
        res.status(404)
        result.status = "Failed"
        result.message = "user does not exist"
      }
      else{
      const detailsIsCorrect = await bcrypt.compare(password,existingUser.Password)

       if(detailsIsCorrect){
          result.status = "Authorized"
          req.session.user = {email}
          result.user = {email}
       }
        else{
          res.status(503)
          result.status = "unauthorized"
          result.error = "Incorrect Password or Email"
        }

      }
    } catch (error) {
      console.log(err)
    }
  }else{
    res.status(403)
    result.status = "field error"
    result.error = error
  }
  res.json(result)
}


async function userSignUp(req,res){
  const result = {
    status:"Bad request",
    error:""
   }

   const {firstname,lastname,password,email,school,faculty,department} = req.body

  const error = validateForms([
    {inputField:email,inputType:"email"},
    {inputField:password,inputType:"password"},
    {inputField:firstname,inputType:"text",inputName:"FirstName"},
    {inputField:lastname,inputType:"text",inputName:"LastName"},
    {inputField:school,inputType:"text",inputName:"School"},
    {inputField:department,inputType:"text",inputName:"Department"},
    {inputField:faculty,inputType:"text",inputName:"Falculty"},
  ])
  if(error.length === 0){
    try {
       const userExists  = await User.findOne({where:{Email:email}})
       if(userExists === null){
         const passSalt = await bcrypt.genSalt()
         const hashedPassword = await bcrypt.hash(password,passSalt)
         await User.create({
          Last_Name:lastname,
          First_Name:firstname,
          Password:hashedPassword,
          Email:email,
          School:school,
          Faculty:faculty,
          Department:department,
         })

         req.session.user = {
          email,
         }
         
         result.status = "Success"
         result.user = req.session.user

         res.status(201)
       }
       else{
        res.status(403)
        result.status = "Failed"
        result.error = "user already exists"
       }
     } catch (error) {
      console.log(error)
      result.status = "Failed"
      result.error = "internal server error"
      res.status(500)
     }
  }else{
    res.status(400)
    result.status = "field error",
    result.error = error
  }

res.json(result)
}
async function logoutHandler(req,res){
   console.log(req.session)
   const response ={
    status:"",
   }
    await req.session.destroy()
    res.status(200)
    response.status = "Sucess"
    response.message = "Logged Out Successfully"

   res.json(response)
}
module.exports = {
  userSignUp,
  userLogin,
  logoutHandler
}