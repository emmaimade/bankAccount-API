const express = require('express');
const { createAccount } = require('../../controllers/v1/account');

const router = express.Router();

router.post('/', createAccount);

module.exports = router;