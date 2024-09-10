const getDailyWithdrawalTotal = async (account) => {
    const today = new Date();
    let total = 0;

    account.transactions.forEach(transaction => {

        if (transaction.type === 'debit') { // Only process debit transactions
            const transactionDate = new Date(transaction.timestamp);
            
            if (
              transactionDate.getDate() === today.getDate() &&
              transactionDate.getMonth() === today.getMonth() &&
              transactionDate.getFullYear() === today.getFullYear()
            ) {
              total += transaction.amount;
            }
        }
    });
    console.log(total)
    return total;
};

module.exports = {
    getDailyWithdrawalTotal
}