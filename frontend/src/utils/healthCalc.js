// src/utils/healthCalc.js

export const getHealthScore = (income, expenses, budgets) => {
  if (!income || income === 0) return 0;
  
  let score = 0;
  const savingsRate = (income - expenses) / income;
  
  // 50 points based on savings
  score += Math.max(0, Math.min(savingsRate * 100, 50)); 
  
  // 50 points based on budgets
  if (budgets && budgets.length > 0) {
    const underBudget = budgets.filter(b => (b.spent || 0) <= b.limit).length;
    score += (underBudget / budgets.length) * 50;
  } else {
    score += 25; // Default points if no budgets set
  }

  return Math.round(score);
};