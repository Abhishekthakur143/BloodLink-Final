
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
 
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
 
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post('/auth/forgot-password',  { email });
      setStatus('success');
      setMessage(res.data.message || 'Reset link sent! Check your email.');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 40%, #DC2626 70%, #991B1B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background rings */}
      {[300, 500, 700].map((size, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: size, height: size, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
          animation: `pulse-ring ${4 + i}s ease-in-out infinite ${i * 1.2}s`,
        }} />
      ))}
 
      {/* Blood drop watermark */}
      <svg style={{ position: 'absolute', right: '5%', top: '10%', opacity: 0.05, pointerEvents: 'none' }}
        width="200" height="260" viewBox="0 0 260 340">
        <path d="M130 10 C130 10 10 160 10 220 C10 283 65 330 130 330 C195 330 250 283 250 220 C250 160 130 10 130 10Z" fill="white" />
      </svg>
 
      <div style={{
        background: '#fff', borderRadius: 24,
        padding: '40px 36px', width: '100%', maxWidth: 440,
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        animation: 'scaleIn 0.3s ease',
        position: 'relative', zIndex: 1,
      }}>
 
        {/* Top icon */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(220,38,38,0.3)',
          }}>
            🔐
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
            Forgot Password?
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>
 
        {/* Success state */}
        {status === 'success' ? (
          <div style={{ animation: 'scaleIn 0.3s ease' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
              border: '1.5px solid #6EE7B7',
              borderRadius: 14, padding: '20px',
              textAlign: 'center', marginBottom: 24,
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📧</div>
              <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#065F46', fontSize: 16 }}>
                Email Sent!
              </p>
              <p style={{ margin: 0, color: '#047857', fontSize: 14, lineHeight: 1.6 }}>
                {message}
              </p>
            </div>
            <div style={{
              background: '#FEF3C7', border: '1px solid #FCD34D',
              borderRadius: 10, padding: '12px 16px',
              fontSize: 13, color: '#92400E', marginBottom: 24,
            }}>
              ⏰ Link expires in <strong>15 minutes</strong>. Check spam folder too!
            </div>
            <Link to="/login" style={{
              display: 'block', textAlign: 'center',
              padding: '13px', borderRadius: 12,
              background: 'linear-gradient(135deg, #DC2626, #EF4444)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
            }}>
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            {/* Error message */}
            {status === 'error' && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 10, padding: '12px 16px',
                color: '#DC2626', fontSize: 13, fontWeight: 500,
                marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                ❌ {message}
              </div>
            )}
 
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1.5px solid #E5E7EB', fontSize: 14, color: '#111827',
                  outline: 'none', background: '#F9FAFB',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#DC2626'; e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
 
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: loading ? '#FCA5A5' : 'linear-gradient(135deg, #DC2626, #EF4444)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(220,38,38,0.3)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading
                ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Sending...</>
                : '📧 Send Reset Link'}
            </button>
 
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link to="/login" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = '#DC2626'}
                onMouseLeave={e => e.target.style.color = '#6B7280'}
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
 
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%,-50%) scale(1.06); opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
    );
}