const jwt = require("jsonwebtoken");
function auth(req,res,next){
    let token = req.headers.authorization;
    if(!token){return res.status(401).json({msg:"no token provided"})}
    try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(decoded){next()}else{res.status(501).json({msg:"not authorized"})}}
    catch(error){res.status(501).json({msg:"invalid token"})}
}


module.exports = auth