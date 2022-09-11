const { School, Faculty } = require("../models")
const validateFields= require("../../services/validator")
const uuid = require("uuid")

async function getCategories(req,res){
    const {email} = req.session.admin
    const response = {
        status:"pending",
        error:"the process has just started"
    }
    try {
        const schools = await School.findAll({
            where:{
                admin:email
            }
        })
        const faculties = await Faculty.findAll({
            where:{
                admin:email
            }
        })
        response.error = ""
        response.status = "success"
        response.schools = schools
        response.faculties = faculties

    } catch (error) {
       response.error = "sorry there are some issues with our server please try again later" 
       response.status ="server error"
    }
    res.json(response)
}

async function addSchool(req,res){
    const {email} = req.session.admin
    const {school} = req.body
    const id = uuid.v4()

    const response = {
        status:"pending",
        error:"the process has just started"
    }
    const errors = validateFields([
        {inputField:school,inputType:"text",inputName:"school"}
    ])
    if(errors.length == 0){
        try {
            const existingSchool = await School.findOne({
                where:{
                    schoolname:school.toLowerCase(),
                    admin:email
                }
            })
            if(existingSchool){
                response.error = "school already exist please try another one" 
                response.status ="server error"
            }else{
             await School.create({
                school_id:id,
                schoolname:school.toLowerCase(),
                admin:email
              })
              response.error=""
              response.status="success",
              response.message = "school added successfully"
            }
        } catch (error) {
            console.log(error)
            response.error = "sorry there are some issues with our server please try again later" 
            response.status ="server error"
        }
    }else{
        response.error = errors[0].error
        response.status ="field error"
    }
    res.json(response)
}

async function addFaculty(req,res){
    const {email} = req.session.admin
    const {faculty,departments} = req.body
    const id = uuid.v4()

    const response = {
        status:"pending",
        error:"the process has just started"
    }
    const deptCheck = (
    departments ?
    [{inputField:departments,inputType:"text",inputName:"departments"}]
    :[]
    )
    const errors = validateFields([
        {inputField:faculty,inputType:"text",inputName:"faculty"},
        ...deptCheck
    ])
    if(errors.length == 0){
        try {
            const existingFaculty = await Faculty.findOne({
                where:{
                    name:faculty.toLowerCase(),
                    admin:email
                }
            })
            if(existingFaculty){
                response.error = "faculty already exist please try another one" 
                response.status ="server error"
            }else{
             await Faculty.create({
                faculty_id:id,
                name:faculty.toString(),
                departments:departments ?departments:"",
                admin:email
              })
              response.error=""
              response.status="success",
              response.message = "faculty added successfully"
              response.id = id
            }
        } catch (error) {
            console.log(error)
            response.error = "sorry there are some issues with our server please try again later" 
            response.status ="server error"
        }
    }else{
        response.error = errors
        response.status ="field error"
    }
    res.json(response)
}
async function addDepartment(req,res){
    const {email} = req.session.admin
    const {fid} = req.params;
    const {department} = req.body
    const id = uuid.v4()

    const response = {
        status:"pending",
        error:"the process has just started"
    }
    const errors = validateFields([
        {inputField:department,inputType:"text",inputName:"department"}
    ])
    if(errors.length == 0){
        try {
            const existingFaculty = await Faculty.findOne({
                where:{
                    faculty_id:fid,
                    admin:email
                }
            })
            if(!existingFaculty){
                response.error = "faculty does not exist please try another one" 
                response.status ="404"
            }else{
             await Faculty.update({
                department,
             },{
                where:{
                    faculty_id:fid
                }
             })
              response.error=""
              response.status="success",
              response.message = "department added successfully"
              response.id = id
            }
        } catch (error) {
            response.error = "sorry there are some issues with our server please try again later" 
            response.status ="server error"
        }
    }else{
        response.error = errors[0].error
        response.status ="field error"
    }
    res.json(response)
}
module.exports = {
   getCategories,
   addSchool,
   addFaculty,
   addDepartment
}