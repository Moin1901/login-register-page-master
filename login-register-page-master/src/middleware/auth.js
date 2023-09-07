var jwt = require('jsonwebtoken');
const Register=require("../models/modelschema");

const auth=async function(req,res,next){
    try{
        const token=req.cookies.jwt;
        const userver =jwt.verify(token, process.env.SECRET_KEY);

        const user=await Register.findOne({_id:userver._id})
        req.token=token;
        req.user=user;
        next();

}
catch(error){
        res.status(401).send(error);
    }
}
module.exports=auth;