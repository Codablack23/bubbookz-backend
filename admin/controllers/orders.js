const { Orders, User } = require("../../user/models")

async function updateOrder(req,res){
  const {id} = req.params
  const {status,delivered_by} = req.body
  const response = {
    status:"pending",
    error:"the process has just started"
  }
  try {
    await Orders.update({status,delivered_by},{
        where:{
            order_id:id
        }
    })
    response.status ="success"
    response.error = ""
  } catch (error) {
    response.status ="failed"
    response.error = "An error occured in our server please try again later"
  }
  res.send(response)
}
async function getOrder(req,res){
    const {id} = req.params
    const response = {
      status:"pending",
      error:"the process has just started"
    }
    try {
      const order = await Orders.findOne({where:{order_id:id}})
      const user = await User.findOne({
        where:{
            email:order.createdBy
        },
        attributes:["first_name","last_name","profile_picture"]
      })
      response.status ="success"
      response.error = ""
      response.order = {
        ...order.dataValues,
        profile:user.profile_picture,
        firstname:user.first_name,
        lastname:user.last_name,
        full_name:`${user.first_name} ${user.last_name}`
      }
    } catch (error) {
      response.status ="failed"
      response.error = "An error occured in our server please try again later"
    }
    res.send(response)
}
async function getOrders(req,res){
    const response = {
        status:"pending",
        error:"the process has just started"
      }
      try {
        const orders = await Orders.findAll()
        response.status ="success"
        response.error = ""
        response.orders = orders
      } catch (error) {
        response.status ="failed"
        response.error = "An error occured in our server please try again later"
      }
      res.send(response)
}
module.exports = {
   updateOrder,
   getOrders,
   getOrder
}