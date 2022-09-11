async function authenticate(req,res,next){
    if(req.session.user){
       next()
    }
    else{
        res.json({
            status:"Unauthorized",
            error:"you are not logged in"
        })
    }
}
async function authenticateAll(req,res,next){
    if(req.session.user || req.session.admin){
        next()
     }
     else{
         res.json({
             status:"Unauthorized",
             error:"you are not logged in"
         })
     }
}
async function authenticateAdmin(req,res,next){
    if(req.session.admin){
       next()
    }
    else{
        res.json({
            status:"Unauthorized",
            error:"you are not logged in"
        })
    }
}
module.exports={
    authenticate,
    authenticateAdmin,
    authenticateAll
}