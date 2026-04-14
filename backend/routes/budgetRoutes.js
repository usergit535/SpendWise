const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');

// 1. Route to ADD or UPDATE a budget
router.post('/add', auth, async (req, res) => {
    try {
        const { category, limit } = req.body;
        const userId = req.user; // ✅ req.user is already the ID

        const budget = await Budget.findOneAndUpdate(
            { user: userId, category: category },
            { 
                limit: Number(limit),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json(budget);
    } catch (err) {
        console.error("Budget Error:", err.message);
        res.status(500).json({ message: "Server error setting budget" });
    }
});

// 2. Route to GET all budgets with spent amount
router.get('/report', auth, async (req, res) => {
    try {
        const userId = req.user; // ✅ req.user is already the ID
        const budgets = await Budget.find({ user: userId });

        const report = await Promise.all(budgets.map(async (budget) => {
            const expenses = await Transaction.aggregate([
                { 
                    $match: { 
                        user: new mongoose.Types.ObjectId(userId), // ✅ convert to ObjectId
                        category: budget.category, 
                        type: 'expense',
                        date: { 
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
                        }
                    } 
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            return {
                category: budget.category,
                limit: budget.limit,
                spent: expenses.length > 0 ? expenses[0].total : 0
            };
        }));

        res.status(200).json(report);
    } catch (err) {
        console.error("Report Error:", err.message);
        res.status(500).json({ message: "Error fetching budget report" });
    }
});

module.exports = router;