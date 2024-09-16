const mongoose = require('mongoose');

const dbUri = process.env.DB_URI;

const connectDB = async () => {
    mongoose.connect(dbUri)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to database', err);
    })
}

module.exports = connectDB;