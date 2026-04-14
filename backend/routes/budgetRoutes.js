const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// ADD THIS LINE HERE AT THE TOP
const auth = require('../middleware/authMiddleware'); 

// 1. Route to ADD or UPDATE a budget
// Notice how 'auth' is passed as the second argument to protect the route
router.post('/add', auth, async (req, res) => {
    try {
        const { category, limit } = req.body;
        
        // Use req.user (since your middleware sets req.user = decoded.id)
        const userId = req.user; 

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

// 2. Route to GET all budgets for the logged-in user
router.get('/report', auth, async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user });
        res.status(200).json(budgets);
    } catch (err) {
        res.status(500).json({ message: "Error fetching budget report" });
    }
});

module.exports = router;