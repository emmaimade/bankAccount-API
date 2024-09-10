const asynchandler = require('express-async-handler');

const { getDailyWithdrawalTotal } = require('../../lib/shared');
const Account = require('../../models/Account');


const getTransactions = asynchandler(async (req, res) => {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
});

const withdrawal = asynchandler(async (req, res) => {
    const id = req.user.id;
    const { amount } = req.body;

    const account = await Account.findById(id);
    if (!account) {
        return res.status(404).send({ message: "Account does not exist"});
    }

    // Checks daily withdrawal limit
    if (getDailyWithdrawalTotal() >= account.dailyWithdrawalLimit) {
        return res.status(400).send({ message: "Daily withdrawal limit exceeded"});
    }

    // Checks if there is enough balance for withdrawal
    if (amount > account.balance) {
        return res.status(400).send({ message: "Insufficient funds"});
    }

    account.balance -= amount;
    account.transactions.push(new Transaction({
        type: 'debit',
        amount: amount
    }));

    await account.save();

    res.status(200).send({ message: "Withdrawal successful"});
});

const deposit = asynchandler(async (req, res) => {
    const id = req.user.id;
    const { amount } = req.body;

    const account = await Account.findById(id);
    if (!account) {
        return res.status(404).send({ message: "Account does not exist"});
    }

    // check if amount is valid
    if (amount <= 10) {
        return res.status(400).send({ message: "Invalid amount"});
    }

    account.balance += amount;
    account.transactions.push(new Transaction({
        type: 'credit',
        amount: amount
    }));

    await account.save();

    res.status(200).send({ message: "Deposit successful"});
});

const transfer = asynchandler(async (req, res) => {
    const id = req.user.id;
    const { amount, accountNumber } = req.body;

    const account = await Account.findById(id);
    if (!account) {
        return res.status(404).send({ message: "Account does not exist"});
    }

    const recipient = await Account.findOne({ accountNumber });
    if (!recipient) {
        return res.status(404).send({ message: "Recipient account does not exist"});
    }

    // Checks daily withdrawal limit
    if (getDailyWithdrawalTotal() >= account.dailyWithdrawalLimit) {
        return res.status(400).send({ message: "Daily withdrawal limit exceeded"});
    }

    // Checks if there is enough balance for transaction
    if (amount > account.balance) {
        return res.status(400).send({ message: "Insufficient funds"});
    }

    account.balance -= amount;
    recipient.balance += amount;

    account.transactions.push(new Transaction({
        type: 'debit',
        amount: amount
    }));

    recipient.transactions.push(new Transaction({
        type: 'credit',
        amount: amount
    }));

    await account.save();
    await recipient.save();

    res.status(200).send({ message: "Transfer successful"});
});

module.exports = {
    getTransactions,
    withdrawal,
    deposit,
    transfer
};


