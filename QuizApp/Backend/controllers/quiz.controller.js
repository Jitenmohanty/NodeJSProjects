const QuizResult = require('../models/QuizResult');
const QuestionSet = require('../models/QuestionSet');

exports.submitQuiz = async (req, res) => {
  try {
    const { questionSetId, answers } = req.body;
    
    const questionSet = await QuestionSet.findById(questionSetId);
    if (!questionSet) {
      return res.status(404).json({ message: 'Question set not found' });
    }

    let score = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = questionSet.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;

      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      };
    });

    const quizResult = new QuizResult({
      studentId: req.user.userId,
      questionSetId,
      answers: processedAnswers,
      score,
      totalQuestions: questionSet.questions.length
    });

    await quizResult.save();

    res.json({
      score,
      totalQuestions: questionSet.questions.length,
      percentage: Math.round((score / questionSet.questions.length) * 100),
      answers: processedAnswers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ studentId: req.user.userId })
      .populate('questionSetId', 'title')
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};