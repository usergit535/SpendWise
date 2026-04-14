const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/Transaction');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// ─── ROUTE 1: Financial Advisor Chatbot ───────────────────────────
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user;

    const transactions = await Transaction.find({ user: userId })
      .sort({ date: -1 }).limit(50);

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;

    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const categoryText = Object.entries(categoryBreakdown)
      .map(([cat, amt]) => `${cat}: $${amt}`).join(', ') || 'No expenses yet';

    const recentTx = transactions.slice(0, 5)
      .map(t => `${t.title} ($${t.amount} - ${t.type})`).join(', ') || 'None';

    const prompt = `You are SpendWise AI, a friendly personal finance advisor.
User financial data:
- Total Income: $${income}
- Total Expenses: $${expenses}
- Current Balance: $${balance}
- Expense Breakdown: ${categoryText}
- Recent transactions: ${recentTx}

User question: "${message}"

Give concise, practical advice in 2-3 sentences. Be friendly and specific to their data. No markdown formatting.`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ message: 'AI service error' });
  }
});

// ─── ROUTE 2: Smart Categorization ───────────────────────────────
router.post('/categorize', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const prompt = `Categorize this transaction into exactly ONE of: Food, Rent, Shopping, Entertainment, General, Transport, Health, Education.
Transaction: "${title}"
Rules: Zomato/Swiggy/restaurant=Food, Uber/Ola/petrol=Transport, Netflix/Spotify=Entertainment, Amazon/Flipkart=Shopping, Hospital/pharmacy=Health, School/courses=Education, House rent=Rent, else=General
Reply with ONLY the category name.`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();
    const validCategories = ['Food', 'Rent', 'Shopping', 'Entertainment', 'General', 'Transport', 'Health', 'Education'];
    const finalCategory = validCategories.includes(category) ? category : 'General';
    res.json({ category: finalCategory });
  } catch (err) {
    res.status(500).json({ category: 'General' });
  }
});

// ─── ROUTE 3: Expense Prediction ─────────────────────────────────
router.get('/predict', auth, async (req, res) => {
  try {
    const userId = req.user;
    const transactions = await Transaction.find({ user: userId, type: 'expense' })
      .sort({ date: 1 });

    if (transactions.length < 3) {
      return res.json({ 
        prediction: null, 
        message: 'Need at least 3 transactions for prediction' 
      });
    }

    // Group by month
    const monthlyTotals = transactions.reduce((acc, t) => {
      const key = `${new Date(t.date).getFullYear()}-${new Date(t.date).getMonth()}`;
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {});

    const monthValues = Object.values(monthlyTotals);
    
    // Simple linear regression
    const n = monthValues.length;
    const xMean = (n - 1) / 2;
    const yMean = monthValues.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0, denominator = 0;
    monthValues.forEach((y, x) => {
      numerator += (x - xMean) * (y - yMean);
      denominator += (x - xMean) ** 2;
    });

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;
    const nextMonthPrediction = Math.max(0, Math.round(slope * n + intercept));

    // Category breakdown for next month
    const categoryBreakdown = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const totalSpent = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);
    const categoryPredictions = Object.entries(categoryBreakdown).map(([cat, amt]) => ({
      category: cat,
      predicted: Math.round((amt / totalSpent) * nextMonthPrediction)
    })).sort((a, b) => b.predicted - a.predicted);

    // AI insight
    const prompt = `A user's predicted next month spending is $${nextMonthPrediction}. 
Their top categories: ${categoryPredictions.slice(0, 3).map(c => `${c.category}: $${c.predicted}`).join(', ')}.
Give one sentence of practical advice. No markdown.`;
    
    const result = await model.generateContent(prompt);
    
    res.json({
      prediction: nextMonthPrediction,
      categoryPredictions,
      trend: slope > 0 ? 'increasing' : 'decreasing',
      trendAmount: Math.abs(Math.round(slope)),
      insight: result.response.text(),
      monthlyHistory: monthlyTotals
    });
  } catch (err) {
    console.error('Prediction error:', err.message);
    res.status(500).json({ message: 'Prediction error' });
  }
});

// ─── ROUTE 4: What-If Simulator ───────────────────────────────────
router.post('/whatif', auth, async (req, res) => {
  try {
    const { scenario, amount, months = 6 } = req.body;
    const userId = req.user;

    const transactions = await Transaction.find({ user: userId })
      .sort({ date: -1 }).limit(100);

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const currentSavings = income - expenses;
    const monthlySavings = currentSavings / Math.max(1, months);
    const projectedSavings = monthlySavings * months;
    const afterPurchase = projectedSavings - amount;

    const prompt = `A user wants to ${scenario} for $${amount}. 
Their current situation: Income $${income}, Expenses $${expenses}, Monthly savings ~$${Math.round(monthlySavings)}.
Projected ${months}-month savings: $${Math.round(projectedSavings)}.
After this purchase they would have: $${Math.round(afterPurchase)}.
Give 2-3 sentences of practical advice on whether they can afford it and what to do. No markdown.`;

    const result = await model.generateContent(prompt);

    res.json({
      canAfford: afterPurchase >= 0,
      projectedSavings: Math.round(projectedSavings),
      afterPurchase: Math.round(afterPurchase),
      monthlySavings: Math.round(monthlySavings),
      advice: result.response.text()
    });
  } catch (err) {
    console.error('WhatIf error:', err.message);
    res.status(500).json({ message: 'Simulator error' });
  }
});

// ─── ROUTE 5: Currency Conversion ────────────────────────────────
router.get('/currency/:from/:to/:amount', auth, async (req, res) => {
  try {
    const { from, to, amount } = req.params;
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`
    );
    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];
    if (!rate) return res.status(400).json({ message: 'Invalid currency' });
    res.json({ 
      from, to, amount: Number(amount),
      converted: Math.round(Number(amount) * rate * 100) / 100,
      rate 
    });
  } catch (err) {
    res.status(500).json({ message: 'Currency conversion error' });
  }
});

module.exports = router;