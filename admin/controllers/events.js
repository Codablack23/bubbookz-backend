const { Op } = require("sequelize")
const { Events } = require("../../events/models")
const validateFields = require("../../services/validator")
const uuid = require("uuid")

async function addEvent(req,res){
 const {
    name,
    contact,
    date,
    location,
    reg_link,
    location_link,
    desc,
    img_link,
    event_time,
    hosts
 } = req.body
 const event_id = uuid.v4()
 const errors = validateFields([
    {inputField:name,inputType:"address",inputName:"Name"},
    {inputField:contact,inputType:"number"},
    {inputField:location,inputType:"address",inputName:"Location"},
    {inputField:reg_link,inputType:"link",inputName:"Registration_Link"},
    {inputField:location_link,inputType:"link",inputName:"Location_Link"},
    {inputField:img_link,inputType:"link",inputName:"Image_Link"},
    {inputField:desc,inputType:"address",inputName:"Description"},
 ])

 const response = {
    status:"pending",
    error:"the process is stil pending"
}
const currentdate = new Date()
if(errors.length > 0){
    response.error = errors
    response.status ="field error"
}else{
    try {
        const {email} = req.session.admin
        const findQuery = await Events.findOne({
            where:{
            name,
            event_date:{
                [Op.gte]:[currentdate]
            }
            }
        })
        if(findQuery){
            response.error = "event already exist please" 
            response.status ="failed"
        }else{
            await Events.create({
                name,
                contact_number:contact,
                event_date:date,
                location,
                registration_link:reg_link,
                location_link,
                description:desc,
                img_link,
                hosts,
                event_time,
                event_id,
                price:0.0
            })
            response.status = "success"
            response.error="",
            response.event_id  = event_id
        }
    } catch (error) {
        console.log(error)
        response.error = "sorry there are some issues with our server please try again later" 
        response.status ="server error"
    }
}
res.json(response)
}

module.exports ={
    addEvent
}