const express = require("express");
const router = express.Router();
const { User } = require("../db/db");
const jwt = require("jsonwebtoken");


router.post("/create",async (req,res)=>{
    if(!req.body.userId || !req.body.name || !req.body.email || !req.body.password){
      return res.status(500).json({msg:"sendallparameters"})
    }
   let {userId,name,email,password}=req.body;
   try{
    const newUser = await User.create({
    userId:userId,
    name:name,
    email:email,
    password:password});

    res.status(201).json({
    "message": "User created successfully",
    "user": {
      "userId": userId,
      "name": name,
      "email": email,
      "profilePicture": null,
      "bio": null,
      "notifications": true}
  })}catch(error){
    res.status(400).json({msg:"User ID or email already exists"})}
})
router.post("/signin",(req,res)=>{
  let {email,password} = req.body;
  User.findOne({email:email,password:password}).then((docs)=>{if(docs){
      let token = jwt.sign(docs._id.toString(),process.env.JWT_SECRET)
    res.status(201).json({msg:"Signed in Sucessfully",token:token})}else{res.status(403).json({msg:"Incorrect username/pass"})}
  })
})






module.exports = {user:router}