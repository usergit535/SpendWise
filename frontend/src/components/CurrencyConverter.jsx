import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Loader2, Globe } from 'lucide-react';

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'AED'];

const CurrencyConverter = () => {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5050/api/v1/ai/currency/${from}/${to}/${amount}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch { alert('Conversion failed. Try again.'); }
    finally { setLoading(false); }
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  const selectStyle = {
    background: '#F9FAFB',
    border: '1px solid #E5EDE9',
    color: '#059669',
    fontWeight: '700'
  };

  return (
    <div className="rounded-2xl p-6 h-full"
      style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
      <div className="flex items-center gap-2 mb-5">
        <Globe size={17} style={{ color: '#059669' }}/>
        <h3 className="font-black" style={{ color: '#111827' }}>Currency Converter</h3>
      </div>

      <div className="space-y-3">
        <input type="number" placeholder="Amount"
          value={amount}
          onChange={e => { setAmount(e.target.value); setResult(null); }}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm font-bold"
          style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
          onFocus={e => e.target.style.borderColor = '#059669'}
          onBlur={e => e.target.style.borderColor = '#E5EDE9'}
        />

        <div className="flex items-center gap-2">
          <select value={from} onChange={e => { setFrom(e.target.value); setResult(null); }}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={selectStyle}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button onClick={swap}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:opacity-70"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <ArrowRightLeft size={16} style={{ color: '#059669' }}/>
          </button>

          <select value={to} onChange={e => { setTo(e.target.value); setResult(null); }}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={selectStyle}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button onClick={convert} disabled={loading || !amount}
          className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
          {loading ? <><Loader2 size={15} className="animate-spin"/> Converting...</> : 'Convert'}
        </button>

        {result && (
          <div className="rounded-2xl p-4 text-center"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#059669' }}>
              {result.amount} {result.from} =
            </p>
            <p className="text-3xl font-black" style={{ color: '#111827' }}>
              {result.converted.toLocaleString()}{' '}
              <span style={{ color: '#059669' }}>{result.to}</span>
            </p>
            <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>
              1 {result.from} = {result.rate} {result.to}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;