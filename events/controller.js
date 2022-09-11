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
   const {email,name,phone} = req.body
   let errors = validateForms([
    {inputField:email,inputType:"email"},
    {inputField:name,inputType:"text",inputName:"Name"}
   ])
   if(phone){
    const phone_err = validateForms([
        {inputField:phone,inputType:"phone"}
    ])
    errors = [...errors,...phone_err]
   }

   const {id} = req.params
   const isValid = uuid.validate(id)
   if(errors.length === 0){
    if(isValid){
     try {
        const event = await Events.findOne({where:{event_id:id}})
        if(event){
           const subscriber_id = uuid.v4().slice(0,7)
  
           const subscribed = await EventSubscribers.create({
             email:email,
             phone_no:phone?phone:"",
             passcode:subscriber_id,
             event_id:id,
             name:name,
           })
           if(subscribed){
              await Events.update({no_of_reg:parseFloat(event.no_of_reg) + 1},{
               where:{
                  event_id:id
               }
              })
              
              response.status = "success"
              response.error = ""
              response.ticket = {
                  ...event,email,name,phone,passcode:subscriber_id
              } 
           }else{
              response.status = "server error"
              response.error = "an error occured with the server please check your network"
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

module.exports = {
   getEvents,
   getEvent,
   eventRegister
}