import React, { useMemo } from 'react';
import { AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

const NudgeSystem = ({ transactions }) => {
  const nudges = useMemo(() => {
    const alerts = [];
    if (!transactions || transactions.length < 3) return alerts;
    const expenses = transactions.filter(t => t.type === 'expense');

    const wknd = expenses.filter(t => [0,6].includes(new Date(t.date).getDay())).reduce((a,t)=>a+t.amount,0);
    const wkdy = expenses.filter(t => ![0,6].includes(new Date(t.date).getDay())).reduce((a,t)=>a+t.amount,0);
    if (wknd > 0 && wknd/2 > wkdy/5 * 1.5) {
      alerts.push({ type: 'warning', icon: <TrendingUp size={14}/>, message: `Weekend spending is ${Math.round((wknd/2)/(wkdy/5)*100-100)}% higher than weekdays. Plan ahead to save.` });
    }

    const counts = expenses.reduce((a,t) => { const k=t.title.toLowerCase(); a[k]=(a[k]||0)+1; return a; }, {});
    const dups = Object.entries(counts).filter(([,c])=>c>=2);
    if (dups.length > 0) {
      alerts.push({ type: 'info', icon: <RefreshCw size={14}/>, message: `"${dups[0][0]}" appears ${dups[0][1]} times. Possible duplicate or subscription.` });
    }

    const cats = expenses.reduce((a,t) => { a[t.category]=(a[t.category]||0)+t.amount; return a; }, {});
    const total = expenses.reduce((a,t)=>a+t.amount,0);
    const top = Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];
    if (top && top[1]/total > 0.4) {
      alerts.push({ type: 'alert', icon: <AlertTriangle size={14}/>, message: `${top[0]} is ${Math.round(top[1]/total*100)}% of spending. Consider setting a budget.` });
    }

    return alerts.slice(0,3);
  }, [transactions]);

  if (nudges.length === 0) return null;

  const styles = {
    warning: { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
    info: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
    alert: { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {nudges.map((n, i) => {
        const s = styles[n.type];
        return (
          <div key={i} className="flex items-start gap-2.5 px-4 py-3 rounded-xl flex-1 min-w-60 text-sm font-medium"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
            <span className="flex-shrink-0 mt-0.5">{n.icon}</span>
            <p>{n.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default NudgeSystem;