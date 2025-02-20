# 📌 Chat ATS - A Full-Featured MERN Chat Application  

🚀 A **real-time chat application** built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.io**. It allows users to chat one-on-one, send files, emojis, and create group chats, along with a notification system that alerts users when someone comes online.  

---

## 🌟 Features  
✅ **User Authentication** - JWT-based authentication (Register/Login)  
✅ **Real-Time Messaging** - Chat with other users instantly using **Socket.io**  
✅ **File & Emoji Support** - Send text, files, and emojis in chat  
✅ **Online Status Notifications** - Get notified when a user logs in  
✅ **Group Chat** - Create and manage chat groups with multiple users  
✅ **Responsive UI** - Optimized for both desktop and mobile  

---

## 🛠️ Tech Stack  
- **Frontend**: React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **WebSockets**: Socket.io for real-time communication  
- **Authentication**: JWT (JSON Web Token)  
- **File Upload**: Multer  

---

## 🚀 Installation & Setup  
cd backend
npm install
cd ../frontend
npm install
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
## 4️⃣ Start the Application
##  Start Backend

cd backend
npm run dev  # Runs with nodemon

## Start Frontend
cd frontend
npm start
🚀 Your chat app should now be running on http://localhost:5173!

## 📂 Project Structure
Chat_ATS/
│── backend/               # Node.js & Express API  
│   ├── models/            # Mongoose Schemas  
│   ├── controllers/       # API Controllers  
│   ├── middleware/        # Auth & Upload Middleware  
│   ├── routes/            # API Routes  
│   ├── server.js          # Main Server File  
│── frontend/              # React Application  
│   ├── components/        # UI Components  
│   ├── context/           # Auth & Chat Context  
│   ├── hooks/             # Custom Hooks (useSocket, useAuth)  
│   ├── pages/             # Chat UI & Authentication Pages  
│   ├── App.js             # Main App Component  
│── README.md  



### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/Jitenmohanty/NodeJSProjects.git
cd NodeJSProjects/Chat_ATS


---

### **How to Use?**  
- Save the above content as `README.md` in your repository.  
- Push it to your **GitHub repo**.  

Let me know if you need **any updates or customizations!** 🚀😊

