const express = require("express");
const router = express.Router();
const { getUsers, getUser } = require("../controllers/userControllers");
const { verifyAccessToken } = require("../middlewares.js");

// Routes beginning with /api/users
router.get("/", verifyAccessToken, getUsers);
router.get("/:userId", verifyAccessToken, getUser);

module.exports = router;
