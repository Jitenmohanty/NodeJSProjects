const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransactionsBySchool,
  checkTransactionStatus,
  webhookUpdate,
  manualUpdate,
} = require("../controllers/transactionController");

router.get("/", getAllTransactions);
router.get("/:school_id", getTransactionsBySchool);
router.post("/check-status", checkTransactionStatus);
router.post("/webhook", webhookUpdate);
router.post("/manual-update", manualUpdate);

module.exports = router;
