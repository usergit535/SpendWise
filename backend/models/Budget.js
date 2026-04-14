const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  // Link the budget to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The category name (e.g., 'Food', 'Rent')
  category: {
    type: String,
    required: [true, 'Please specify a category for the budget'],
    trim: true
  },
  // The maximum amount allowed for this category
  limit: {
    type: Number,
    required: [true, 'Please add a budget limit'],
    min: [0, 'Limit cannot be negative']
  },
  // Optional: The month this budget applies to (e.g., 1 for January)
  month: {
    type: Number,
    default: new Date().getMonth() + 1
  },
  // Optional: The year
  year: {
    type: Number,
    default: new Date().getFullYear()
  }
}, { timestamps: true });

// Ensure a user can only have ONE budget per category per month
BudgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);