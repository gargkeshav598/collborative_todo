const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://gargkeshav2007:6ZhjR7610NEHbvXH@cluster0.wxyce.mongodb.net/collab")
// User Schema
const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Task Schema
const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    assignee: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: Date,
  },
  { timestamps: true }
);

// To-Do List Schema
const TodoListSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: "Task"}],
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Models
const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);
const TodoList = mongoose.model("TodoList", TodoListSchema);


//Exports
module.exports = {User,Task,TodoList}
