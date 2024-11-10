const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const { TodoList,Task, User } = require("../db/db");
const jwt = require("jsonwebtoken")

router.post("/create",auth,async(req,res)=>{
      let {userId,title}= req.body;
      let userdbId = jwt.decode(req.headers.authorization);
    try{ 
        const newList = await TodoList.create({
        owner:userdbId,
        title:title,}); 
        res.status(201).json({
            "message": "To-Do list created successfully",
            "list": {
              "id": newList._id,
              "owner": userId,
              "title":title,
              "tasks": [],
              "collaborators": []
            }
          }
          )
        }catch(error){res.status(501).json({msg:"internal error"})}
 })

router.post("/:listId/task",auth,async(req,res)=>{
  const listId = req.params.listId;
  let {title,assignee,priority,dueDate} = req.body;

  try{
    const todolist = await TodoList.findOne({_id:listId})
    if(todolist.owner == jwt.decode(req.headers.authorization)){
      const newTask = await Task.create({
        title,assignee,priority,dueDate
      });
      todolist.tasks.push(newTask._id);
      todolist.save().then(
      res.status(201).json({
        "message": "Task added successfully",
        "task": {
          "id": newTask._id,
          "title": title,
          "completed": false,
          "assignee": assignee,
          "priority": priority,
          "dueDate": dueDate,
          "subtasks": []
        }
      }))
      
    }else{res.status(401).json({error:"UserNotAuthenticated"})}

  }catch(error){
    res.status(400).json({error:"Invalid data or list not found"})
  }
})


router.delete("/:listId/task/:taskId",auth,async(req,res)=>{
  let {listId,taskId}= req.params;
  try{
    const delTask = await Task.deleteOne({_id:taskId});
    const todolist = await TodoList.findById({_id:listId});
    if(todolist._id == jwt.decode(req.headers.authorization));
    await TodoList.findByIdAndUpdate(listId,{$pull:{tasks:taskId}});
    res.status(201).json({
      "message": "Task deleted successfully"
    })
  }catch(error){
    console.log(error)
    res.status(404).json({
      "error": "Task not found or list not found"
    })
  }
  
})

router.put("/:listId/task/:taskId",auth,async(req,res)=>{
  let {listId,taskId} = req.params;
  const update = req.body;
  try{
  const check = await TodoList.findOne({_id:listId,tasks:taskId});
 const task = await Task.findOneAndUpdate({_id:taskId},update,{new:true});
    res.status(201).json({
      "message": "Task updated successfully",
      "task": task})
  }catch(error){
    console.log(error);
    res.status(404).json({
    "error": "Task not found or list not found"
  })}


})

router.post("/:listId/collaborator",auth,async(req,res)=>{
  const listId = req.params.listId;
  const userId = req.body.userId;
  try{
    const userdb = await User.findOne({userId:userId})

    const todolist = await TodoList.findById(listId);
    if(todolist.owner == jwt.decode(req.headers.authorization)){
    todolist.collaborators.push(userdb._id)
    await todolist.save();
    res.status(201).json({msg:"Collaborator Added"})}
  }catch(error){res.status(501).json({
    "error": "List not found or user not found or User not authenicated"
  })}
})

router.delete("/:listId/collaborator/userId",auth,async(req,res)=>{
  const {listId,userId }= req.params;
  try{
    const userdb = await User.findOne({userId:userId})

    const todolist = await TodoList.findById(listId);
    if(todolist.owner == jwt.decode(req.headers.authorization)){
    todolist.collaborators.push(userdb._id)
    await todolist.save();
    res.status(201).json({msg:"Collaborator Added"})}
  }catch(error){res.status(501).json({
    "error": "List not found or user not found or User not authenicated"
  })}
})

module.exports={todo:router}