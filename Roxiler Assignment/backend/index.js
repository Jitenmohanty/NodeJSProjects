require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiRoutes = require("./routes/api");

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// API Routes
app.use("/api", apiRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
