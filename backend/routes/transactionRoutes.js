const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const Transaction = require('../models/Transaction'); 

// 1. ADD TRANSACTION
// @route    POST api/v1/add-transaction
router.post('/add-transaction', auth, async (req, res) => {
    try {
        const { title, amount, type, category, date } = req.body;

        // Check for required fields
        if (!title || !amount || !type) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const newTransaction = new Transaction({
            title,
            amount,
            type,
            category,
            date: date || Date.now(),
            user: req.user // Uses the ID from your authMiddleware
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        console.error("Add Error:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. GET ALL TRANSACTIONS (For the logged-in user)
// @route    GET api/v1/get-transactions
router.get('/get-transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error("Get Error:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. DELETE TRANSACTION
// @route    DELETE api/v1/delete-transaction/:id
router.delete('/delete-transaction/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Security check
        if (transaction.user.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await transaction.deleteOne();
        res.json({ message: "Transaction removed successfully" });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;