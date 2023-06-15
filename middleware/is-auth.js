const jwt = require('jsonwebtoken')
// this middleware for autherization user 
module.exports = (req,res,next) =>
{
    //we add this check to improved way to handle error
    let token ;
    if(req.headers.authorization){
        token = req.headers.authorization.split(" ")[1];
    }
    
    if(!token)
    {
        const error = new error ('this user not found')
        error.statuscode = 401
        throw error
    }
    let decodedToken
    try 
    {
        decodedToken = jwt.verify(token,process.env.SECRET_JWT) //decoded and verfy
    } 
    catch (error) //if technical occured
    {
        error.statuscode = 500
        throw error
    }
    //if not technical occured but not verfied token with secetkey
    if(!decodedToken) 
    {
        const error = new Error('this user not found')
        error.statuscode = 401
        throw error
    }
    req.userId = decodedToken.userId //decode userId sent in token in header and set it to req for user
    next()
}