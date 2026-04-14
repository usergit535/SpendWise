const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction'); // Assuming this is your model name

exports.getBudgetReport = async (req, res) => {
  try {
    const userId = req.user.id; // From your auth middleware
    const budgets = await Budget.find({ user: userId });

    // For each budget, calculate total spent in that category for the current month
    const report = await Promise.all(budgets.map(async (budget) => {
      const expenses = await Transaction.aggregate([
        { 
          $match: { 
            user: userId, 
            category: budget.category, 
            type: 'expense',
            // Filter for current month/year
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

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};