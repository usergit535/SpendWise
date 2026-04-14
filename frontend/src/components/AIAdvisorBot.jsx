import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, User, Sparkles, Leaf } from 'lucide-react';

const QUICK_QUESTIONS = [
  "Can I afford a ₹5000 purchase?",
  "Where am I overspending?",
  "How can I save more?",
  "What's my financial health?"
];

const AIAdvisorBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your SpendWise AI advisor 👋 Ask me anything about your finances!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5050/api/v1/ai/chat',
        { message: userText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, couldn't connect. Try again!" }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl flex items-center justify-center z-50 transition-all hover:scale-105 hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #059669, #34d399)', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}>
        {isOpen ? <X size={20} className="text-white"/> : <Sparkles size={20} className="text-white"/>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-88 flex flex-col z-50 overflow-hidden"
          style={{ width: '360px', height: '520px', background: '#FFFFFF', border: '1px solid #E5EDE9', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>

          {/* Header */}
          <div className="p-4 flex justify-between items-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20">
                <Leaf size={17} className="text-white"/>
              </div>
              <div>
                <p className="text-white font-black text-sm">SpendWise AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-200"/>
                  <p className="text-emerald-100 text-xs">Online · Financial advisor</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/15 text-white hover:bg-white/25 transition-all">
              <X size={15}/>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#F9FAFB' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                    <Bot size={13} className="text-white"/>
                  </div>
                )}
                <div className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #059669, #34d399)',
                    color: 'white',
                    borderBottomRightRadius: '6px'
                  } : {
                    background: '#FFFFFF',
                    color: '#374151',
                    border: '1px solid #E5EDE9',
                    borderBottomLeftRadius: '6px'
                  }}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: '#F0FDF4' }}>
                    <User size={13} style={{ color: '#059669' }}/>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                  <Bot size={13} className="text-white"/>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white" style={{ border: '1px solid #E5EDE9' }}>
                  <div className="flex gap-1.5 items-center h-4">
                    {[0,150,300].map(d => (
                      <span key={d} className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: '#059669', animationDelay: `${d}ms` }}/>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-3 flex flex-wrap gap-2 flex-shrink-0"
              style={{ borderTop: '1px solid #E5EDE9', background: '#FFFFFF' }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
                  style={{ background: '#F0FDF4', color: '#059669', border: '1px solid #BBF7D0' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 flex gap-3 flex-shrink-0"
            style={{ borderTop: '1px solid #E5EDE9', background: '#FFFFFF' }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your finances..."
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: '#F9FAFB', border: '1px solid #E5EDE9', color: '#111827' }}
              onFocus={e => e.target.style.borderColor = '#059669'}
              onBlur={e => e.target.style.borderColor = '#E5EDE9'}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95 disabled:opacity-40 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
              <Send size={15} className="text-white"/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAdvisorBot;