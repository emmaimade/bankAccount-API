const express = require('express');
const { createAccount, getAccounts, getAccount, updateAccount } = require('../../controllers/v1/account');

const router = express.Router();

router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/:id', getAccount);
router.patch('/:id', updateAccount);

module.exports = router;