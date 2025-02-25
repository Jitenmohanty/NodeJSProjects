const Transaction = require("../models/Transaction");

exports.getAllTransactions = async (req, res) => {
  const {
    payment,
    transactionAmount,
    orderAmount,
    status,
    date,
    page = 1,
  } = req.query; // Extract query parameters
  const limit = 10; // Number of transactions per page
  const skip = (page - 1) * limit; // Calculate documents to skip for pagination

  let filter = {}; // Initialize filter object
  console.log(date);
  // Add status filter if provided
  if (status) {
    filter.status = status;
  }
  if (payment) {
    filter.gateway = payment;
  }
  if (orderAmount) {
    filter.order_amount = orderAmount;
  }
  if (transactionAmount) {
    filter.transaction_amount = transactionAmount;
  }

  // Add date range filter if provided
  if (date) {
    const specificDate = new Date(date);
    const nextDay = new Date(specificDate);
    nextDay.setDate(specificDate.getDate() + 1);

    filter.updated_at = {
      $gte: specificDate, // Start of the day
      $lt: nextDay, // Start of the next day
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

exports.getAllSchools = async (req, res) => {
  try {
    // Fetch distinct school IDs from the Transaction collection
    const schoolIds = await Transaction.distinct("school_id");
    if (schoolIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No school IDs found",
      });
    }

    res.status(200).json({
      success: true,
      message: "School IDs fetched successfully",
      data: schoolIds,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch school IDs",
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

exports.checkTransactionStatus = async (req, res) => {
  const { orderId } = req.params; // Extract from URL parameters
  try {
    const transaction = await Transaction.findOne({ custom_order_id: orderId });
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
exports.webhookStatusUpdate = async (req, res) => {
  try {
    const { status, order_info } = req.body;
    // Validate payload
    if (!status || !order_info || !order_info.order_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload format",
      });
    }

    const { order_id, order_amount, transaction_amount, gateway, bank_reference } = order_info;

    // Find the transaction by its unique order_id
    const transaction = await Transaction.findOne({ collect_id: order_id });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update transaction details
    transaction.status = status;
    transaction.order_amount = order_amount;
    transaction.transaction_amount = transaction_amount;
    transaction.gateway = gateway;
    transaction.bank_reference = bank_reference;

    // Save updated transaction
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction status updated successfully",
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Manual status update
exports.manualUpdate = async (req, res) => {
  const { collect_id, newStatus } = req.body;
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { collect_id },
      { status:newStatus },
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
