import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Brain, RefreshCw } from 'lucide-react';

const ExpensePrediction = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/v1/ai/predict', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPrediction(); }, []);

  if (loading) return (
    <div className="rounded-2xl p-6 flex items-center justify-center"
      style={{ background: '#FFFFFF', border: '1px solid #E5EDE9', minHeight: '200px' }}>
      <RefreshCw className="animate-spin" size={24} style={{ color: '#059669' }}/>
    </div>
  );

  if (!data?.prediction) return (
    <div className="rounded-2xl p-6 h-full"
      style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
      <div className="flex items-center gap-2 mb-4">
        <Brain size={17} style={{ color: '#059669' }}/>
        <h3 className="font-black" style={{ color: '#111827' }}>Expense Prediction</h3>
      </div>
      <div className="flex flex-col items-center justify-center py-10"
        style={{ color: '#9CA3AF' }}>
        <Brain size={40} style={{ color: '#E5EDE9', marginBottom: '12px' }}/>
        <p className="text-sm font-medium text-center">
          Add more transactions to unlock AI predictions
        </p>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl p-6 h-full"
      style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Brain size={17} style={{ color: '#059669' }}/>
          <h3 className="font-black" style={{ color: '#111827' }}>Next Month Forecast</h3>
        </div>
        <button onClick={fetchPrediction}
          className="p-1.5 rounded-lg transition-all hover:opacity-70"
          style={{ color: '#059669' }}>
          <RefreshCw size={15}/>
        </button>
      </div>

      {/* Main prediction number */}
      <div className="rounded-2xl p-5 mb-4 text-center"
        style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{ color: '#059669' }}>Predicted Spending</p>
        <p className="text-4xl font-black" style={{ color: '#111827' }}>
          ₹{data.prediction.toLocaleString()}
        </p>
        <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold"
          style={{ color: data.trend === 'increasing' ? '#ef4444' : '#059669' }}>
          {data.trend === 'increasing'
            ? <><TrendingUp size={13}/> +₹{data.trendAmount}/month trend</>
            : <><TrendingDown size={13}/> -₹{data.trendAmount}/month trend</>}
        </div>
      </div>

      {/* Category bars */}
      <div className="space-y-2.5 mb-4">
        {data.categoryPredictions?.slice(0, 4).map(cat => (
          <div key={cat.category} className="flex items-center gap-3">
            <span className="text-xs font-bold w-20 truncate" style={{ color: '#6B7280' }}>
              {cat.category}
            </span>
            <div className="flex-1 rounded-full h-1.5" style={{ background: '#E5EDE9' }}>
              <div className="h-1.5 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((cat.predicted / data.prediction) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #059669, #34d399)'
                }}/>
            </div>
            <span className="text-xs font-black w-16 text-right" style={{ color: '#111827' }}>
              ₹{cat.predicted.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* AI insight */}
      {data.insight && (
        <div className="rounded-xl p-3"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <p className="text-xs font-medium leading-relaxed" style={{ color: '#92400E' }}>
            💡 {data.insight}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensePrediction;