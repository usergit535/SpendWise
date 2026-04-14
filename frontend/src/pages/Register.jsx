import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post('http://localhost:5050/api/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    background: '#F9FAFB',
    border: '1px solid #E5EDE9',
    color: '#111827'
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#F0F4F3' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            <Leaf size={18} className="text-white"/>
          </div>
          <span className="font-black text-xl" style={{ color: '#111827' }}>SpendWise</span>
        </div>

        <div className="rounded-3xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
          <h2 className="text-2xl font-black mb-1" style={{ color: '#111827' }}>Create account</h2>
          <p className="text-sm mb-7" style={{ color: '#6B7280' }}>Start your financial journey today</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { label: 'Full Name', type: 'text', placeholder: 'Your name', val: name, set: setName },
              { label: 'Email', type: 'email', placeholder: 'you@example.com', val: email, set: setEmail },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
                  style={{ color: '#6B7280' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={f.val} onChange={e => f.set(e.target.value)} required
                  className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#059669'}
                  onBlur={e => e.target.style.borderColor = '#E5EDE9'}
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
                style={{ color: '#6B7280' }}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3.5 rounded-xl outline-none text-sm transition-all pr-12"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#059669'}
                  onBlur={e => e.target.style.borderColor = '#E5EDE9'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#9CA3AF' }}>
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{ color: '#059669' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;