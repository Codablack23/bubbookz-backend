const authController = require("./auth.js")
const bookController = require("./books")
const ordersController = require("./orders")
const categoryController = require("./categories")
const eventController = require("./events")
const {User} = require("../../user/models")
const { Community } = require("../../communities/models.js")

async function getCustomers(req,res){
   const response = {
    status:"pending",
    error:"the process has just started"
   }
   try {
    const customers = await User.findAll({
        attributes:[  
            "account_type",
            "createdAt",
            "department",
            "email",
            "faculty",
            "first_name",
            "last_name",
            "phone_no",
            "profile_picture",
            "school",
            "user_id"
        ]
    })
    response.status = "success"
    response.error=""
    response.customers = customers.map(customer=>{
        delete customer.password
        return customer
    })

   }catch (error) {
    console.log(error)
    response.error ="an internal error occured in our servers please try again later"
    response.status = "server error"
   }
   res.send(response)
}
async function updateCommunityStatus(req,res){
  const {id} = req.params
  const {status} = req.body
  const response = {
    status:"pending",
    error:"the process is still pending"
  }
  try{
    await Community.update({status},{
        where:{
            community_id:id
        }
    })
    response.status = "success"
    response.error = ""
    response.community_id = id
  }
  catch(err){
   console.log(err)
   response.status = "server error"
   response.error = "an error occurred in our server please try again later"
  }
  res.json(response)
}
module.exports = {
    ...authController,
    ...bookController,
    ...categoryController,
    ...eventController,
    ...ordersController,
    getCustomers,
    updateCommunityStatus,
}