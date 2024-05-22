class BankAccount {
    constructor(accountNumber, firstName, lastName, balance, dailyWithdrawalLimit) {
        this._accountNumber = accountNumber;
        this._firstName = firstName;
        this._lastName = lastName;
        this._accountHolder = `${firstName} ${lastName}`;
        this._balance = balance;
        this._transactions = [];
        this._dailyWithdrawalLimit = dailyWithdrawalLimit
        this._withdrawnToday = 0;
        this._lastWithdrawalDate = new Date().getDate();
    }

    get accountNumber() {
        return this._accountNumber;
    }

    get firstName () {
        return this._firstName;
    }

    get lastName () {
        return this._lastName;
    }

    get accountHolder () {
        return this._accountHolder;
    }

    get balance () {
        return this._balance;
    }

    deposit(amount) {
        if (amount <= 10) {
            throw new Error('Invalid amount entered. Minimum depost is 10');
        }
        else {
            this._balance += amount;
            this._transactions.push(new Transaction('Deposit', amount));
            return `${this._accountHolder}, ${amount} has been deposited to your account. Your new balance is ${this._balance}`
        }
    }
    
    withdraw(amount) {
        const today = new Date().getDate();

        // Checks if its a new day and reset amount withdrawn today if necessary
        if (today !== this._lastWithdrawalDate){
            this._withdrawnToday = 0;
            this._lastWithdrawalDate = today;
        }

        // Checks if there is enough balance for withdrawal
        if (amount > this._balance) {
            throw new Error('Insufficient funds');
        }

        // Checks if the amount exceeds the daily withdrawal limit
        if ((this._withdrawnToday + amount) > this._dailyWithdrawalLimit) {
            throw new Error('Exceeds Daily Withdrawal Limit')
        }

        this._balance -= amount;
        this._withdrawnToday += amount;
        this._transactions.push(new Transaction('Withdrawal', amount));
        return `${this._accountHolder}, ${amount} has been withdrawn from your account. Your new balance is ${this._balance}`
       
    }

    transfer(amount, recipientAccount) {

        // Checks if the amount is positive
        if (amount < 0) {
            throw new Error('Invalid transfer amount');
        }
        
        // Checks if there is enough balance for transfer
        if (amount > this._balance) {
            throw new Error('Insufficient funds');
        }

        // Checks if the amount exceeds the daily withdrawal limit
        if ((this._withdrawnToday + amount) > this._dailyWithdrawalLimit) {
            throw new Error('Exceeds Daily Withdrawal Limit')
        }

        this._balance -= amount;
        this._withdrawnToday += amount;
        recipientAccount.deposit(amount);
        this._transactions.push(new Transaction('Transfer', amount));
        return `You transferred ${amount} from this ${this._accountNumber} to ${recipientAccount.accountNumber}.`;
    }

    getTransactions() {
        console.log(`Transaction History of ${this._accountHolder}`);
        this._transactions.forEach(transaction => {
            // console.log(`Type: ${transaction.type}, Amount: ${transaction.amount}, Timestamp: ${transaction.timestamp}`)
            console.log(`${transaction.type} of ${transaction.amount} at ${transaction.timestamp}`)
        });
    }
}

class Transaction  {
    constructor(type, amount) {
        this._type = type;
        this._amount = amount;
        this._timestamp = new Date();
    }

    get type () {
        return this._type;
    }

    get amount () {
        return this._amount;
    }

    get timestamp () {
        return this._timestamp;
    }
}

const client1 = new BankAccount(3035682914,"Jane", "Doe", 20000, 10000);
const client2 = new BankAccount(7701770147, "John", "Doe", 1000, 500);


console.log('Account Number:', client1.accountNumber);
console.log('Account Name:', client1.accountHolder);
console.log('Account Balance:', client1.balance);

console.log(client1.balance)
console.log(client2.balance)



try {
    client2.deposit(2000);
    client1.withdraw(5000);
    client1.transfer(5000, client2);
    client2.transfer(100, client1)
} catch (error) {
    console.log(error.message);
}

client1.getTransactions();
client2.getTransactions();

console.log(client1.balance)
console.log(client2.balance)