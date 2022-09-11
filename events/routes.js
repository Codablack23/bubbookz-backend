const express = require("express")
const { getEvents, getEvent, eventRegister } = require("./controller")

const eventRouter = express.Router()

eventRouter.use(express.json())

eventRouter.get("/",getEvents)
eventRouter.get("/:id",getEvent)
eventRouter.post("/register/:id",eventRegister)

module.exports = eventRouter