const express = require('express');
const { createAccount, getAccounts } = require('../../controllers/v1/account');

const router = express.Router();

router.post('/', createAccount);
router.get('/', getAccounts);

module.exports = router;