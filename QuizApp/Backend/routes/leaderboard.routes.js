const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');
const { authenticateToken } = require('../middleware/auth');

// Get full leaderboard (all quizzes)
router.get('/leaderboard', authenticateToken, leaderboardController.getLeaderboard);

// Get leaderboard for a specific quiz
router.get('/leaderboard/quiz/:questionSetId', authenticateToken, leaderboardController.getLeaderboardByQuiz);

// Get all quiz results for a specific student
router.get('/leaderboard/student/:studentId', authenticateToken, leaderboardController.getStudentLeaderboard);

module.exports = router;