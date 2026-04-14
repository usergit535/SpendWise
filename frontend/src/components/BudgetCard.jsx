import React from 'react';
import { formatAmount } from '../utils/currency';

const CAT_COLORS = {
  Food: '#f59e0b', Rent: '#6366f1', Shopping: '#ec4899',
  Entertainment: '#8b5cf6', Transport: '#06b6d4',
  Health: '#059669', Education: '#f97316', General: '#6B7280'
};

const BudgetCard = ({ category, limit, spent = 0 }) => {
  const percent = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;
  const color = isOver ? '#ef4444' : (CAT_COLORS[category] || '#059669');

  return (
    <div className="p-4 rounded-2xl transition-all"
      style={{ background: '#F9FAFB', border: '1px solid #E5EDE9' }}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }}/>
          <span className="font-bold text-sm" style={{ color: '#111827' }}>{category}</span>
        </div>
        <span className="text-xs font-bold" style={{ color: isOver ? '#ef4444' : '#6B7280' }}>
          {formatAmount(spent)} / {formatAmount(limit)}
        </span>
      </div>
      <div className="w-full rounded-full h-1.5" style={{ background: '#E5EDE9' }}>
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: color }}/>
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs" style={{ color: '#9CA3AF' }}>{Math.round(percent)}% used</span>
        <span className="text-xs font-bold" style={{ color: isOver ? '#ef4444' : '#059669' }}>
          {isOver ? `${formatAmount(spent - limit)} over` : `${formatAmount(limit - spent)} left`}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;