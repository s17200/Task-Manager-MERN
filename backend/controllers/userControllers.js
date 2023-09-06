const User = require("../models/User");
const { validateObjectId } = require("../utils/validation");


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ user: req.user.id });
    res.status(200).json({ users, status: true, msg: "Users found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getUser = async (req, res) => {
  try {
    if (!validateObjectId(req.params.userId)) {
      return res.status(400).json({ status: false, msg: "user id not valid" });
    }

    const user = await User.findOne({ user: req.user.id, _id: req.params.userId });
    if (!user) {
      return res.status(400).json({ status: false, msg: "No user found.." });
    }
    res.status(200).json({ user, status: true, msg: "user found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

// exports.postTask = async (req, res) => {
//   try {
//     const { description } = req.body;
//     if (!description) {
//       return res.status(400).json({ status: false, msg: "Description of task not found" });
//     }
//     const task = await Task.create({ user: req.user.id, description });
//     res.status(200).json({ task, status: true, msg: "Task created successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }

// exports.putTask = async (req, res) => {
//   try {
//     const { description } = req.body;
//     if (!description) {
//       return res.status(400).json({ status: false, msg: "Description of task not found" });
//     }

//     if (!validateObjectId(req.params.taskId)) {
//       return res.status(400).json({ status: false, msg: "Task id not valid" });
//     }

//     let task = await Task.findById(req.params.taskId);
//     if (!task) {
//       return res.status(400).json({ status: false, msg: "Task with given id not found" });
//     }

//     if (task.user != req.user.id) {
//       return res.status(403).json({ status: false, msg: "You can't update task of another user" });
//     }

//     task = await Task.findByIdAndUpdate(req.params.taskId, { description }, { new: true });
//     res.status(200).json({ task, status: true, msg: "Task updated successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }


// exports.deleteTask = async (req, res) => {
//   try {
//     if (!validateObjectId(req.params.taskId)) {
//       return res.status(400).json({ status: false, msg: "Task id not valid" });
//     }

//     let task = await Task.findById(req.params.taskId);
//     if (!task) {
//       return res.status(400).json({ status: false, msg: "Task with given id not found" });
//     }

//     if (task.user != req.user.id) {
//       return res.status(403).json({ status: false, msg: "You can't delete task of another user" });
//     }

//     await Task.findByIdAndDelete(req.params.taskId);
//     res.status(200).json({ status: true, msg: "Task deleted successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }