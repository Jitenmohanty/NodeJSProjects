const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Overdue"], default: "Pending" },
});

module.exports = mongoose.model("Task", taskSchema);
