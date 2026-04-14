import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5050/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, id: res.data.id }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A0F' }}>
      
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f172a 100%)' }}>
        
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: '#7c3aed' }} />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full blur-3xl opacity-15"
          style={{ background: '#06b6d4' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-white font-black text-xl">SpendWise</span>
        </div>

        <div className="relative">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Take control of<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>your finances</span>
          </h2>
          <p style={{ color: '#6b7280' }} className="text-lg leading-relaxed">
            Track spending, set budgets, and get AI-powered insights — all in one place.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 mt-10">
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Tracked Monthly', value: '₹50M+' },
              { label: 'AI Insights', value: '∞' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white font-black text-2xl">{s.value}</p>
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#374151' }} className="relative text-sm">
          © 2026 SpendWise. Built for smart spenders.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
            <p style={{ color: '#6b7280' }}>Sign in to your SpendWise account</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block"
                style={{ color: '#6b7280' }}>Email</label>
              <input type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-4 rounded-xl outline-none text-white placeholder-gray-600 transition-all"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '15px'
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block"
                style={{ color: '#6b7280' }}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-4 rounded-xl outline-none text-white placeholder-gray-600 transition-all pr-12"
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '15px'
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#6b7280' }}>
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 active:scale-95 mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm" style={{ color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold" style={{ color: '#a78bfa' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;