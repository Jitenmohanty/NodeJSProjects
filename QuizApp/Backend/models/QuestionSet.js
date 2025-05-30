const mongoose = require('mongoose');

const questionSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: String, required: true },
    explanation: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestionSet', questionSetSchema);