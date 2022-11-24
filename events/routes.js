const express = require("express")
const { getEvents, getEvent, eventRegister, getSubEvents, getEventTicket } = require("./controller")

const eventRouter = express.Router()

eventRouter.use(express.json())

eventRouter.get("/",getEvents)
eventRouter.post("/register/:id",eventRegister)
eventRouter.get("/subscribed",getSubEvents)
eventRouter.get("/tickets/:ticket_id",getEventTicket)
eventRouter.get("/:id",getEvent)

module.exports = eventRouter