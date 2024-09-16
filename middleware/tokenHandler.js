const asynchandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = asynchandler(async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        res.status(400).json({ error: "Not authorized, no token" });
    }
    
    token = token.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err) {
            res.status(401).json({
                error: "Not authorized, token failed",
                message: err.message
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            res.status(400).json({ message: "Invalid user ID" })
        }

        req.user = decoded
        next();
    });
});


module.exports = verifyToken