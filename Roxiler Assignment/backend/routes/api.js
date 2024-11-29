const express = require("express");
const axios = require("axios");
const ProductTransaction = require("../models/ProductTransaction");
const router = express.Router();

// Initialize Database
router.get("/init-database", async (req, res) => {
  try {
    const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    const data = response.data;

    await ProductTransaction.deleteMany({}); // Clear existing data
    await ProductTransaction.insertMany(data); // Seed new data

    res.status(200).json({ message: "Database initialized with seed data" });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize database", details: error.message });
  }
});

// List Transactions with Search and Pagination
router.get("/transactions", async (req, res) => {
  const { search = "", page = 1, perPage = 10, month,year } = req.query;

  // Convert page and perPage to numbers
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(perPage) || 10;
  const skip = (pageNumber - 1) * itemsPerPage;

  // Helper functions for date filtering
  const getStartOfMonth = (year, month) => {
    const startDate = new Date(`${year}-${month.padStart(2, "0")}-01`);
    return startDate;
  };
  
  const getEndOfMonth = (year, month) => {
    const endDate = new Date(`${year}-${month.padStart(2, "0")}-01`);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    return endDate;
  };
  
  // Construct the filter object
  const filter = {
    ...(year && month && {
      dateOfSale: {
        $gte: getStartOfMonth(year, month),
        $lt: getEndOfMonth(year, month),
      },
    }),
    ...(search.trim() && {
      $or: [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        ...(isNaN(Number(search.trim()))
          ? []
          : [{ price: Number(search.trim()) }]),
      ],
    }),
  };
  
  try {
    // Log the filter and search query for debugging
    console.log("Request query parameters:", req.query);
    console.log("Filter object:", filter);

    // Fetch transactions
    const transactions = await ProductTransaction.find(filter)
      .skip(skip)
      .limit(itemsPerPage);

    // Log the transactions to verify
    // console.log("Transactions:", transactions);

    // Get the total count
    const total = await ProductTransaction.countDocuments(filter);

    res.status(200).json({ transactions, total, page: pageNumber, perPage: itemsPerPage });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions", details: error.message });
  }
});


// Statistics API
router.get("/statistics", async (req, res) => {
  const { month,year } = req.query;

  try {
    const filter = {
      dateOfSale: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month}-31`),
      },
    };

    const totalSaleAmount = await ProductTransaction.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const soldItems = await ProductTransaction.countDocuments({ ...filter, sold: true });
    const notSoldItems = await ProductTransaction.countDocuments({ ...filter, sold: false });
    console.log(soldItems,"Sold")
    console.log(notSoldItems,"Not Sold")
    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics", details: error.message });
  }
});

// Bar Chart API
router.get("/bar-chart", async (req, res) => {
  const { month } = req.query;

  try {
    const filter = {
      dateOfSale: {
        $gte: new Date(`2024-${month}-01`),
        $lt: new Date(`2024-${month}-31`),
      },
    };

    const priceRanges = await ProductTransaction.aggregate([
      { $match: filter },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "901-above",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bar chart data", details: error.message });
  }
});

// Pie Chart API
router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;

  try {
    const filter = {
      dateOfSale: {
        $gte: new Date(`2024-${month}-01`),
        $lt: new Date(`2024-${month}-31`),
      },
    };

    const categories = await ProductTransaction.aggregate([
      { $match: filter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pie chart data", details: error.message });
  }
});

/// Combined API
router.get("/combined-data", async (req, res) => {
  const { month } = req.query;

  try {
    // Define the filter for the selected month
    const filter = {
      dateOfSale: {
        $gte: new Date(`2024-${month}-01`),
        $lt: new Date(`2024-${month}-31`),
      },
    };

    // Aggregation Pipelines
    const barChartPipeline = [
      { $match: filter },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "901-above",
          output: { count: { $sum: 1 } },
        },
      },
    ];

    const pieChartPipeline = [
      { $match: filter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ];

    // Use Promise.all to execute all operations concurrently
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      ProductTransaction.find(filter),
      ProductTransaction.aggregate([
        { $match: filter },
        { $group: { _id: null, totalSales: { $sum: "$price" }, soldItems: { $sum: { $cond: ["$sold", 1, 0] } }, unsoldItems: { $sum: { $cond: ["$sold", 0, 1] } } } },
      ]),
      ProductTransaction.aggregate(barChartPipeline),
      ProductTransaction.aggregate(pieChartPipeline),
    ]);

    // Prepare the final combined response
    res.status(200).json({
      transactions,
      statistics: {
        totalSaleAmount: statistics[0]?.totalSales || 0,
        soldItems: statistics[0]?.soldItems || 0,
        unsoldItems: statistics[0]?.unsoldItems || 0,
      },
      barChart,
      pieChart,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch combined data", details: error.message });
  }
});


module.exports = router;
