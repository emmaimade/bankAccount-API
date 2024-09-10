const asynchandler = require('express-async-handler');

const { getDailyWithdrawalTotal } = require('../../lib/shared');
const Account = require('../../models/Account');
const Transaction = require('../../models/Transaction');

const getTransactions = asynchandler(async (req, res) => {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
});

const withdrawal = asynchandler(async (req, res) => {
    const id = req.user.id;
    const { amount } = req.body;

    const account = await Account.findById(id).populate('transactions');
    if (!account) {
        return res.status(404).send({ message: "Account does not exist"});
    }

    // Checks if there is enough balance for withdrawal
    if (amount > account.balance) {
        return res.status(400).send({ message: "Insufficient funds"});
    }

    // Checks daily withdrawal limit
    const dailyTotalWithdrawals = await getDailyWithdrawalTotal(account);
    if (dailyTotalWithdrawals + amount > account.dailyWithdrawalLimit) {
        return res.status(400).send({ message: "Daily withdrawal limit exceeded" });
    }

    // save new transaction to Transaction collection
    const transaction = new Transaction({
        type: 'debit',
        amount: amount,
        timestamp: new Date()
    })

    const savedTransaction = await transaction.save()

    account.balance -= amount;
    account.transactions.push(savedTransaction)

    await account.save();

    res.status(200).send({ 
        message: "Withdrawal successful",
        balance: account.balance
    });
});

const deposit = asynchandler(async (req, res) => {
    try {
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

        const transaction = new Transaction({
            type: 'credit',
            amount: amount,
            timestamp: new Date()
        })

        const savedTransaction = await transaction.save()

        account.balance += amount;
        account.transactions.push(savedTransaction);

        await account.save();

        res.status(200).send({ 
            message: "Deposit successful",
            balance: account.balance
        });
    } catch (error) {
        res.status(500).send({ error: error.message });   
    }
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
    const dailyTotalWithdrawals = await getDailyWithdrawalTotal(account);
    if (dailyTotalWithdrawals + amount > account.dailyWithdrawalLimit) {
        return res.status(400).send({ message: "Daily withdrawal limit exceeded" });
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


