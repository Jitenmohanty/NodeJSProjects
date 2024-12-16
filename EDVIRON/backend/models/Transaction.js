const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  collect_id: String,
  school_id: String,
  gateway: String,
  order_amount: Number,
  transaction_amount: Number,
  status: String,
  custom_order_id: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
