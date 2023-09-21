const express = require("express");

const router = express.Router();

const { verifyAccessToken } = require("../middlewares.js");
const {
  markTaskAsCompleted,
  getCompletedTasks,
} = require("../controllers/CompletedTaskControllers.js");

router.post("/tasks", verifyAccessToken, markTaskAsCompleted);
router.get("/", verifyAccessToken, getCompletedTasks);
module.exports = router;
