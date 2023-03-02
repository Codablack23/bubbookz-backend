const {Book,BookReviews} = require("./models")

async function getBooks(req,res){
  const response = {
    status:"pending",
    error:"proccess is still pending"
  }

  try {
    const books = await Book.findAll()
    const reviews = await BookReviews.findAll()
    response.books = books
    response.reviews = reviews
    response.status = "success"
    response.error = ""
  } catch (error) {
    response.status = "server error",
    response.error ="couldn't get books due an internal error please check your internet and try again" 
  }
  res.json(response)
}
async function getBook(req,res){
  const {id} = req.params
  console.log(id)
  const response = {
    status:"pending",
    error:"proccess is still pending"
  }

  try {
    const book = await Book.findOne({
      where:{
        book_id:id
      }
    })
    const reviews = await BookReviews.findAll({
      where:{
        book_id:id
      }
    })
    console.log(book)
    if(book){
      response.book = book
      response.reviews = reviews
      response.status = "success"
      response.error = ""
    }else{
      response.status = "not found"
      response.error = "the bok you are looking for does not exist or have been moved"
    }
  } catch (error) {
    response.status = "server error",
    response.error ="couldn't get books due an internal error please check your internet and try again" 
  }
  res.json(response)
}

module.exports ={
    getBooks,
    getBook
}