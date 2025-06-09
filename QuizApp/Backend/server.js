require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // Add this line

// Initialize app
const app = express();
app.enable('trust proxy'); // Trust the Vercel proxy

// Connect to database
connectDB();

//middlewares
// const cors = require('cors');

const allowedOrigins = [
  'https://quiz-genie-academy-pro.vercel.app',
  'http://localhost:5173' // Optional: for local dev
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'X-Api-Version',
    'Authorization'
  ],
  credentials: true,
  optionsSuccessStatus: 204 // For legacy browser compatibility
};

// Enable CORS for all requests using the defined options
app.use(cors(corsOptions));

// Add session middleware before passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

// Add passport middleware
app.use(passport.initialize());
app.use(passport.session());



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