const Transaction = require("../models/Transaction");

exports.getAllTransactions = async (req, res) => {
  const { status, date, page = 1 } = req.query; // Extract query parameters
  const limit = 10; // Number of transactions per page
  const skip = (page - 1) * limit; // Calculate documents to skip for pagination

  let filter = {}; // Initialize filter object

  // Add status filter if provided
  if (status) {
    filter.status = status;
  }

  // Add date range filter if provided
  if (date) {
    const [startDate, endDate] = date.split(","); // Assuming date is a comma-separated string
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  try {
    // Fetch filtered and paginated transactions
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip(skip)
      .limit(limit);

    // Get the total count of documents matching the filter
    const totalTransactions = await Transaction.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message || "Internal Server Error",
    });
  }
};


// Fetch transactions by school ID
exports.getTransactionsBySchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const transactions = await Transaction.find({ school_id });
    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for the given school ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message || "Internal Server Error",
    });
  }
};

// Check transaction status
exports.checkTransactionStatus = async (req, res) => {
  const { custom_order_id } = req.body;
  try {
    const transaction = await Transaction.findOne({ custom_order_id });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Transaction status fetched successfully",
      data: { status: transaction.status },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction status",
      error: err.message || "Internal Server Error",
    });
  }
};

// Webhook for status update
exports.webhookUpdate = async (req, res) => {
  const { order_info } = req.body;
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { collect_id: order_info.order_id },
      { status: req.body.status },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found for the provided order ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Transaction status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update transaction status",
      error: err.message || "Internal Server Error",
    });
  }
};

// Manual status update
exports.manualUpdate = async (req, res) => {
  const { collect_id, status } = req.body;
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { collect_id },
      { status },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found for the provided collect ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Transaction status updated manually successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update transaction status manually",
      error: err.message || "Internal Server Error",
    });
  }
};

// Global unhandled error middleware (if not already present in your app)
exports.errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error: ", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    error: err.message || "Internal Server Error",
  });
};
