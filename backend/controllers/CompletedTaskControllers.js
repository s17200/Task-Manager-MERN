// Create a new route and controller for marking a task as completed.
const CompletedTask = require("../models/CompletedTask");
const Task = require("../models/Task");

exports.markTaskAsCompleted = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findOne({ _id: taskId });

    // Create a completed task entry for the logged-in user.
    const completedTask = new CompletedTask({
      taskId,
      userId: req.user._id,
      task,
    });

    // Save the completed task.
    await completedTask.save();

    // Remove the task from the original task list.
    await Task.findByIdAndRemove(taskId);

    res.status(200).json({ message: "Task marked as completed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error marking task as completed.");
  }
};

exports.getCompletedTasks = async (req, res) => {
  try {
    // Find all completed tasks for the logged-in user.
    const completedTasks = await CompletedTask.find({
      userId: req.user._id,
    });

    res.status(200).json(completedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching completed tasks.");
  }
};
