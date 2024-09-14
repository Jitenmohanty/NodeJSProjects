# Multi-User Management System with Student Management

This is a backend system built using Node.js, Express, and MongoDB. The system supports multi-user login, user management (block/unblock users), and CRUD operations for managing student records.

## Features

- **Multi-user login**: Supports login and authentication using JWT tokens.
- **User management**: Admins can block and unblock users.
- **Student management**: Admins can add, edit, and delete student records.

## Technologies Used

- **Node.js**: JavaScript runtime for backend development.
- **Express.js**: Web framework for building the RESTful API.
- **MongoDB**: NoSQL database for storing user and student information.
- **JWT (JSON Web Token)**: For authentication and authorization.
- **Bcrypt**: For password hashing.
- **Mongoose**: ODM library for MongoDB and Node.js.

## Prerequisites

- **Node.js** (version 14+)
- **MongoDB** (local or cloud-based)
- **Nodemon** (for development - included in `devDependencies`)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jitenmohanty/NodeJSProjects/tree/master/MultiUserSystem
   cd MultiUserSystem

npm install


PORT=8000
MONGO_URI=mongodb://localhost:27017/MultiUserDB
JWT_SECRET=your_secret_key

npm run dev

API Endpoints
Authentication
POST /api/auth/register: Register a new user (admin/user).
POST /api/auth/login: Log in a user and get a JWT token.
User Management
GET /api/users: Get all users (admin only).
PUT /api/users/block/:id: Block a user (admin only).
PUT /api/users/unblock/:id: Unblock a user (admin only).
Student Management
POST /api/students: Add a new student.
GET /api/students: Get all students.
PUT /api/students/:id: Edit a student's details.
DELETE /api/students/:id: Delete a student.

multi-user-system/
│
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── studentController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── studentModel.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── studentRoutes.js
│   ├── config/
│   │   └── db.js
│   └── index.js
├── .env
├── package.json
└── README.md

