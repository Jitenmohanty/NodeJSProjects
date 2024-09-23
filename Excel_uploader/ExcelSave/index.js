import express from "express"
import dotenv from 'dotenv';


import connectToDB from "./db.js";

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

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

import uploadRouter from "./routes/upload.js";

app.use('/api',uploadRouter);





