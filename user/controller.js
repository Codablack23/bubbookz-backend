const {User, Orders,AddressBook, AlertPreference, BookPreference} = require('./models')
const validateForms = require("../services/validator")
const bcrypt = require("bcrypt")
const { Query } = require('../services/queries')
const {books,communities,events, users} = require("../config")
const uuid = require("uuid")

async function checkUser(req,res){
  const {email} = req.session.user
  const loggedUser = await User.findOne({where:{email:email},attributes:[
    "account_type",
    "last_name",
    "first_name",
    "account_type",
    "email",
    "school",
    "faculty",
    "department",
    "profile_picture",
    "phone_no"
  ]})
   res.json({
    status:"logged in",
    user:loggedUser,
    error:""
   })
}
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
      const existingUser = await User.findOne({where:{email:email}})

      if(existingUser === null){
        result.status = "Failed"
        result.error = "user does not exist"
      }
      else{
      const detailsIsCorrect = await bcrypt.compare(password,existingUser.password)

       if(detailsIsCorrect){
        const loggedUser = await User.findOne({where:{email:email},attributes:[
          "account_type",
          "last_name",
          "first_name",
          "account_type",
          "email",
          "school",
          "faculty",
          "department",
          "profile_picture",
          "phone_no"
        ]})
          result.status = "Authorized"
          req.session.user = {email}
          result.user = loggedUser
       }
        else{
          result.status = "unauthorized"
          result.error = "Incorrect Password or email"
        }

      }
    } catch (error) {
      console.log(error)
      result.status = "Failed"
      result.error = "internal server error"
    }
  }else{
    result.status = "field error"
    result.error = error
  }
  res.json(result)
}
async function handleGoogleLogin(req,res){
  const result = {
    status:"Bad request",
    error:[]
   }
   const {email} = req.body
   try {
    const existingUser = await User.findOne({where:{email}})
    console.log({existingUser,email})
    if(existingUser){
      const userData = {
        last_name:existingUser.lastname,
        first_name:existingUser.firstname,
        email,
        school:existingUser.school,
        faculty:existingUser.faculty,
        account_type:existingUser.account_type,
        user_id:existingUser.user_id,
        profile_picture:existingUser.profile_picture,
        phone_no:existingUser.phone_no,
        department:existingUser.department,
      }
      result.status = "authorized"
      req.session.user = userData
      result.user = userData
    }
    else{
      result.status = "unauthorized"
      result.error = "User does not exist"
    }
   } catch (error) {
    console.log(error)
    result.status = "failed"
    result.error = "internal server error"
  }
  res.json(result)
}
async function handleGoogleSignUp(req,res){
  const result = {
    status:"Bad request",
    error:[]
   }
  const {firstname,lastname,email} = req.body
  try {
    const existingUser = await User.findOne({where:{email}})
    if(!existingUser){
      const user_id = uuid.v4().slice(0,6)
      await User.create({
        last_name:lastname,
        first_name:firstname,
        password:"",
        email:email,
        school:"",
        faculty:"",
        user_id,
        department:"",
        phone_no:"",
        profile_picture:"",
       })
       const userData = {
        last_name:lastname,
        first_name:firstname,
        email,
        school:"",
        faculty:"",
        account_type:"student",
        user_id,
        profile_picture:"",
        phone_no:"",
        department:"",
       }
       req.session.user = userData
       
       result.status = "success"
       result.user = userData
       result.message = "you have signed up successfully"
     
    }
    else{
      result.status = "Failed"
      result.error = "user already exists"
    }
  } catch (error) {
    console.log(error)
    result.status = "Failed"
    result.error = "internal server error"
  }
  res.json(result)
}


async function userSignUp(req,res){
  const result = {
    status:"Bad request",
    error:[]
   }

   const {firstname,lastname,password,email,school,faculty,department} = req.body

  const error = validateForms([
    {inputField:email,inputType:"email"},
    {inputField:password,inputType:"password"},
    {inputField:firstname,inputType:"text",inputName:"FirstName"},
    {inputField:lastname,inputType:"text",inputName:"LastName"},
    {inputField:school,inputType:"text",inputName:"school"},
    {inputField:department,inputType:"text",inputName:"department"},
    {inputField:faculty,inputType:"text",inputName:"faculty"},
  ])
  if(error.length === 0){
    try {
       const userExists  = await User.findOne({where:{email:email}})
       if(userExists === null){
        const user_id = uuid.v4().slice(0,6)
         const passSalt = await bcrypt.genSalt()
         const hashedPassword = await bcrypt.hash(password,passSalt)
         await User.create({
          last_name:lastname,
          first_name:firstname,
          password:hashedPassword,
          email:email,
          school:school,
          faculty:faculty,
          user_id,
          department:department,
         })

         const userData = {
          last_name:lastname,
          first_name:firstname,
          email,
          school:school,
          faculty:faculty,
          account_type:"student",
          user_id,
          profile_picture:"",
          phone_no:"",
          department:department,
         }
         req.session.user = userData
         
         result.status = "success"
         result.user = userData
         result.message = "you have signed up successfully"
       }
       else{
        result.status = "Failed"
        result.error = "user already exists"
       }
     } catch (error) {
      console.log(error)
      result.status = "Failed"
      result.error = "internal server error"
     }
  }else{
    result.status = "field error",
    result.error = error
  }

res.json(result)
}
async function logoutHandler(req,res){
   const response ={
    status:"",
    error:""
   }
    await delete req.session.user
    response.status = "success"
    response.message = "Logged Out Successfully"

   res.json(response)
}
async function getCommunities(req,res){
   let response = {
    status:"pending",
    error:"the process has just started"
   }
   const {email} = req.session.user
   const query = new Query(communities.Community)
   const result = await query.read("communities",{email:email})
   response = {...response,...result}

   res.json(response)
}
async function getUserDetails(req,res){
  const {email} = req.session.user
   const response = {
    status:"pending",
    error:"the process has just started",
   }
   try {
    const userinfo = await User.findOne({
      where:{
        email:email
      }
    })
    const lastname = userinfo.last_name
    const firstname = userinfo.first_name
    response.error = "",
    response.status = "success"
    response.details = {
      lastname,
      firstname,
      profile_picture:userinfo.profile_picture,
      email:userinfo.email,
      phone_no:userinfo.phone_no,
    }
   } catch (error) {
    response.status ="internal error"
    response.error ="an error occured in our servers please try again later"
   }
   res.json(response)
}
async function getUserSchoolDetails(req,res){
  const {email} = req.session.user
   const response = {
    status:"pending",
    error:"the process has just started",
   }
   try {
    const userinfo = await User.findOne({
      where:{
        email:email
      }
    })
    response.error = "",
    response.status = "success"
    response.details = {
      school:userinfo.school,
      faculty:userinfo.faculty,
      department:userinfo.department,
    }
   } catch (error) {
    response.status ="internal error"
    response.error ="an error occured in our servers please try again later"
   }
   res.json(response)
}
async function getOrders(req,res){
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const query = new Query(Orders)
  const queryResult = await query.read("orders",{createdBy:email})
  response ={...response,...queryResult}
  res.json(response)
}
async function getEvents(req,res){
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const {email} = req.session.user
  const eventSubQuery = new Query(events.EventSubscribers)
  const eventQuery = new Query(events.Events)

  const res1 = await eventSubQuery.read("subscribed",{email})
  const res2 = await eventQuery.read("events")
  const events_id = res1.subscribed?res1.subscribed.map(s=>s.event_id):[]
  const allevents = res2.events?res2.events:[]
  const events = []

  if(res1.status !="success" || res2 == "success"){
    response = res1
  }else{
    if(events_id.length !== 0){
      events_id.forEach(id => {
        allevents.forEach(e=>{
          if(e.event_id == id){
            events.push(e)
          }
        })
      });
      response.status ="success"
      response.error =""
      response.events = events
    }else{
      response.status ="success"
      response.error =""
      response.events = events
    }
  
  }
  res.json(response)
}

async function updateDetails(req,res){
  const {firstname,lastname,recieved_email,phone_no,profile_picture} = req.body
  const  {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const userQuery = new Query(User)
  const queryResponse = await userQuery.readOne({email:recieved_email},"user")
  if(queryResponse.user){
    const updateResponse = await userQuery.update({
      first_name:firstname,
      last_name:lastname,
      email:recieved_email,
      profile_picture,
      phone_no
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
  const {email} = req.session.user
   const {password} = req.body
   const query = new Query(User)
   const errors = validateForms([{inputField:password,inputType:"password"}])
   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(password,salt)
   if(errors.length === 0){
    const queryRes = await query.update({
      password:hashedPassword
    },{email})
    response = {...response,...queryRes}
   }else{
    response.status = "field error"
    response.error = errors[0].password
   }
   res.json(response)
}

async function updateStudentDetails(req,res){
  const {school,faculty,dept} = req.body
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const query = new Query(User)
  const errors = validateForms([
    {inputField:school,inputType:"text",inputName:"school"},
    {inputField:faculty,inputType:"text",inputName:"faculty"},
    {inputField:dept,inputType:"text",inputName:"department"},
  ])
  if(errors.length === 0){
    const queryResponse = await query.update({
      school:school,
      faculty:faculty,
      department:dept
    },{email:email})
    response = {...response,...queryResponse}
  }else{
     response.status = "field error"
     response.error = errors
  }
  res.json(response)
}
async function getAddress(req,res){
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const query = new Query(AddressBook);
  const queryRes = await query.read("address",{email})
  console.log(queryRes)
  response = {...response,...queryRes}
  res.json(response)
}
async function getSingleAddress(req,res){
  const {id} = req.params
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const query = new Query(AddressBook);
  const queryRes = await query.readOne({email,address_id:id},"address")
  console.log(queryRes)
  response = {...response,...queryRes}
  res.json(response)
}
async function addAddress(req,res){
  const {address,city,state,isDefault} = req.body
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const errors = validateForms([
    {inputField:city,inputType:"text",inputName:"city"},
    {inputField:state,inputType:"text",inputName:"state"},
    {inputField:address,inputType:"address"},
  ])
  if(errors.length === 0){
    const query = new Query(AddressBook);
    const address_id = uuid.v4();
    const queryResponse1 = await query.readOne({
      address:address.toLowerCase(),
      state: state.toLowerCase(),
      city:city.toLowerCase(),
      email,
    },"address")
 
    if(queryResponse1.status != "success" || queryResponse1.status != "500"){

      if(isDefault == true){
        await query.update({
          isDefault:false
        },{isDefault:true})
      }
      const queryResponse = await query.create({
        address:address.toLowerCase(),
        state:state.toLowerCase(),
        city:city.toLowerCase(),
        isDefault,
        address_id,
        email
        },"address")
    
        response = {...response,...queryResponse}
    }
    else{
      response.status = "failed"
      response.error = "you can't use the same address twice try a different one"
    }

  }else{
    response.status = "field error"
    response.error = errors
  }
  res.json(response)
}
async function updateAddress(req,res){
  const {id} = req.params
  const {address,city,state,isDefault} = req.body
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const errors = validateForms([
    {inputField:city,inputType:"text",inputName:"city"},
    {inputField:state,inputType:"text",inputName:"state"},
    {inputField:address,inputType:"address"},
  ])
  if(errors.length === 0){
    const query = new Query(AddressBook);
    if(isDefault == true){
      await query.update({
        isDefault:false
      },{isDefault:true})
    }
    const queryResponse = await query.update({
    address,
    state,
    city,
    isDefault
    },{email:email,address_id:id})
    response = {...response,...queryResponse}
  }else{
    response.status = "field error"
    response.error = errors
  }
  res.json(response)
}

async function updateAlertPref(req,res){
  const {community,comment_likes,events,book_arrival} = req.body
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const query = new Query(AlertPreference)
  const queryR = await query.readOne({email},"data")
  console.log(queryR)
  if(queryR.status === "404"){
    await query.create({community,comment_likes,events,book_arrival,email},"alerts")
  } 
  console.log({community,comment_likes,events,book_arrival,email})
  const queryRes = await query.update({community,comment_likes,events,book_arrival},{email:email})
  response = {...response,...queryRes}

  res.json(response)
}
async function updatePreference(req,res){
  const {pref} = req.body
  const {email} = req.session.user
  let response = {
    status:"pending",
    error:"the process has just started"
  }
  const errors = validateForms([{
    inputField:pref,inputType:"text",inputName:"preferences"
  }])
  if(errors.length === 0){
  const query = new Query(BookPreference)
  const findQuery = await query.read({email},"preference")
  if(findQuery.status == "404"){
     await query.create({
      pref_id:uuid.v4(),
      email,
      preferences:pref
     },"preference")
  }
  const queryRes = await query.update({
  preferences:pref
  },{email:email})
  console
  response = {...response,...queryRes}
  }else{
    response.status = "field error"
    response.error = errors[0].preferences
  }
  res.json(response)
}
async function getAlertPreference(req,res){
    const {email} = req.session.user
     let response = {
      status:"pending",
      error:"the process has just started",
     }
     const query = new Query(AlertPreference)
     const queryRes = await query.readOne({email},"notification")
     response = {...response,...queryRes}
     res.json(response)
}

  async function getPreference(req,res){
    const {email} = req.session.user
     let response = {
      status:"pending",
      error:"the process has just started",
     }
     const query = new Query(BookPreference)
     const queryRes = await query.readOne({email},"preferences")
     response = {...response,...queryRes}
     res.json(response)
  }

  async function getOrder(req,res){
    const {id} =req.params
    const {email} = req.session.user
    let response = {
      status:"pending",
      error:"the process has just started"
    }
    const query = new Query(Orders)
    const queryResult = await query.readOne({createdBy:email,order_id:id},"order")
    response ={...response,...queryResult}
    res.json(response)
  }

  async function createOrder(req,res){
   
    const order_id = uuid.v4()
   const response = {
    status:"pending",
    error:'the process has just started',
   }
   const {
     phone_number,
     shipping_method,
     shipping_location,
     payment_method,
     delivery_fee,
     payment_status,
     payment_price,
     items} = req.body
   const {email} = req.session.user

   try {
    await Orders.create({
      phone_number,
      createdBy:email,
      order_id,
      shipping_method,
      shipping_location,
      payment_method,
      payment_status,
      payment_price,
      delivery_fee,
      items
    })

    response.status = "success"
    response.order = order_id
    response.error =""

   } catch (error) {
    console.log(error)
    response.status = "failed"
    response.error = "an error occured in our server please try again later"
   }
   res.send(response)
  }
module.exports = {
  userSignUp,
  createOrder,
  userLogin,
  handleGoogleLogin,
  handleGoogleSignUp,
  logoutHandler,
  getCommunities,
  getOrders,
  getOrder,
  getEvents,
  updateDetails,
  updateStudentDetails,
  addAddress,
  getSingleAddress,
  updateAddress,
  changePassword,
  updateAlertPref,
  updatePreference,
  getAddress,
  getUserDetails,
  getUserSchoolDetails,
  getPreference,
  getAlertPreference,
  checkUser
}