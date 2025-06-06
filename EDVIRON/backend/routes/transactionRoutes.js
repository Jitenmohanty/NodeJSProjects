const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransactionsBySchool,
  checkTransactionStatus,
  manualUpdate,
  getAllSchools,
  webhookStatusUpdate,
} = require("../controllers/transactionController");

router.get("/", getAllTransactions);
router.get("/schools", getAllSchools);
router.get("/school/:school_id", getTransactionsBySchool);
router.get("/check-status/:orderId", checkTransactionStatus);
router.post("/webhook/status-update", webhookStatusUpdate);
router.post("/manual-update", manualUpdate);

module.exports = router;
