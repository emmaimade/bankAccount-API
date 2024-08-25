const asynchandler = require('express-async-handler');
const Account = require('../../models/Account');
const bcrypt = require('bcrypt');

const createAccount = asynchandler (async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password ) {
        return res.status(400).send({ message: "Please provide all the details"});
    }

    // create account Name
    const accountHolder = `${firstName} ${lastName}`;

    // generate 10 digits accountNumber
    const generateAccountNumber = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    }

    const accountNumber = generateAccountNumber();

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create account
    const account = new Account({
        firstName,
        lastName,
        accountHolder,
        accountNumber,
        email,
        password: hashedPassword,
    });

    // save account
    await account.save();

    res.status(201).send(account);
});

module.exports = {
    createAccount
}