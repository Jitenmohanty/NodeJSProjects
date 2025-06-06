require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Connect to database
connectDB();

//middlewares
const allowedOrigins = [
  'https://quiz-genie-academy-pro.vercel.app',
  'http://localhost:8080' // For local dev testing (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you're using cookies or sessions
}));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', require('./routes/auth.routes'));
app.use('/api', require('./routes/question.routes'));
app.use('/api', require('./routes/quiz.routes'));
app.use('/api', require('./routes/leaderboard.routes'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});