const mongoose = require('mongoose');

// 1. Define the Schema
const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// 2. Export the Model
module.exports = mongoose.model('Transaction', TransactionSchema);