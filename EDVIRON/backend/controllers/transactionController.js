const Transaction = require("../models/Transaction");

// Fetch all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Fetch transactions by school ID
exports.getTransactionsBySchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const transactions = await Transaction.find({ school_id });
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Check transaction status
exports.checkTransactionStatus = async (req, res) => {
  const { custom_order_id } = req.body;
  try {
    const transaction = await Transaction.findOne({ custom_order_id });
    if (transaction) {
      res.json({ status: transaction.status });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Webhook for status update
exports.webhookUpdate = async (req, res) => {
  const { order_info } = req.body;
  try {
    await Transaction.findOneAndUpdate(
      { collect_id: order_info.order_id },
      { status: req.body.status }
    );
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Manual status update
exports.manualUpdate = async (req, res) => {
  const { collect_id, status } = req.body;
  try {
    await Transaction.findOneAndUpdate({ collect_id }, { status });
    res.json({ message: "Manual update successful" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
