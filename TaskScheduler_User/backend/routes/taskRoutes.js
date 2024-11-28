const express = require("express");
const { createTask, getTasks, updateTaskStatus, deleteTask } = require("../controllers/taskController");

const router = express.Router();

router.post("/create", createTask); // Create task
router.get("/", getTasks); // Get tasks
router.patch("/:taskId", updateTaskStatus); // Update task status
router.delete("/:taskId", deleteTask); // Delete task

module.exports = router;
