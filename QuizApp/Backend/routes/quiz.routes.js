const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { authenticateToken } = require('../middleware/auth');

router.post('/submit-quiz', authenticateToken, quizController.submitQuiz);
router.get('/my-results', authenticateToken, quizController.getMyResults);

module.exports = router;