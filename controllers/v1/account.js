const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { getNames } = require('country-list');
const Account = require('../../models/Account');

const validNationalities = getNames();

const createAccount = asynchandler (async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, gender, dateOfBirth, nationality, address } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password || !gender || !dateOfBirth || !nationality || !address) {
        return res.status(400).send({ message: "Please provide all the details"});
    }

    // check if email is valid
    if (!validator.isEmail(email)) {
        return res.status(400).send({ message: "Please provide a valid email"});
    }

    // check if phone number is valid
    if (!validator.isMobilePhone(phoneNumber, 'any')) {
        return res.status(400).send({ message: "Please provide a valid phone number"});
    }

    // Validate gender
    if (!['male', 'female'].includes(gender.toLowerCase())) {
        return res.status(400).send({ message: "Gender must be 'male' or 'female'." });
    }

    // Validate dateOfBirth
    if (!validator.isDate(dateOfBirth)) {
        return res.status(400).send({ message: "Date of birth must be a valid date. yyyy-mm-dd" });
    }

    // Validate nationality
    if (!validNationalities.includes(nationality)) {
        return res.status(400).send({ message: "Please provide a valid nationality." });
    }

    // check if address fields are valid
    if (!address.street || !address.local_government || !address.state || !address.country) {
        return res.status(400).send({ message: "Please provide a valid address"});
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
        phoneNumber,
        password: hashedPassword,
        gender: gender.toLowerCase(),
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        address
    });

    // save account
    await account.save();

    res.status(201).send(account);
});

const getAccounts = asynchandler (async (req, res) => {
    const accounts = await Account.find({ isArchived: false });
    res.status(200).send(accounts);
});

const getAccount = asynchandler (async (req, res) => {
    const id = req.params.id;
    console.log(id);

    const account = await Account.findById(id);
    if (!account) {
        return res.status(404).send({ message: "Account not found"});
    }

    res.status(200).send(account);
});

const updateAccount = asynchandler (async (req, res) => {
    try {
        const id = req.params.id;
        const { firstName, lastName, email, phoneNumber, address } = req.body;

        // check if account exists
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).send({ message: "Account does not exist"});
        }

        if (firstName) account.firstName = firstName;
        if (lastName) account.lastName = lastName;
        if (address) account.address = address;

        if (email) {
            // check if email is valid
            if (!validator.isEmail(email)) {
                return res.status(400).send({ message: "Please provide a valid email"});
            }
            account.email = email;
        }

        if (phoneNumber) {
            // check if phone number is valid
            if (!validator.isMobilePhone(phoneNumber, 'any')) {
                return res.status(400).send({ message: "Please provide a valid phone number"});
            }
            account.phoneNumber = phoneNumber;
        }

        // update account holder name
        account.accountHolder = `${firstName || account.firstName} ${lastName || account.lastName}`;

        // save account
        await account.save();

        res.status(200).send(account);
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
});

const archiveAccount = asynchandler (async (req, res) => {
    const id = req.params.id;

    // checks if account exists
    const account = await Account.findById(id);
    if (!account) {
        return res.status(404).send({ message: "Account does not exist"});
    }
    account.isArchived = true;
    await account.save();

    res.status(200).send({ message: "Account archived successfully" });
});

module.exports = {
    createAccount,
    getAccounts,
    getAccount,
    updateAccount,
    archiveAccount
}