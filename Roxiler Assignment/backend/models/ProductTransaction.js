const mongoose = require("mongoose");

const ProductTransactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  sold: Boolean,
  dateOfSale: Date,
});

module.exports = mongoose.model("ProductTransaction", ProductTransactionSchema);
