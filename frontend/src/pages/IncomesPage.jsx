import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Trash2, PlusCircle, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { formatAmount } from '../utils/currency';

const IncomesPage = () => {
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'General' });

  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/v1/get-transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const only = res.data.filter(t => t.type === 'income');
      setIncomes(only);
      setTotalIncome(only.reduce((a, c) => a + c.amount, 0));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchIncomes(); }, []);

  const deleteIncome = async (id) => {
    if (!window.confirm('Delete this income?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/v1/delete-transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIncomes();
    } catch { alert('Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5050/api/v1/add-transaction',
        { ...formData, type: 'income' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setFormData({ title: '', amount: '', category: 'General' });
      fetchIncomes();
    } catch { alert('Error'); }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F0F4F3' }}>
      <Sidebar />
      <main className="flex-1 ml-64 p-8">

        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black" style={{ color: '#111827' }}>My Incomes</h2>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              Total: <span className="font-black" style={{ color: '#059669' }}>{formatAmount(totalIncome)}</span>
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            <PlusCircle size={15}/> Add Income
          </button>
        </header>

        {/* Summary Banner */}
        <div className="rounded-2xl p-6 mb-6 flex items-center gap-5"
          style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20">
            <TrendingUp size={26} className="text-white"/>
          </div>
          <div>
            <p className="text-emerald-100 text-sm font-bold">Total Earnings</p>
            <p className="text-white text-4xl font-black">{formatAmount(totalIncome)}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-emerald-100 text-sm">{incomes.length} entries</p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {incomes.map(tx => (
            <div key={tx._id}
              className="flex items-center justify-between p-5 rounded-2xl group transition-all hover:shadow-sm"
              style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#BBF7D0'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E5EDE9'}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: '#F0FDF4' }}>
                  <TrendingUp size={20} style={{ color: '#059669' }}/>
                </div>
                <div>
                  <p className="font-bold" style={{ color: '#111827' }}>{tx.title}</p>
                  <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>
                    {tx.category} · {new Date(tx.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xl font-black" style={{ color: '#059669' }}>+{formatAmount(tx.amount)}</p>
                <button onClick={() => deleteIncome(tx._id)}
                  className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl"
                  style={{ color: '#D1D5DB' }}>
                  <Trash2 size={17}/>
                </button>
              </div>
            </div>
          ))}
          {incomes.length === 0 && (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed"
              style={{ borderColor: '#E5EDE9', color: '#9CA3AF' }}>
              No income recorded yet
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
            <h3 className="text-xl font-black mb-6" style={{ color: '#111827' }}>Add Income</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title (e.g. Salary, Freelance...)" required
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
                {['General','Salary','Freelance','Business','Investment','Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white text-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                Add Income
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomesPage;