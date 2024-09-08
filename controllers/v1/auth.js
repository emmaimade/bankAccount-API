const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../../models/Account');

const login = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await Account.findOne({ email })
    .catch((err) => {
        res.status(500).json({ err: err.message });
    });

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, accountNumber: user.accountNumber }, process.env.JWT_SECRET, { expiresIn: "1h"});

    res.status(200).json(token);
});

module.exports = { login };