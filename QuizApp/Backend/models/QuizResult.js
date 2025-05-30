const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionSet', required: true },
  answers: [{
    questionIndex: Number,
    selectedAnswer: String,
    isCorrect: Boolean,
    correctAnswer: String,
    explanation: String
  }],
  score: Number,
  totalQuestions: Number,
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);