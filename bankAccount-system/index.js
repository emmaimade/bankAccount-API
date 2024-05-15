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

    resJson() {
        return {
            type: this._type,
            amount: this._amount,
            timestamp: this._timestamp
        };
    }
}
class BankAccount {
    constructor(accountNumber, firstName, lastName, dailyWithdrawal) {
        this._accountNumber = accountNumber;
        this._firstName = firstName;
        this._lastName = lastName;
        this._accountHolder = `${firstName} ${lastName}`;
        this._balance = 0;
        this._transactions = [];
        this._dailyWithdrawal = dailyWithdrawal;
    }

    get accountNumber() {
        return this._accountNumber;
    }

    get accountHolder () {
        return this._accountHolder;
    }

    get balance () {
        return this._balance;
    }

    deposit(amount) {
        if (amount <= 10) {
            throw new Error('Invalid amount entered. Minimum deposit is 10');
        }
        else {
            this._balance += amount;
            this._transactions.push(new Transaction('Deposit', amount));
            return `${this._accountHolder}, ${amount} has been deposited to your account. Your new balance is ${this._balance}`
        }
    }
    getDailyWithdrawalTotal() {
        const currentDate = new Date();
        let total = 0;

        this._transactions.forEach(transaction => {
            if (transaction.timestamp.getDate() === currentDate.getDate()){
                total += transaction.amount;
            }
        });
        return total;
    }

    withdraw(amount) {
        // Checks daily withdrawal limit
        if (this.getDailyWithdrawalTotal() >= this._dailyWithdrawal) {
            return 'Daily withdrawal limit exceeded';
        }

        // Checks if there is enough balance for withdrawal
        if (amount > this._balance) {
            return 'Insufficient funds';
        }

        this._balance -= amount;
        this._transactions.push(new Transaction('Withdrawal', amount));
        return `${this._accountHolder}, ${amount} has been withdrawn from your account. Your new balance is ${this._balance}`;
       
    }

    transfer(amount, recipientAccount) {
        // Checks if the amount is positive
        if (amount < 0) {
            throw new Error('Invalid transfer amount');
        }

        // Checks daily withdrawal limit
        if (this.getDailyWithdrawalTotal() >= this._dailyWithdrawal) {
            throw new Error('Daily withdrawal limit exceeded')
        }
        
        // Checks if there is enough balance for transfer
        if (amount > this._balance) {
            throw new Error('Insufficient funds');
        }

        this._balance -= amount;
        recipientAccount.deposit(amount);
        this._transactions.push(new Transaction('Transfer', amount));
        return `You transferred ${amount} from this ${this._accountNumber} to ${recipientAccount.accountNumber}.`;
    }

    getTransactions() {
        let transactions = [];

        this._transactions.forEach(transaction => {
            transactions.push(transaction.resJson());
        });

        return transactions;
    }
}

TIER1 = 2000;

const client1 = new BankAccount("3035682914","Jane", "Doe", TIER1);
const client2 = new BankAccount("7701770147", "John", "Doe", TIER1);


console.log('Account Number:', client1.accountNumber);
console.log('Account Name:', client1.accountHolder);


try {
    console.log(client1.deposit(5000));
    console.log(client2.deposit(3000));

    client1.transfer(200, client2);
    client2.transfer(300, client1);
    
} catch (error) {
    console.log(error.message);
}

console.log(client1.withdraw(500));
console.log(client1.withdraw(1000));
console.log(client2.withdraw(500));

console.log('Account 1 Balance:', client1.balance);
console.log('Account 2 Balance:', client2.balance);

console.log(client1.getTransactions());
console.log(client2.getTransactions());