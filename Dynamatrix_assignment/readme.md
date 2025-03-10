# 🚗 Claims Management API

A Node.js and Express-based API for managing insurance claims, integrated with MongoDB.

## 📌 Features
- Create, Read, Update, and Delete (CRUD) insurance claims
- MongoDB for data storage
- RESTful API with Express.js
- Environment variable support using dotenv
- Modular ES Module (ESM) structure
- Cloud deployment ready (AWS, Azure, Render, etc.)

## 🏗 Tech Stack
- **Node.js** (ES Module)
- **Express.js** (API framework)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- **dotenv** (Environment variable management)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Jitenmohanty/NodeJSProjects/Dynamatrix_assignment.git
cd Dynamatrix_assignment
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create an `.env` File
Create a `.env` file in the project root and add your MongoDB URI:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4️⃣ Start the Server
```bash
npm start
```

---

## 📡 API Endpoints

### 🔹 Get All Claims
```http
GET /claims
```
_Response:_
```json
[
  {
    "_id": "65abc1234",
    "companyReference": "ABC123",
    "policyNumber": "POL456",
    "incidentDate": "2024-01-15T00:00:00.000Z",
    "status": "Pending"
  }
]
```

### 🔹 Create a New Claim
```http
POST /claims
```
_Request Body:_
```json
{
  "companyReference": "XYZ789",
  "policyNumber": "POL789",
  "incidentDate": "2024-03-10",
  "status": "New"
}
```

### 🔹 Get Claim by ID
```http
GET /claims/:id
```

### 🔹 Update Claim by ID
```http
PUT /claims/:id
```
_Request Body:_
```json
{
  "status": "Approved"
}
```

### 🔹 Delete Claim by ID
```http
DELETE /claims/:id
```

---

## 📦 Deployment

### 🌥 Deploy on Render(I an not deployed yet...)
1. Push your project to **GitHub**.
2. Sign up at [Render](https://render.com/).
3. Create a **Web Service** and connect your GitHub repo.
4. Set `MONGO_URI` in **Environment Variables**.
5. Click **Deploy**.

### ☁️ Deploy on AWS (EC2 & MongoDB Atlas) (Always i prefer on EC2)
1. Set up an **EC2 instance** and install Node.js.
2. Clone the repository and install dependencies.
3. Start the server using:
   ```bash
   node server.js
   ```
4. Expose port `5000` in security settings.

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author
- **Jiten Moahanty** - [GitHub](https://github.com/jitenmohanty) | [LinkedIn](https://linkedin.com/in/jiten-mohanty/)

