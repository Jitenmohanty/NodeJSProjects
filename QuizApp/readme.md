# Quiz App Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)

A robust backend API for a quiz application that allows teachers to create question sets from uploaded documents (PDFs, images, text) using AI processing, and students to take quizzes and view results.

## Features

- **User Authentication**: JWT-based auth for teachers and students
- **AI-Powered Question Generation**: Convert PDFs/images to structured quizzes using Google Gemini AI
- **Quiz Management**: Create, store, and retrieve question sets
- **Quiz Taking**: Submit answers and get immediate results with explanations
- **Results Tracking**: View historical quiz performance

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Processing**: Google Gemini API
- **File Processing**: pdf-parse, multer
- **Authentication**: JWT, bcryptjs

## Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher (local or Atlas)
- Google Gemini API key
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quiz-app-backend.git
   cd quiz-app-backend


