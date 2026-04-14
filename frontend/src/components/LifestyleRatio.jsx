import React, { useMemo } from 'react';
import { formatAmount } from '../utils/currency';

const NEEDS = ['Rent','Food','Health','Transport','Education'];
const WANTS = ['Shopping','Entertainment','General'];

const LifestyleRatio = ({ transactions }) => {
  const { needsTotal, wantsTotal, needsPct, wantsPct } = useMemo(() => {
    const exp = transactions.filter(t => t.type === 'expense');
    const n = exp.filter(t => NEEDS.includes(t.category)).reduce((a,t)=>a+t.amount,0);
    const w = exp.filter(t => WANTS.includes(t.category)).reduce((a,t)=>a+t.amount,0);
    const tot = n+w||1;
    return { needsTotal:n, wantsTotal:w, needsPct:Math.round(n/tot*100), wantsPct:Math.round(w/tot*100) };
  }, [transactions]);

  const isHealthy = needsPct <= 50;

  return (
    <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-black" style={{ color: '#111827' }}>Needs vs Wants</h3>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ background: isHealthy ? '#F0FDF4' : '#FFFBEB', color: isHealthy ? '#059669' : '#92400E' }}>
          {isHealthy ? '✓ Balanced' : '⚠ Review Spending'}
        </span>
      </div>

      <div className="flex rounded-full overflow-hidden h-3 mb-5 gap-0.5">
        <div className="transition-all duration-700 rounded-l-full"
          style={{ width: `${needsPct}%`, background: 'linear-gradient(90deg, #059669, #34d399)' }}/>
        <div className="transition-all duration-700 rounded-r-full"
          style={{ width: `${wantsPct}%`, background: 'linear-gradient(90deg, #ec4899, #f43f5e)' }}/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label:'Needs', pct:needsPct, total:needsTotal, color:'#059669', bg:'#F0FDF4', sub:'Rent, Food, Health...' },
          { label:'Wants', pct:wantsPct, total:wantsTotal, color:'#ec4899', bg:'#FDF2F8', sub:'Shopping, Fun...' },
        ].map(item => (
          <div key={item.label} className="p-4 rounded-2xl" style={{ background: item.bg }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }}/>
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
            </div>
            <p className="text-2xl font-black" style={{ color: '#111827' }}>{item.pct}%</p>
            <p className="text-sm font-bold mt-1" style={{ color: '#6B7280' }}>{formatAmount(item.total)}</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{item.sub}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-4" style={{ color: '#9CA3AF' }}>
        Ideal: 50% Needs · 30% Wants · 20% Savings
      </p>
    </div>
  );
};

export default LifestyleRatio;