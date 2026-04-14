import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AIAdvisorBot from '../components/AIAdvisorBot';
import { Target, Plus, X } from 'lucide-react';

const CATEGORIES = ['Food','Rent','Shopping','Entertainment','General','Transport','Health','Education'];

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [budgetData, setBudgetData] = useState({ category: 'Food', limit: '' });

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/v1/budgets/report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5050/api/v1/budgets/add', budgetData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setBudgetData({ category: 'Food', limit: '' });
      fetchBudgets();
    } catch { alert('Error setting budget'); }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F0F4F3' }}>
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black" style={{ color: '#111827' }}>Budgets</h2>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Set and track monthly spending limits</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            <Plus size={15}/> Set Budget
          </button>
        </header>

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-3 gap-5">
          {budgets.map(b => {
            const pct = Math.min((b.spent / b.limit) * 100, 100);
            const over = b.spent > b.limit;
            return (
              <div key={b.category} className="rounded-2xl p-6"
                style={{ background: '#FFFFFF', border: `1px solid ${over ? '#FECACA' : '#E5EDE9'}` }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-black" style={{ color: '#111827' }}>{b.category}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Monthly limit</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: over ? '#FEF2F2' : '#F0FDF4',
                      color: over ? '#ef4444' : '#059669'
                    }}>
                    {over ? 'Over budget!' : `${Math.round(pct)}% used`}
                  </span>
                </div>
                <div className="w-full rounded-full h-2 mb-3" style={{ background: '#E5EDE9' }}>
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: over ? '#ef4444' : 'linear-gradient(90deg, #059669, #34d399)'
                    }}/>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span style={{ color: over ? '#ef4444' : '#059669' }}>₹{b.spent?.toLocaleString()} spent</span>
                  <span style={{ color: '#9CA3AF' }}>₹{b.limit?.toLocaleString()} limit</span>
                </div>
              </div>
            );
          })}
          {budgets.length === 0 && (
            <div className="col-span-3 text-center py-20 rounded-2xl"
              style={{ background: '#FFFFFF', border: '1px solid #E5EDE9', color: '#9CA3AF' }}>
              <Target size={40} className="mx-auto mb-3" style={{ color: '#E5EDE9' }}/>
              <p className="font-bold">No budgets set yet</p>
              <p className="text-sm mt-1">Click "Set Budget" to get started</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-3xl p-8 relative"
            style={{ background: '#FFFFFF' }}>
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6"
              style={{ color: '#9CA3AF' }}><X size={20}/></button>
            <h3 className="font-black text-lg mb-6" style={{ color: '#111827' }}>Set Monthly Budget</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={budgetData.category}
                onChange={e => setBudgetData({ ...budgetData, category: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl font-bold text-sm outline-none"
                style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#059669' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Monthly limit (₹)"
                value={budgetData.limit}
                onChange={e => setBudgetData({ ...budgetData, limit: Number(e.target.value) })}
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm"
                style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
                required />
              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                Save Budget
              </button>
            </form>
          </div>
        </div>
      )}
      <AIAdvisorBot />
    </div>
  );
};

export default BudgetsPage;