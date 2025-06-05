const QuizResult = require('../models/QuizResult');
const QuestionSet = require('../models/QuestionSet');
const mongoose = require("mongoose")

exports.getLeaderboard = async (req, res) => {
  try {
    // Get all quiz results with populated student, question set, and teacher info
    const leaderboard = await QuizResult.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'questionsets',
          localField: 'questionSetId',
          foreignField: '_id',
          as: 'questionSet'
        }
      },
      { $unwind: '$questionSet' },
      {
        $lookup: {
          from: 'users',
          localField: 'questionSet.teacherId',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' },
      {
        $project: {
          _id: 1,
          score: 1,
          totalQuestions: 1,
          percentage: {
            $multiply: [
              { $divide: ['$score', '$totalQuestions'] },
              100
            ]
          },
          completedAt: 1,
          'student._id': 1,
          'student.name': 1,
          'student.email': 1,
          'questionSet._id': 1,
          'questionSet.title': 1,
          'teacher._id': 1,
          'teacher.name': 1
        }
      },
      {
        $sort: { percentage: -1, completedAt: -1 } // Sort by highest percentage first
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
};

exports.getLeaderboardByQuiz = async (req, res) => {
  try {
    const { questionSetId } = req.params;

    const leaderboard = await QuizResult.aggregate([
      {
        $match: { questionSetId: new mongoose.Types.ObjectId(questionSetId) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'questionsets',
          localField: 'questionSetId',
          foreignField: '_id',
          as: 'questionSet'
        }
      },
      { $unwind: '$questionSet' },
      {
        $lookup: {
          from: 'users',
          localField: 'questionSet.teacherId',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' },
      {
        $project: {
          _id: 1,
          score: 1,
          totalQuestions: 1,
          percentage: {
            $multiply: [
              { $divide: ['$score', '$totalQuestions'] },
              100
            ]
          },
          completedAt: 1,
          'student._id': 1,
          'student.name': 1,
          'student.email': 1,
          'questionSet._id': 1,
          'questionSet.title': 1,
          'teacher._id': 1,
          'teacher.name': 1
        }
      },
      {
        $sort: { percentage: -1, completedAt: -1 }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Quiz leaderboard error:', error);
    res.status(500).json({ message: 'Server error while fetching quiz leaderboard' });
  }
};

exports.getStudentLeaderboard = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentResults = await QuizResult.aggregate([
      {
        $match: { studentId: new mongoose.Types.ObjectId(studentId) }
      },
      {
        $lookup: {
          from: 'questionsets',
          localField: 'questionSetId',
          foreignField: '_id',
          as: 'questionSet'
        }
      },
      { $unwind: '$questionSet' },
      {
        $lookup: {
          from: 'users',
          localField: 'questionSet.teacherId',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' },
      {
        $project: {
          _id: 1,
          score: 1,
          totalQuestions: 1,
          percentage: {
            $multiply: [
              { $divide: ['$score', '$totalQuestions'] },
              100
            ]
          },
          completedAt: 1,
          'questionSet._id': 1,
          'questionSet.title': 1,
          'teacher._id': 1,
          'teacher.name': 1
        }
      },
      {
        $sort: { completedAt: -1 }
      }
    ]);

    res.json(studentResults);
  } catch (error) {
    console.error('Student leaderboard error:', error);
    res.status(500).json({ message: 'Server error while fetching student results' });
  }
};