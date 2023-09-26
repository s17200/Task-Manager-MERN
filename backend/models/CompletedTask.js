const mongoose = require("mongoose");

const completedTaskSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const CompletedTask = mongoose.model("CompletedTask", completedTaskSchema);

module.exports = CompletedTask;
