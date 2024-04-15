class BankAccount {
    constructor(accountNumber, firstName, lastName, balance) {
        this._accountNumber = accountNumber;
        this._firstName = firstName;
        this._lastName = lastName;
        this._accountHolder = `${firstName} ${lastName}`;
        this._balance = balance;
        this._transactions = [];
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
            return `${this._accountHolder}, ${amount} has been deposited to your account. Your new balance is ${this._balance}`
        }
    }
    
    withdraw(amount) {
        if (this._balance >= amount) {
            this._balance -= amount;
            return `${this._accountHolder}, ${amount} has been withdrawn from your account. Your new balance is ${this._balance}`
        } 
        else {
            throw new Error('Insufficient funds');
        }
        
    }

    getTransactions() {
        console.log(`Transaction History of ${this._accountHolder}`);
        this._transactions.forEach(transaction => {
            console.log(`Type: ${transaction.type}, Amount: ${transaction.amount}, Timestamp: ${transaction.timestamp}`)
        });
    }
}

class Transaction extends BankAccount {
    constructor(accountNumber, firstName, lastName, balance, type, amount, timestamp) {
        super(accountNumber, firstName, lastName, balance);
        this._type = type;
        this._amount = amount;
        this._timestamp = timestamp;
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

    addTransactions(transaction) {
        // checks the datatype of transaction
        if (typeof transaction !== "object") {
            throw new Error(`transaction passed is of type ${typeof transaction}, it should be of type of object`);
        }

        // checks the type of transaction
        if (transaction.type === 'deposit') {
            this._type = transaction.type;
            this._amount = transaction.amount;
            super.deposit(this._amount);
        }
        else if (transaction.type === 'withdraw') {
            this._type = transaction.type;
            this._amount = transaction.amount;
            super.withdraw(this._amount);
        }
        else {
            throw new Error('Invalid transaction type');
        }

        
        this._timestamp = new Date(); // Generate timestamp
        transaction.timestamp = this._timestamp
        
        // adds the transaction to the transactions array
        this._transactions.push(transaction);
        // console.log(`Transaction successfully added`);
    }
}

const client1 = new Transaction("0035682914","Jane", "Doe", 20000);


console.log('Account Number:', client1.accountNumber);
console.log('Account Name:', client1._accountHolder);
console.log('Account Balance:', client1._balance);

transaction1 = {
    type: "deposit",
    amount: 40000
}

transaction2 = {
    type: "withdraw",
    amount: 50000
}

try {
    client1.addTransactions(transaction1);
    client1.addTransactions(transaction2);
    // console.log(client1.withdraw(12000));
    // console.log(client1.deposit(8));
} catch (error) {
    console.log(error.message);
}

client1.getTransactions();

