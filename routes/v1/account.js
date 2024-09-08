const express = require('express');
const { createAccount, getAccounts, getAccount, updateAccount, archiveAccount } = require('../../controllers/v1/account');

const router = express.Router();

router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/:id', getAccount);
router.patch('/:id', updateAccount);
router.delete('/:id', archiveAccount);


module.exports = router;