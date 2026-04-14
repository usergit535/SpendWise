import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SCENARIOS = [
  'buy a new phone', 'go on a vacation', 'buy a laptop',
  'purchase a bike', 'invest in stocks',
];

const WhatIfSimulator = () => {
  const [scenario, setScenario] = useState('buy a new phone');
  const [customScenario, setCustomScenario] = useState('');
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState(6);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    if (!amount) return;
    setLoading(true); setResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5050/api/v1/ai/whatif',
        { scenario: customScenario || scenario, amount: Number(amount), months },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    background: '#F9FAFB',
    border: '1px solid #E5EDE9',
    color: '#111827'
  };

  return (
    <div className="rounded-2xl p-6 h-full"
      style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={17} style={{ color: '#059669' }}/>
        <h3 className="font-black" style={{ color: '#111827' }}>What-If Simulator</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
            style={{ color: '#6B7280' }}>Scenario</label>
          <select value={scenario} onChange={e => setScenario(e.target.value)}
            className="w-full px-4 py-3 rounded-xl font-bold text-sm outline-none"
            style={inputStyle}>
            {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <input type="text" placeholder="Or type your own scenario..."
          value={customScenario} onChange={e => setCustomScenario(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#059669'}
          onBlur={e => e.target.style.borderColor = '#E5EDE9'}
        />

        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
            style={{ color: '#6B7280' }}>Amount (₹)</label>
          <input type="number" placeholder="Enter amount..."
            value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none font-bold"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#059669'}
            onBlur={e => e.target.style.borderColor = '#E5EDE9'}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
            style={{ color: '#6B7280' }}>Savings window: {months} months</label>
          <input type="range" min="1" max="24" value={months}
            onChange={e => setMonths(Number(e.target.value))}
            className="w-full" style={{ accentColor: '#059669' }}
          />
        </div>

        <button onClick={simulate} disabled={loading || !amount}
          className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
          {loading
            ? <><Loader2 size={16} className="animate-spin"/> Simulating...</>
            : <><Sparkles size={16}/> Run Simulation</>}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 rounded-2xl"
          style={{
            background: result.canAfford ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${result.canAfford ? '#BBF7D0' : '#FECACA'}`
          }}>
          <div className="flex items-center gap-2 mb-3">
            {result.canAfford
              ? <CheckCircle size={18} style={{ color: '#059669' }}/>
              : <XCircle size={18} style={{ color: '#ef4444' }}/>}
            <p className="font-black text-sm"
              style={{ color: result.canAfford ? '#059669' : '#ef4444' }}>
              {result.canAfford ? 'You can afford this!' : 'Not quite yet'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Projected Savings', val: `₹${result.projectedSavings?.toLocaleString()}` },
              { label: 'After Purchase', val: `₹${result.afterPurchase?.toLocaleString()}` }
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-3 text-center"
                style={{ border: '1px solid #E5EDE9' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#6B7280' }}>{s.label}</p>
                <p className="font-black text-sm" style={{ color: '#111827' }}>{s.val}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-medium leading-relaxed"
            style={{ color: result.canAfford ? '#065f46' : '#991b1b' }}>
            {result.advice}
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;