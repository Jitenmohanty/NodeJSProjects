const fs = require("fs");
const path = require("path");

// Path where the CSV file will be created
const filePath = path.join(__dirname, "transactions.csv");

// Dummy data
const transactions = [
  "collect_id,school_id,gateway,order_amount,transaction_amount,status,custom_order_id",
  "1234,65b0e6293e9f76a9694d84b4,PhonePe,2000,2200,success,order1234",
  "5678,65b0e6293e9f76a9694d84b4,Paytm,1500,1600,pending,order5678",
  "9101,65b0e6293e9f76a9694d84b4,RazorPay,2500,2600,failed,order9101",
  "4321,65b0e6293e9f76a9694d84b4,Stripe,3000,3200,success,order4321",
  "8765,65b0e6293e9f76a9694d84b4,PhonePe,1000,1200,pending,order8765",
];

// Write data to transactions.csv
fs.writeFile(filePath, transactions.join("\n"), (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log(`CSV file generated successfully: ${filePath}`);
  }
});