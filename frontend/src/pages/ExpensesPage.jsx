import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingDown, Trash2, PlusCircle, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { formatAmount } from '../utils/currency';

const CAT_COLORS = {
  Food: '#f59e0b', Rent: '#6366f1', Shopping: '#ec4899',
  Entertainment: '#8b5cf6', Transport: '#06b6d4',
  Health: '#059669', Education: '#f97316', General: '#6B7280'
};

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'General' });

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/v1/get-transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const only = res.data.filter(t => t.type === 'expense');
      setExpenses(only);
      setTotalExpense(only.reduce((a, c) => a + c.amount, 0));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const deleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/v1/delete-transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch { alert('Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5050/api/v1/add-transaction',
        { ...formData, type: 'expense' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setFormData({ title: '', amount: '', category: 'General' });
      fetchExpenses();
    } catch { alert('Error'); }
  };

  const categories = ['All', ...Object.keys(CAT_COLORS)];
  const filtered = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);

  return (
    <div className="flex min-h-screen" style={{ background: '#F0F4F3' }}>
      <Sidebar />
      <main className="flex-1 ml-64 p-8">

        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black" style={{ color: '#111827' }}>My Expenses</h2>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              Total: <span className="font-black" style={{ color: '#ef4444' }}>-{formatAmount(totalExpense)}</span>
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
            <PlusCircle size={15}/> Add Expense
          </button>
        </header>

        {/* Summary Banner */}
        <div className="rounded-2xl p-6 mb-6 flex items-center gap-5"
          style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20">
            <TrendingDown size={26} className="text-white"/>
          </div>
          <div>
            <p className="text-red-100 text-sm font-bold">Total Spent</p>
            <p className="text-white text-4xl font-black">-{formatAmount(totalExpense)}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-red-100 text-sm">{expenses.length} entries</p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {categories.map(cat => {
            const color = CAT_COLORS[cat] || '#059669';
            const active = filter === cat;
            return (
              <button key={cat} onClick={() => setFilter(cat)}
                className="px-4 py-2 rounded-xl text-xs font-black transition-all"
                style={{
                  background: active ? color + '15' : '#FFFFFF',
                  color: active ? color : '#6B7280',
                  border: `1px solid ${active ? color + '40' : '#E5EDE9'}`
                }}>
                {cat}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map(tx => {
            const color = CAT_COLORS[tx.category] || '#6B7280';
            return (
              <div key={tx._id}
                className="flex items-center justify-between p-5 rounded-2xl group transition-all hover:shadow-sm"
                style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color + '40'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E5EDE9'}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: color + '12' }}>
                    <TrendingDown size={20} style={{ color }}/>
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: '#111827' }}>{tx.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: color + '12', color }}>
                        {tx.category}
                      </span>
                      <span className="text-xs" style={{ color: '#9CA3AF' }}>
                        {new Date(tx.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-black" style={{ color: '#ef4444' }}>-{formatAmount(tx.amount)}</p>
                  <button onClick={() => deleteExpense(tx._id)}
                    className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl"
                    style={{ color: '#D1D5DB' }}>
                    <Trash2 size={17}/>
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed"
              style={{ borderColor: '#E5EDE9', color: '#9CA3AF' }}>
              No expenses in this category
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-3xl p-8 relative"
            style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6" style={{ color: '#9CA3AF' }}>
              <X size={20}/>
            </button>
            <h3 className="text-xl font-black mb-6" style={{ color: '#111827' }}>Add Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title (e.g. Zomato, Rent...)" required
                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm"
                style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = '#E5EDE9'}
              />
              <input type="number" placeholder="Amount" required
                value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-4 py-3.5 rounded-xl outline-none text-sm"
                style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = '#E5EDE9'}
              />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl font-bold text-sm outline-none"
                style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#059669' }}>
                {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white text-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;