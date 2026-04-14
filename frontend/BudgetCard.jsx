import React from 'react';

const BudgetCard = ({ category, limit, spent }) => {
  const percent = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;

  return (
    <div className="bg-white p-5 rounded-3xl border border-purple-50 shadow-sm mb-3">
      <div className="flex justify-between mb-2">
        <span className="font-bold text-purple-900">{category}</span>
        <span className={`text-sm font-bold ${isOver ? 'text-rose-500' : 'text-slate-400'}`}>
          ${spent} / ${limit}
        </span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-purple-600'}`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BudgetCard;