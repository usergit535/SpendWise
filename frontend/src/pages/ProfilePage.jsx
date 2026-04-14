import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Mail, Lock, Globe, Save, CheckCircle } from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
];

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'INR');
  const [saved, setSaved] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const inputStyle = { background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' };

  const saveProfile = () => {
    localStorage.setItem('currency', currency);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    window.location.reload(); // refresh currency display
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F0F4F3' }}>
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-black" style={{ color: '#111827' }}>Profile Settings</h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Manage your account and preferences</p>
        </header>

        <div className="max-w-2xl space-y-5">

          {/* Account Info */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <h3 className="font-black mb-4" style={{ color: '#111827' }}>Account Info</h3>
            <div className="space-y-3">
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }}/>
                <input type="text" placeholder="Your name" defaultValue={user.name || ''}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl outline-none text-sm"
                  style={inputStyle}/>
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }}/>
                <input type="email" placeholder="Your email" defaultValue={user.email || ''}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl outline-none text-sm"
                  style={inputStyle}/>
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} style={{ color: '#059669' }}/>
              <h3 className="font-black" style={{ color: '#111827' }}>Currency Preference</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {CURRENCIES.map(c => (
                <button key={c.code} onClick={() => setCurrency(c.code)}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: currency === c.code ? '#F0FDF4' : '#F9FAFB',
                    border: `1px solid ${currency === c.code ? '#059669' : '#E5EDE9'}`,
                  }}>
                  <p className="text-lg">{c.flag}</p>
                  <p className="font-black text-sm mt-1" style={{ color: currency === c.code ? '#059669' : '#111827' }}>
                    {c.symbol} {c.code}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{c.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} style={{ color: '#059669' }}/>
              <h3 className="font-black" style={{ color: '#111827' }}>Change Password</h3>
            </div>
            <div className="space-y-3">
              {['Current password', 'New password', 'Confirm new password'].map((ph, i) => (
                <input key={i} type="password" placeholder={ph}
                  className="w-full px-4 py-3.5 rounded-xl outline-none text-sm"
                  style={inputStyle}/>
              ))}
            </div>
          </div>

          {/* Save */}
          <button onClick={saveProfile}
            className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            {saved ? <><CheckCircle size={16}/> Saved!</> : <><Save size={16}/> Save Changes</>}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;