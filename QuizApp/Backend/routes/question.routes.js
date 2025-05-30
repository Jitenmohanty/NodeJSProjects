const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { authenticateToken } = require('../middleware/auth');

router.post('/upload-questions', 
  authenticateToken, 
  questionController.upload.fields([
    { name: 'questionFile', maxCount: 1 },
    { name: 'answerFile', maxCount: 1 }
  ]), 
  questionController.uploadQuestions
);

router.get('/question-sets', authenticateToken, questionController.getQuestionSets);
router.get('/question-sets/:id', authenticateToken, questionController.getQuestionSet);

module.exports = router;