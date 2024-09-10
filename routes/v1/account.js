const express = require("express");
const {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  archiveAccount,
  unArchiveAccount,
  dailyWithdrawalLimit,
} = require("../../controllers/v1/account");
const verifyToken = require("../../middleware/tokenHandler");

const router = express.Router();

router.post("/", createAccount);
router.get("/", verifyToken, getAccounts);
router.get("/currentuser", verifyToken, getAccount);
router.patch("/", verifyToken, updateAccount);
router.patch("/withdrawalLimit", verifyToken, dailyWithdrawalLimit);
router.delete("/", verifyToken, archiveAccount);
router.patch("/unarchive", verifyToken, unArchiveAccount);

module.exports = router;
