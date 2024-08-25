const mongoose = require('mongoose');
const { transactionSchema } = require('./Transaction');

const accountSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        accountHolder: {
            type: String,
            required: true
        },
        accountNumber: {
            type: Number,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            unique: true
        },
        balance: {
            type: Number,
            required: true,
            default: 0
        },
        transactions: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Transaction'
            }],
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);