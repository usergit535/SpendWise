const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  // 1. Link this expense to a specific User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // This refers to the 'User' model you already made
  },
  // 2. The name of the expense (e.g., "Grocery")
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  // 3. The money spent
  amount: {
    type: Number,
    required: [true, "Please add an amount"],
  },
  // 4. Grouping (e.g., Food, Rent, Entertainment)
  category: {
    type: String,
    required: [true, "Please select a category"],
  },
  // 5. When it happened
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model("Expense", expenseSchema);
