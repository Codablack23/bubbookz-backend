const express = require('express')
const {getBooks,getBook} = require("./controller")


const bookStore = express.Router()

bookStore.use(express.json())

bookStore.get("/",getBooks)
bookStore.get("/:id",getBook)

module.exports =  bookStore