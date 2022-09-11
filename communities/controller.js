const uuid = require("uuid")
const {Community,CommunityLikes,CommunityMembers} = require("./models")
const {User} = require("../user/models")
const validate = require("../services/validator")

async function getCommunity(req,res){
    const {id} = req.params
    const response = {
        status:'pending',
        error:"proccess is still pending"
      }
      try {
        const likes = await CommunityLikes.findAll({
            where:{
                community_id:id
            }
        })
        const members = await CommunityMembers.findAll({
            where:{
                community_id:id
            }
        })
        const data = await Community.findOne({
            where:{
                community_id:id
            }
        })
        const user = await User.findOne({
            where:{email:data.createdBy}
        })
        if(data){
            response.status ="success"
            response.error = ""
            response.community = {
                ...data.dataValues,
                likes:likes.length,
                all_likes:likes.map(like =>like.member),
                members:members.length,
                all_members:members.map(member=>member.member),
                creator:`${user.first_name} ${user.last_name}`
            }
        }
       
      } catch (error) {
        response.status = "server error",
        response.error ="couldn't get books due an internal error please check your internet and try again" 
      }
      res.json(response)
}
async function getCommunities(req,res){
  
  const response = {
    status:'pending',
    error:"proccess is still pending"
  }
  try {
    const creator = await User.findAll({
        attributes:["email","first_name","last_name"]
    })
    const likes = await CommunityLikes.findAll({attributes:["community_id"]})
    const members = await CommunityMembers.findAll({attributes:["community_id","member"]})

    const data = await Community.findAll()
    response.status ="success"
    response.error = ""
    response.communities = data.map(com=>{
      const all_likes = likes.filter(like=>like.community_id === com.community_id)
      const createdBy = creator.find(creator=>creator.email === com.createdBy)
      return {
        ...com.dataValues,
        all_likes,
        likes:all_likes.length,
        members:members.filter(member=>member.community_id === com.community_id),
        creator:`${createdBy.first_name} ${createdBy.last_name}`
      }
    })
    response.info ={likes,members,creator}
  } catch (error) {
    console.log(error)
    response.status = "server error",
    response.error ="couldn't get books due an internal error please check your internet and try again" 
  }
  res.json(response)
}
async function createCommunity(req,res){
    const {title,about,banner_img} = req.body
    const {email} = req.session.user
    const response = {
      status:'pending',
      error:"proccess is still pending"
    }
   const errors = validate([
    {inputField:title,inputType:"text",inputName:"title"},
    {inputField:about,inputType:"text",inputName:"about"},
    {inputField:banner_img,inputType:"link",inputName:"banner"},
   ])
   if(errors.length == 0){
    try {
        const data = await Community.findOne({
          where:{
              title,
          }
        })
        if(data){
          response.status = "failed",
          response.error ="community already exists please try a different title" 
        }
        else{
          const community_id = uuid.v4()
          await Community.create({
              title,
              about,
              banner_img,
              createdBy:email,
              community_id,
              status:"pending"
          })
          response.error = ""
          response.status = "success",
          response.message ="community created successfully" 
          response.community_id = community_id
        }
      } catch (error) {
        console.log(error)
        response.status = "server error",
        response.error ="couldn't create community due an internal error please check your internet and try again" 
      }
   }
   else{
    response.error = errors
    response.status = "field errors" 
   }
    res.json(response)
  }
async function unLikeCommunity(req,res){
    const {email} = req.session.user
    const {id} = req.params
    const response = {
       status:'pending',
       error:"proccess is still pending"
     }
     try {
       const community = Community.findOne({
           where:{
               community_id:id
           }
       })
       const likesExist = CommunityLikes.findOne({
           where:{
               member:email,
               community_id:id
           }
       })
      if(!likesExist){
       response.status = "not allowed",
       response.error ="You have not Liked this community before" 
      }else{
       if(community){
           const member = await CommunityLikes.destroy({
            where:{
                member:email,
                community_id:id
               }
            })
              if(member){
                  response.status = "success",
                  response.message = "you have successfully unlike this community"
                  response.error = ""
              }
              else{
                  response.status = "server error",
                  response.error ="couldn't leave due to server error" 
              }
       }else{
           response.status = "not found",
           response.error ="This community does not exist" 
       }
      }
   
     } catch (error) {
       response.status = "server error",
       response.error ="couldn't unlike due to server error" 
     }
     res.json(response)
   }

async function likeCommunity(req,res){
    const {email} = req.session.user
    const {id} = req.params
    const response = {
       status:'pending',
       error:"proccess is still pending"
     }
     try {
       const community = Community.findOne({
           where:{
               community_id:id
           }
       })
       const likesExist = await CommunityLikes.findOne({
           where:{
               member:email,
               community_id:id
           }
       })
      if(likesExist){
       response.status = "not allowed",
       response.error ="You have already liked this community" 
      }else{
       if(community){
           const liked = await CommunityLikes.create({
                member:email,
                community_id:id
            })
              if(liked){
                  response.status = "success",
                  response.message = "you have successfully liked this community"
                  response.error = ""
              }
              else{
                  response.status = "server error",
                  response.error ="couldn't like due to server error" 
              }
       }else{
           response.status = "not found",
           response.error ="This community does not exist" 
       }
      }
   
     } catch (error) {
       response.status = "server error",
       response.error ="couldn't like due to server error" 
     }
     res.json(response)
   }


async function leaveCommunity(req,res){
    const {email} = req.session.user
    const {id} = req.params
    const response = {
       status:'pending',
       error:"proccess is still pending"
     }
     try {
       const community = Community.findOne({
           where:{
               community_id:id
           }
       })
       const memberExist = CommunityMembers.findOne({
           where:{
               member:email,
               community_id:id
           }
       })
      if(!memberExist){
       response.status = "not allowed",
       response.error ="You are not a member of this community" 
      }else{
       if(community){
           const member = await CommunityMembers.destroy({
            where:{
                member:email,
                community_id:id
               }
            })
              if(member){
                  response.status = "success",
                  response.message = "you have successfully left this community"
                  response.error = ""
              }
              else{
                  response.status = "server error",
                  response.error ="couldn't leave due to server error" 
              }
       }else{
           response.status = "not found",
           response.error ="This community does not exist" 
       }
      }
   
     } catch (error) {
       response.status = "server error",
       response.error ="couldn't leave due to server error" 
     }
     res.json(response)
   }


async function joinCommunity(req,res){
 const {email} = req.session.user
 const {id} = req.params
 console.log(id)
 const response = {
    status:'pending',
    error:"proccess is still pending"
  }
  try {
    const community = Community.findOne({
        where:{
            community_id:id
        }
    })
    const memberExist = await CommunityMembers.findOne({
        where:{
            member:email,
            community_id:id
        }
    })
    console.log(memberExist)
   if(memberExist !== null){
    response.status = "not allowed",
    response.error ="You Have joined this community already" 
   }else{
    if(community){
        const member = await CommunityMembers.create({
            member:email,
            community_id:id
           })
           if(member){
               response.status = "success",
               response.message = "you have successfully joined this community"
               response.error = ""
           }
           else{
               response.status = "server error",
               response.error ="couldn't join due to server error" 
           }
    }else{
        response.status = "not found",
        response.error ="This community does not exist" 
    }
   }

  } catch (error) {
    response.status = "server error",
    response.error ="couldn't join due to server error" 
  }
  res.json(response)
}

module.exports = {
    getCommunities,
    joinCommunity,
    leaveCommunity,
    likeCommunity,
    unLikeCommunity,
    getCommunity,
    createCommunity
}