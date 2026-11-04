import { useState, useRef, useEffect } from 'react';
import { chatWithAi } from '../api/ai';
 
export default function AIChatPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am BloodLink AI. Ask me about blood eligibility, compatibility, or camps!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
 
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);
 
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
 
    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);
 
    try {
      const res = await chatWithAi({ message: input });
      const botMsg = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Failed to connect to AI.' }]);
    }
    setLoading(false);
  };
 
  const suggestions = [
    'Who can donate blood?',
    'Blood type compatibility chart',
    'How often can I donate?',
    'Find camps near me'
  ];
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce1 { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        .msg-in { animation: fadeIn 0.25s ease-out both; }
        .dot { animation: bounce1 1.2s infinite ease-in-out; }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
 
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 flex flex-col h-[640px] overflow-hidden">
 
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
            <i className="ti ti-robot" style={{ fontSize: 20, color: '#fff' }}></i>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-base leading-tight">BloodLink AI</h2>
            <p className="text-red-50/80 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></span>
              Online — ask me anything
            </p>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <i className="ti ti-droplet" style={{ fontSize: 18, color: '#fff' }}></i>
          </div>
        </div>
 
        {/* Messages */}
        <div ref={scrollRef} className="flex-grow p-4 sm:p-5 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex msg-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2 shrink-0 self-end">
                  <i className="ti ti-robot" style={{ fontSize: 16, color: '#dc2626' }}></i>
                </div>
              )}
              <div
                className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
 
          {loading && (
            <div className="flex justify-start msg-in">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2 shrink-0 self-end">
                <i className="ti ti-robot" style={{ fontSize: 16, color: '#dc2626' }}></i>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md shadow-sm px-4 py-3 flex items-center gap-1.5">
                <span className="dot w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span className="dot w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span className="dot w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              </div>
            </div>
          )}
 
          {/* Suggestions — only show at start */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-2 msg-in">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs font-medium bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
 
        {/* Input */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-gray-100 flex items-center gap-2 shrink-0 bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about blood donation..."
            className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-11 h-11 shrink-0 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl flex items-center justify-center hover:from-red-700 hover:to-rose-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <i className="ti ti-send" style={{ fontSize: 18 }}></i>
          </button>
        </form>
      </div>
    </div>
  );
}