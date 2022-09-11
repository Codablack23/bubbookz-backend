const express = require("express")
const { authenticate } = require("../services/auth")
const {
    getCommunities,
    likeCommunity,
    leaveCommunity,
    joinCommunity,
    getCommunity,
    unLikeCommunity,
    createCommunity
} = require("./controller")

const community = express.Router()
community.use(express.json())

community.get("/",getCommunities)
community.get("/:id",getCommunity)
community.post("/like/:id",authenticate,likeCommunity)
community.post("/create",authenticate,createCommunity)
community.post("/unlike/:id",authenticate,unLikeCommunity)
community.post("/join/:id",authenticate,joinCommunity)
community.post("/leave/:id",authenticate,leaveCommunity)



module.exports = community