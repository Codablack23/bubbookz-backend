// function Add() {
//    console.log("hello") 
// }

// Add()

// const Add = (height,age,name)=>`you are ${name} and you are ${height}cm tall and you are ${age} years old`

const printResult = (addNumber,num1,num2)=>{
   let res = num1 + num2
   addNumber(res)
}
const add = (num)=>{
    console.log(num)
}


printResult(add,2,4)