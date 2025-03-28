# 📌 Chat ATS - A Full-Featured MERN Chat Application  

🚀 A **real-time chat application** built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.io**. It allows users to chat one-on-one, send files, emojis, create group chats, and includes **chatbot support, OTP-based email verification**, and **protected group chat**.  

---

## 🌟 Features  
✅ **User Authentication** - JWT-based authentication (Register/Login) with **OTP-based email verification**  
✅ **Real-Time Messaging** - Chat with other users instantly using **Socket.io**  
✅ **File & Emoji Support** - Send text, files, and emojis in chat  
✅ **Online Status Notifications** - Get notified when a user logs in  
✅ **Group Chat** - Create and manage chat groups with multiple users  
✅ **Protected Group Chat** - Only verified users can join groups with **admin control**  
✅ **Chatbot Support** - AI-powered chatbot for automated responses  
✅ **Responsive UI** - Optimized for both desktop and mobile  

---

## 🛠️ Tech Stack  
- **Frontend**: React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **WebSockets**: Socket.io for real-time communication  
- **Authentication**: JWT (JSON Web Token) with **OTP-based email verification**  
- **File Upload**: Multer  
- **AI Chatbot**: Integrated with Gemini API  

---

## 🚀 Installation & Setup  
### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/Jitenmohanty/NodeJSProjects.git
cd NodeJSProjects/Chat_ATS

---
## 🚀 Installation & Setup 
### 2️⃣ Install Dependencies  

Navigate to the `backend` folder and install the required dependencies:  
```sh
cd backend
npm install
```  

Next, navigate to the `frontend` folder and install its dependencies:  
```sh
cd ../frontend
npm install
```  
```sh
cd backend
npm install
```sh
cd ../frontend
npm install

### 3️⃣ Set Up Environment Variables
Create a .env file in the backend folder and add:

```sh
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_for_smtp
EMAIL_PASS=your_email_password
GEMINI_API_KEY=your_gemini_api_key


## 4️⃣ Start the Application
```sh
cd backend
npm run dev  # Runs with nodemon


Start Frontend
```sh
cd frontend
npm start

### 🚀 Your chat app should now be running on http://localhost:5173!

### 📂 Project Structure
```sh
Chat_ATS/
│── backend/               # Node.js & Express API  
│   ├── models/            # Mongoose Schemas  
│   ├── controllers/       # API Controllers  
│   ├── middleware/        # Auth & Upload Middleware  
│   ├── routes/            # API Routes  
│   ├── socket/            # Socket handler  
│   ├── utils/             # OTP & Email Utility  
│   ├── chatbot/           # AI Chatbot Integration  
│   ├── server.js          # Main Server File  
│── frontend/              # React Application  
│   ├── components/        # UI Components  
│   ├── context/           # Auth & Chat Context  
│   ├── hooks/             # Custom Hooks (useSocket, useAuth)  
│   ├── pages/             # Chat UI & Authentication Pages  
│   ├── App.js             # Main App Component  
│── README.md  


### 🔥 New Features
### 🔐 OTP-Based Email Verification
Users receive an OTP via email for verification before they can log in.

Unverified users cannot join group chats.

### 🤖 AI Chatbot Integration
Users can chat with an AI-powered chatbot that provides automated responses.

Powered by Gemini API.

### 🔒 Protected Group Chat
Group chats are protected, only verified users can join.

Admin controls for adding/removing users.

### 📜 License
This project is licensed under the MIT License.

