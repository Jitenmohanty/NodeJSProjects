const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Flag', flagSchema);