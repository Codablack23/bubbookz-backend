async function authenticate(req,res,next){
    console.log(req.session)
    if(req.session.user){
       next()
    }
    else{
        res.status(403).json({
            status:"Unauthorized",
            error:"you are not logged in"
        })
    }
}

module.exports={
    authenticate
}