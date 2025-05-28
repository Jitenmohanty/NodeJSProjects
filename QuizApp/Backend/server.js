// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/quiz-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Question Set Schema
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

const QuestionSet = mongoose.model('QuestionSet', questionSetSchema);

// Quiz Result Schema
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

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, 'your-secret-key');
    res.json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'your-secret-key');
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload and process questions
app.post('/api/upload-questions', authenticateToken, upload.fields([
  { name: 'questionFile', maxCount: 1 },
  { name: 'answerFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const questionFile = req.files.questionFile[0];
    const answerFile = req.files.answerFile ? req.files.answerFile[0] : null;

    let questionText = '';
    let answerText = '';

    // Extract text from question file
    if (questionFile.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(questionFile.path);
      const data = await pdfParse(dataBuffer);
      questionText = data.text;
    } else if (questionFile.mimetype.startsWith('image/')) {
      // For images, we'll use Gemini Vision API
      const imageBuffer = fs.readFileSync(questionFile.path);
      const model = genAI.getGenerativeModel({  model: "gemini-1.5-flash"});
      const result = await model.generateContent([
        "Extract all text content from this image, especially questions and any relevant information:",
        {
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: questionFile.mimetype
          }
        }
      ]);
      questionText = result.response.text();
    }

    // Extract text from answer file if provided
    if (answerFile) {
      if (answerFile.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(answerFile.path);
        const data = await pdfParse(dataBuffer);
        answerText = data.text;
      } else if (answerFile.mimetype.startsWith('image/')) {
        const imageBuffer = fs.readFileSync(answerFile.path);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const result = await model.generateContent([
          "Extract all text content from this image, especially answers and explanations:",
          {
            inlineData: {
              data: imageBuffer.toString('base64'),
              mimeType: answerFile.mimetype
            }
          }
        ]);
        answerText = result.response.text();
      }
    }

    // Process with Gemini to create structured questions
    const model = genAI.getGenerativeModel({  model: "gemini-1.5-flash"});
    const prompt = `
      Process the following text and create a structured quiz with multiple choice questions.
      
      Questions Text: ${questionText}
      ${answerText ? `Answers Text: ${answerText}` : ''}
      
      Please:
      1. Fix any grammatical errors in the questions
      2. Create 4 multiple choice options (A, B, C, D) for each question
      3. Identify the correct answer
      4. Provide explanations for the correct answers
      5. Return the result in JSON format with this structure:
      
      {
        "questions": [
          {
            "question": "corrected question text",
            "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
            "correctAnswer": "A",
            "explanation": "explanation for the correct answer"
          }
        ]
      }
      
      Make sure to correct any grammatical errors and ensure questions are clear and well-formatted.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse Gemini response');
    }
    
    const parsedQuestions = JSON.parse(jsonMatch[0]);

    // Save to database
    const questionSet = new QuestionSet({
      title,
      description,
      teacherId: req.user.userId,
      questions: parsedQuestions.questions
    });

    await questionSet.save();

    // Clean up uploaded files
    fs.unlinkSync(questionFile.path);
    if (answerFile) fs.unlinkSync(answerFile.path);

    res.json({ message: 'Questions uploaded successfully', questionSet });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing questions' });
  }
});

// Get all question sets
app.get('/api/question-sets', authenticateToken, async (req, res) => {
  try {
    const questionSets = await QuestionSet.find()
      .populate('teacherId', 'name')
      .select('-questions'); // Don't send questions in list view
    res.json(questionSets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific question set for quiz
app.get('/api/question-sets/:id', authenticateToken, async (req, res) => {
  try {
    const questionSet = await QuestionSet.findById(req.params.id)
      .populate('teacherId', 'name');
    
    if (!questionSet) {
      return res.status(404).json({ message: 'Question set not found' });
    }

    res.json(questionSet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz results
app.post('/api/submit-quiz', authenticateToken, async (req, res) => {
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
});

// Get user's quiz results
app.get('/api/my-results', authenticateToken, async (req, res) => {
  try {
    const results = await QuizResult.find({ studentId: req.user.userId })
      .populate('questionSetId', 'title')
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}