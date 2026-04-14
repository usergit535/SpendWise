import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, X, Target, Download, TrendingUp, TrendingDown, Trash2, Filter, Leaf } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import HistoryChart from '../components/HistoryChart';
import CategoryChart from '../components/CategoryChart';
import BudgetCard from '../components/BudgetCard';
import HealthScoreCard from '../components/HealthScoreCard';
import ReceiptScanner from '../components/ReceiptScanner';
import AIAdvisorBot from '../components/AIAdvisorBot';
import NudgeSystem from '../components/NudgeSystem';
import LifestyleRatio from '../components/LifestyleRatio';
import ExpensePrediction from '../components/ExpensePrediction';
import WhatIfSimulator from '../components/WhatIfSimulator';
import ReportExporter from '../components/ReportExporter';
import CurrencyConverter from '../components/CurrencyConverter';
import CurrencySetup from '../components/CurrencySetup';

import { getHealthScore } from '../utils/healthCalc';
import { exportToCSV } from '../utils/exportUtils';
import { formatAmount, getCurrency } from '../utils/currency';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('transaction');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [autoCategorizingTitle, setAutoCategorizingTitle] = useState('');
  const [showCurrencySetup, setShowCurrencySetup] = useState(!localStorage.getItem('currency'));
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'General', type: 'expense' });
  const [budgetData, setBudgetData] = useState({ category: 'Food', limit: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [resTx, resBg] = await Promise.all([
        axios.get('http://localhost:5050/api/v1/get-transactions', { headers }),
        axios.get('http://localhost:5050/api/v1/budgets/report', { headers })
      ]);
      setTransactions(Array.isArray(resTx.data) ? resTx.data : []);
      setBudgets(Array.isArray(resBg.data) ? resBg.data : []);
    } catch (err) { console.error('Fetch Error:', err); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!formData.title || formData.title.length < 3) return;
    const timer = setTimeout(async () => {
      try {
        setAutoCategorizingTitle('...');
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:5050/api/v1/ai/categorize',
          { title: formData.title },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormData(prev => ({ ...prev, category: res.data.category }));
        setAutoCategorizingTitle(res.data.category);
        setTimeout(() => setAutoCategorizingTitle(''), 2000);
      } catch { setAutoCategorizingTitle(''); }
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.title]);

  const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = income - expenses;
  const healthScore = getHealthScore(income, expenses, budgets);
  const filteredTransactions = categoryFilter ? transactions.filter(t => t.category === categoryFilter) : transactions;
  const currency = getCurrency();

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5050/api/v1/add-transaction', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal(); fetchData();
    } catch { alert('Error adding transaction'); }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5050/api/v1/budgets/add', budgetData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal(); fetchData();
    } catch { alert('Error setting budget'); }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/v1/delete-transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { alert('Delete failed'); }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ title: '', amount: '', category: 'General', type: 'expense' });
    setBudgetData({ category: 'Food', limit: '' });
  };

  if (showCurrencySetup) return <CurrencySetup onComplete={() => setShowCurrencySetup(false)} />;

  return (
    <div className="flex min-h-screen" style={{ background: '#F0F4F3' }}>
      <Sidebar />

      <main className="flex-1 ml-64 p-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black" style={{ color: '#111827' }}>Dashboard</h2>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => exportToCSV(transactions)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: '#FFFFFF', color: '#6B7280', border: '1px solid #E5EDE9' }}>
              <Download size={15}/> Export
            </button>
            <button onClick={() => { setModalMode('budget'); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: '#F0FDF4', color: '#059669', border: '1px solid #BBF7D0' }}>
              <Target size={15}/> Set Budget
            </button>
            <button onClick={() => { setModalMode('transaction'); setShowModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
              <PlusCircle size={15}/> Add Transaction
            </button>
          </div>
        </header>

        {/* Nudges */}
        <div className="mb-6">
          <NudgeSystem transactions={transactions} />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <StatCard label="Total Balance" value={formatAmount(balance)}
            gradient="linear-gradient(135deg, #059669, #34d399)" dark />
          <StatCard label="Total Income" value={formatAmount(income)}
            bg="#FFFFFF" border="#E5EDE9" valueColor="#059669"
            icon={<TrendingUp size={16}/>} iconBg="#F0FDF4" iconColor="#059669" />
          <StatCard label="Total Expenses" value={formatAmount(expenses)}
            bg="#FFFFFF" border="#E5EDE9" valueColor="#ef4444"
            icon={<TrendingDown size={16}/>} iconBg="#FEF2F2" iconColor="#ef4444" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-5 mb-5">
          <div className="col-span-8 rounded-2xl p-6"
            style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <h3 className="font-black mb-5" style={{ color: '#111827' }}>Activity Overview</h3>
            <div className="h-64"><HistoryChart transactions={transactions} /></div>
          </div>
          <div className="col-span-4">
            <HealthScoreCard score={healthScore} />
          </div>
        </div>

        {/* Budgets + Transactions + Pie */}
        <div className="grid grid-cols-12 gap-5 mb-5">
          <div className="col-span-4 rounded-2xl p-6"
            style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <h3 className="font-black mb-4" style={{ color: '#111827' }}>Category Budgets</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {budgets.length > 0 ? budgets.map(b => (
                <BudgetCard key={b.category} {...b} />
              )) : (
                <div className="text-center py-8 rounded-xl border border-dashed"
                  style={{ borderColor: '#E5EDE9', color: '#9CA3AF', fontSize: '13px' }}>
                  No budgets set yet
                </div>
              )}
            </div>
          </div>

          <div className="col-span-4 rounded-2xl p-6"
            style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black" style={{ color: '#111827' }}>
                {categoryFilter ? `${categoryFilter}` : 'Recent Transactions'}
              </h3>
              {categoryFilter && (
                <button onClick={() => setCategoryFilter(null)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold"
                  style={{ background: '#F0FDF4', color: '#059669', border: '1px solid #BBF7D0' }}>
                  <Filter size={11}/> Clear
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTransactions.slice(0, 6).map(tx => (
                <TxItem key={tx._id} tx={tx} onDelete={deleteTransaction} />
              ))}
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8" style={{ color: '#9CA3AF', fontSize: '13px' }}>
                  No transactions found
                </div>
              )}
            </div>
          </div>

          <div className="col-span-4 rounded-2xl p-6"
            style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <h3 className="font-black mb-4" style={{ color: '#111827' }}>Expense Breakup</h3>
            <div className="h-64">
              <CategoryChart transactions={transactions} onCategoryClick={cat => setCategoryFilter(cat)} />
            </div>
          </div>
        </div>

        {/* Lifestyle Ratio */}
        <div className="mb-5">
          <LifestyleRatio transactions={transactions} />
        </div>

        {/* AI Row */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <ExpensePrediction />
          <WhatIfSimulator />
        </div>

        {/* Export + Currency */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <ReportExporter transactions={transactions} budgets={budgets} />
          <CurrencyConverter />
        </div>

      </main>

      <AIAdvisorBot />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-3xl p-8 relative"
            style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <button onClick={closeModal} className="absolute top-6 right-6"
              style={{ color: '#9CA3AF' }}><X size={20}/></button>

            <div className="flex rounded-xl p-1 mb-6" style={{ background: '#F0F4F3' }}>
              {['transaction', 'budget'].map(mode => (
                <button key={mode} onClick={() => setModalMode(mode)}
                  className="flex-1 py-2.5 rounded-lg font-bold text-sm capitalize transition-all"
                  style={{
                    background: modalMode === mode ? '#FFFFFF' : 'transparent',
                    color: modalMode === mode ? '#059669' : '#9CA3AF',
                    boxShadow: modalMode === mode ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                  }}>
                  {mode}
                </button>
              ))}
            </div>

            {modalMode === 'transaction' ? (
              <div className="space-y-4">
                <ReceiptScanner onScanComplete={data => setFormData({ ...formData, title: data.title, amount: data.amount })} />
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: '#E5EDE9' }}/>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D1D5DB' }}>or manual</span>
                  <div className="flex-1 h-px" style={{ background: '#E5EDE9' }}/>
                </div>
                <form onSubmit={handleTxSubmit} className="space-y-3">
                  <div className="relative">
                    <input type="text" placeholder="Title (e.g. Zomato, Netflix...)"
                      className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all"
                      style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      onFocus={e => e.target.style.borderColor = '#059669'}
                      onBlur={e => e.target.style.borderColor = '#E5EDE9'}
                      required />
                    {autoCategorizingTitle && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: '#F0FDF4', color: '#059669' }}>
                        {autoCategorizingTitle === '...' ? '🤖 detecting...' : `✓ ${autoCategorizingTitle}`}
                      </span>
                    )}
                  </div>
                  <input type="number" placeholder="Amount"
                    className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all"
                    style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    onFocus={e => e.target.style.borderColor = '#059669'}
                    onBlur={e => e.target.style.borderColor = '#E5EDE9'}
                    required />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'type', options: [['expense','Expense'],['income','Income']] },
                      { key: 'category', options: [['General','General'],['Food','Food'],['Rent','Rent'],['Shopping','Shopping'],['Entertainment','Entertainment'],['Transport','Transport'],['Health','Health'],['Education','Education']] }
                    ].map(sel => (
                      <select key={sel.key} value={formData[sel.key]}
                        onChange={e => setFormData({ ...formData, [sel.key]: e.target.value })}
                        className="px-4 py-3.5 rounded-xl font-bold text-sm outline-none"
                        style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#059669' }}>
                        {sel.options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    ))}
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                    Save Transaction
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <p className="text-sm" style={{ color: '#6B7280' }}>Set a monthly spending limit per category.</p>
                <select value={budgetData.category}
                  onChange={e => setBudgetData({ ...budgetData, category: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl font-bold text-sm outline-none"
                  style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#059669' }}>
                  {['Food','Rent','Shopping','Entertainment','General','Transport','Health','Education'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input type="number" placeholder={`Monthly Limit (${currency.symbol})`}
                  className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all"
                  style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
                  value={budgetData.limit}
                  onChange={e => setBudgetData({ ...budgetData, limit: Number(e.target.value) })}
                  onFocus={e => e.target.style.borderColor = '#059669'}
                  onBlur={e => e.target.style.borderColor = '#E5EDE9'}
                  required />
                <button type="submit"
                  className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                  Set Budget
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, gradient, dark, bg, border, valueColor, icon, iconBg, iconColor }) => (
  <div className="rounded-2xl p-6 relative overflow-hidden"
    style={{ background: gradient || bg, border: gradient ? 'none' : `1px solid ${border}` }}>
    {gradient && <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-20" style={{ background: 'white' }}/>}
    <p className="text-xs font-bold uppercase tracking-wider mb-3"
      style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>{label}</p>
    <div className="flex items-center justify-between">
      <p className="text-3xl font-black" style={{ color: dark ? 'white' : valueColor }}>{value}</p>
      {icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
      )}
    </div>
  </div>
);

const TxItem = ({ tx, onDelete }) => (
  <div className="flex items-center justify-between p-3 rounded-xl group transition-all hover:shadow-sm"
    style={{ background: '#F9FAFB', border: '1px solid #E5EDE9' }}>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: tx.type === 'income' ? '#F0FDF4' : '#FEF2F2' }}>
        {tx.type === 'income'
          ? <TrendingUp size={14} style={{ color: '#059669' }}/>
          : <TrendingDown size={14} style={{ color: '#ef4444' }}/>}
      </div>
      <div>
        <p className="font-bold text-sm" style={{ color: '#111827' }}>{tx.title}</p>
        <p className="text-xs" style={{ color: '#9CA3AF' }}>{tx.category}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <p className="font-black text-sm"
        style={{ color: tx.type === 'income' ? '#059669' : '#ef4444' }}>
        {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
      </p>
      <button onClick={() => onDelete(tx._id)}
        className="opacity-0 group-hover:opacity-100 transition-all"
        style={{ color: '#D1D5DB' }}>
        <Trash2 size={13}/>
      </button>
    </div>
  </div>
);

export default Dashboard;