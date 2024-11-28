const Task = require("../models/Task");
const User = require("../models/User");

// Create a new task
const createTask = async (req, res) => {
  const { title, description, assigneeId, dueDate } = req.body;

  if (!title || !description || !assigneeId || !dueDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the assignee exists
    const assignee = await User.findById(assigneeId);
    if (!assignee) {
      return res.status(404).json({ message: "Assignee not found" });
    }

    // Create the task
    const task = new Task({
      title,
      description,
      assignee: assigneeId,
      dueDate,
      status: "Pending",
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating task" });
  }
};

// Get tasks for a specific user
const getTasks = async (req, res) => {
  const { userId } = req.query;

  try {
    const tasks = await Task.find({ assignee: userId }).populate("assignee", "name email role");
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();
    res.status(200).json({ message: "Task status updated", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task status" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};
