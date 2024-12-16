const fs = require("fs");
const csvParser = require("csv-parser");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const connectDB = require("../config/db");
require("dotenv").config();

connectDB();

const results = [];

fs.createReadStream("transactions.csv") // Use the CSV file path
  .pipe(csvParser())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    try {
      await Transaction.insertMany(results);
      console.log("CSV Data Imported Successfully");
      process.exit();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
