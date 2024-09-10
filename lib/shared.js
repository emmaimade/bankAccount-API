const asynchandler = require('express-async-handler');

const Account = require('../models/Account');

const getDailyWithdrawalTotal = asynchandler(async (req, res) => {
    const id = req.user.id;
    const account = await Account.findById(id);

    const today = new Date();
    let total = 0;

    account.transactions.forEach(transaction => {
        if (transaction.timestamp.getDate() === today.getDate()){
                total += transaction.amount;
            }
    });
    return total;
});

module.exports = {
    getDailyWithdrawalTotal
}