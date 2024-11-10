require('dotenv').config();
const express = require("express");
const app = express();

app.use(express.json())
const {user} = require("./routes/user")
const {todo} = require("./routes/todo")

app.use("/user",user)
app.use("/list",todo)

app.listen(3000)