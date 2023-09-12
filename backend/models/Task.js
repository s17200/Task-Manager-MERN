const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
   
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;