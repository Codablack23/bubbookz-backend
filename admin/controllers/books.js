const { Book } = require("../../book-store/models")
const uuid = require("uuid")
const validateFields = require("../../services/validator")


async function addBook(req,res){
   const {
    title,
    author,
    details,
    faculty,
    department,
    level,
    book_description,
    semester,
    format,
    price,
    book_link,
    expenses,
    discount_price,
    quantity,
    tags,
    book_img
   } = req.body
   const {admin} = req.session

   const response ={
    status:"pending",
    error:"the process is still pending"
   }
   const errors = validateFields([
    {inputField:title,inputType:"text",inputName:"title"},
    {inputField:author,inputType:"text",inputName:"author"},
    {inputField:book_description,inputType:"text",inputName:"book_description"},
    {inputField:department,inputType:"text",inputName:"department"},
    {inputField:faculty,inputType:"text",inputName:"faculty"},
    {inputField:level,inputType:"number",inputName:"Level"},
    {inputField:semester,inputType:"number",inputName:"semester"},
    {inputField:price,inputType:"number",inputName:"price"},
    {inputField:quantity,inputType:"number",inputName:"quantity"},
    {inputField:discount_price,inputType:"number",inputName:"discount_price"},
    {inputField:format,inputType:"word",inputName:"format"},
    {inputField:expenses,inputType:"number",inputName:"expenses"},
    {inputField:book_link,inputType:"link",inputName:"tags"},
    {inputField:book_img,inputType:"link",inputName:"book_img"},
   ])
   if(errors.length == 0){
    const book_id = uuid.v4()
    const bookObject = {
        book_id,
        title,
        author,
        book_details:details,
        faculty,
        department,
        level,
        book_description,
        semester,
        format,
        price,
        book_link,
        expenses,
        discount_price,
        in_stock:quantity,
        tags:tags?tags:"",
        book_img,
        vendor:admin.email
    }
    try {
        const bookResponse = await Book.create(bookObject)

        if(bookResponse){
          response.status = "success"
          response.error = ""
          response.book_id
        }

    } catch (error) {
        console.log(error)
        response.status = "server error",
        response.error = "they might be something wrong with our servers please try again later"
    }
   }else{
    response.status = "field errors",
    response.error = errors
   }
   res.json(response)
}


module.exports={
 addBook
}