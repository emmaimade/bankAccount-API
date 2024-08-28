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
        phoneNumber: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            unique: true
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        nationality: {
            type: String,
            required: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            local_government: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            }
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
        },
        isArchived: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);