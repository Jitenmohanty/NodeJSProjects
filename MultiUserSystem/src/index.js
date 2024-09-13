import express from "express"
import dotenv from 'dotenv';
import connectToDB from "./config/db.js";

const app = express();
dotenv.config({
  path: "./.env",
});

connectToDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDb connection failed!!!", error);
  });

app.use(express.json());

import auth from "./routes/auth.route.js"
import student from "./routes/student.route.js"
import user from "./routes/user.route.js"

app.use('/api/auth',auth)
app.use('/api/students',student)
app.use('/api/user',user);
