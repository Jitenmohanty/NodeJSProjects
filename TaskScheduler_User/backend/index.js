const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const { connectToDB } = require("./db/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

connectToDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDb connection failed!!!", error);
  });

app.use("/api/users",userRoutes);
app.use("/api/tasks", taskRoutes);

