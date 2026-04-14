import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, TrendingDown, LogOut, Leaf } from 'lucide-react';
import { getCurrency } from '../utils/currency';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = getCurrency();

  const navItems = [
    { icon: <LayoutDashboard size={18}/>, label: 'Dashboard', path: '/dashboard' },
    { icon: <TrendingUp size={18}/>, label: 'Incomes', path: '/incomes' },
    { icon: <TrendingDown size={18}/>, label: 'Expenses', path: '/expenses' },
  ];

  return (
    <aside className="w-64 fixed h-full flex flex-col z-40"
      style={{ background: '#FFFFFF', borderRight: '1px solid #E5EDE9' }}>

      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: '#E5EDE9' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            <Leaf size={17} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none" style={{ color: '#111827' }}>SpendWise</h1>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{currency.flag} {currency.code}</p>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="mx-4 mt-5 p-3 rounded-2xl" style={{ background: '#F0F4F3' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: '#111827' }}>{user.name || 'User'}</p>
            <p className="text-xs font-medium" style={{ color: '#059669' }}>Pro Account</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-6 space-y-1">
        <p className="text-xs font-bold px-3 mb-3 uppercase tracking-widest" style={{ color: '#D1D5DB' }}>
          Menu
        </p>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                background: active ? '#F0FDF4' : 'transparent',
                color: active ? '#059669' : '#6B7280',
                borderLeft: active ? '3px solid #059669' : '3px solid transparent',
              }}>
              {item.icon}
              <span>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#059669' }}/>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: '#E5EDE9' }}>
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
          style={{ color: '#ef4444', background: '#FEF2F2' }}>
          <LogOut size={17}/> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;