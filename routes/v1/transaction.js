const express = require("express");
const {
  getTransactions,
  getTransaction,
  withdrawal,
  deposit,
  transfer
} = require("../../controllers/v1/transaction");
const verifyToken = require("../../middleware/tokenHandler");

const router = express.Router();

router.get("/", verifyToken, getTransactions);
router.get("/currentusertransaction", verifyToken, getTransaction);
router.post("/withdrawal", verifyToken, withdrawal);
router.post("/deposit", verifyToken, deposit);
router.post("/transfer", verifyToken, transfer);

module.exports = router;