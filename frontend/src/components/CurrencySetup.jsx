import React, { useState } from 'react';
import { CURRENCIES, setCurrency } from '../utils/currency';
import { Leaf, ArrowRight } from 'lucide-react';

const CurrencySetup = ({ onComplete }) => {
  const [selected, setSelected] = useState('INR');

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#F0F4F3' }}>
      <div className="w-full max-w-md">

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            <Leaf size={18} className="text-white"/>
          </div>
          <span className="font-black text-xl" style={{ color: '#111827' }}>SpendWise</span>
        </div>

        <div className="rounded-3xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
          <h2 className="text-2xl font-black mb-1" style={{ color: '#111827' }}>Choose currency</h2>
          <p className="text-sm mb-7" style={{ color: '#6B7280' }}>
            All transactions will be shown in this currency
          </p>

          <div className="grid grid-cols-3 gap-3 mb-7">
            {CURRENCIES.map(c => (
              <button key={c.code} onClick={() => setSelected(c.code)}
                className="p-3 rounded-2xl text-center transition-all"
                style={{
                  background: selected === c.code ? '#F0FDF4' : '#F9FAFB',
                  border: `1.5px solid ${selected === c.code ? '#059669' : '#E5EDE9'}`,
                  transform: selected === c.code ? 'scale(1.04)' : 'scale(1)'
                }}>
                <div className="text-2xl mb-1">{c.flag}</div>
                <div className="font-black text-xs" style={{ color: selected === c.code ? '#059669' : '#111827' }}>
                  {c.code}
                </div>
                <div className="text-xs" style={{ color: '#9CA3AF' }}>{c.symbol}</div>
              </button>
            ))}
          </div>

          <button onClick={() => { setCurrency(selected); onComplete(); }}
            className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            Continue with {selected} <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencySetup;