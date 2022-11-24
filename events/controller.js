const {Events,EventSubscribers} = require("./models")
const uuid = require("uuid")
const validateForms = require("../services/validator")

async function getEvents(req,res){
   const response = {
    status:"pending",
    error:"the current process is pending"
   }
   try {
    const data = await Events.findAll()
    
    response.status = "success"
    response.error = ""
    response.events = data
   } catch (error) {
     response.status = "server error"
     response.error = "sorry we couldn't retrieve the events at the moment please try again later"
   }
   res.json(response)
}
async function getEvent(req,res){
  const {id} = req.params
  const response = {
    status:"pending",
    error:"the current process is pending"
   }
   const isValid = uuid.validate(id)
   // if(isValid){
    try {
        const data = await Events.findOne({
            where:{
                event_id:id
            }
        })
        if(data){
            response.status = "success"
            response.error = ""
            response.event = data
        }else{
            response.status = "not found"
            response.error = "The event you are looking for does not exist or has been moved or deleted"
        }
       } catch (error) {
         response.status = "server error"
         response.error = "sorry we couldn't retrieve the events at the moment please try again later"
       }
   // }else{
   //  response.status = "invalid id"
   //  response.error = "Please send a valid id string"
   // }
   res.json(response)
}
async function eventRegister(req,res){
   const response = {
    status:"pending",
    error:"the current process is pending"
   }
   const {email,name,phone,total,discount} = req.body
   let errors = validateForms([
    {inputField:email,inputType:"email"},
    {inputField:name,inputType:"text",inputName:"Name"},
    {inputField:phone,inputType:"phone"}
   ])

   const {id} = req.params
   const isValid = uuid.validate(id)
   if(errors.length === 0){
    if(isValid){
     try {
        const event = await Events.findOne({where:{event_id:id}})
        if(event){
           
           const subscriber = await EventSubscribers.findOne({
            where:{
              email
            }
           })
          if(subscriber === null){
            const subscriber_id = uuid.v4().slice(0,7)
            const createdAt = new Date()
            const reg_id = uuid.v4()
              await EventSubscribers.create({
              email:email,
              phone_no:phone,
              passcode:subscriber_id,
              event_id:id,
              reg_id,
              name:name,
              total,
              discount
            })
               await Events.update({no_of_reg:parseFloat(event.no_of_reg) + 1},{
                where:{
                   event_id:id
                }
               })
               
               response.status = "success"
               response.error = ""
               response.ticket = {
                   ...event.dataValues,
                   event_name:event.name,
                   host:'[]',
                   email,
                   name,
                   phone,
                   passcode:subscriber_id,
                   reg_id,
                   total,
                   discount,
                   createdAt
               } 
          }else{
            response.status = "not allowed"
            response.error = "You have already subscribed for this event please check your dashboard for your ticket"
         
          }
        }else{
          response.status = "not found"
          response.error = "The event you are looking for does not exist or has been moved or deleted"
        }
     } catch (error) {
        console.log(error)
        response.status = "server error"
        response.error = "an error occured with the server please check your network"
     }
    }else{
        response.status = "invalid id"
        response.error = "id does not meet the required format"
    }
   }else{
    response.status = "field error"
    response.error = errors
   }
   res.json(response)
}
async function getSubEvents(req,res){
  
  const result = {
    status:"pending",
    error:"pending"
  }
  try {
    const {email} = req.session.user
   const subbedEvents = await EventSubscribers.findAll({where:{email}})
   const subEvents = (await EventSubscribers.findAll({where:{email}})).map(e=>e.event_id)
   const allEvents = await Events.findAll()
 
   const events = allEvents.filter(e=>subEvents.includes(e.event_id))
   
   result.status = "success"
   result.error = ""
   result.events = events.map(e=>({
    ...e.dataValues,
    ticket_id:subbedEvents.find(se=>subEvents.includes(e.event_id)).reg_id
   }))
     
   
  } catch (error) {
    result.status ="internal server error"
    result.error = "an error occurred while fetching data"
  }

  res.json(result)
}
async function getEventTicket(req,res){
  const result = {
    status:"pending",
    error:"pending"
  }
  try {
    const {email} = req.session.user
    const {ticket_id} = req.params

    const ticket = await EventSubscribers.findOne({
      where:{
        email,
        reg_id:ticket_id
      }
    })
    console.log(ticket)
    if(ticket){
      result.status = "success"
      result.error=""
      result.ticket = {
        ...ticket.dataValues,
        ...( await Events.findOne({
          where:{
            event_id:ticket.event_id
          }
        })).dataValues
      }
    }
    else{
      result.status = "Not Found"
      result.error="The ticket you are looking does not exist or have been deleted"
      result.ticket = ticket
    }
  } catch (error) {
    result.status ="internal server error"
    result.error = "an error occurred while fetching data"
  }
  res.json(result)
}

module.exports = {
   getEvents,
   getEvent,
   eventRegister,
   getSubEvents,
   getEventTicket
}