const express = require("express");
const router = express.Router();
// 1. Check these two paths carefully! 
const { addExpense, getExpenses } = require("../controllers/expensecontroller");
const { protect } = require("../middleware/authMiddleware");

// 2. This structure is very strict. No missing commas or dots!
router.route("/")
  .get(protect, getExpenses)
  .post(protect, addExpense);

module.exports = router;

