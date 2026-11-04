import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
 
export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
 
  const strength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
 
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColor = ['', '#DC2626', '#D97706', '#2563EB', '#059669', '#065F46'];
  const s = strength();
 
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await axios.put(`/api/auth/reset-password/${token}`, { password });
      // Auto login — token save karo
      localStorage.setItem('token', res.data.token);
      setStatus('success');
      setMessage('Password reset successful! Redirecting...');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 35%, #4F46E5 65%, #6D28D9 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background rings */}
      {[280, 480, 680].map((size, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: size, height: size, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
          animation: `pulse-ring ${4 + i}s ease-in-out infinite ${i * 1.2}s`,
        }} />
      ))}
 
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
            background: 'linear-gradient(135deg, #4F46E5, #6D28D9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          }}>
            🔑
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
            Set New Password
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
            Choose a strong password for your BloodLink account
          </p>
        </div>
 
        {/* Success */}
        {status === 'success' ? (
          <div style={{ textAlign: 'center', animation: 'scaleIn 0.3s ease' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ margin: '0 0 8px', color: '#065F46', fontSize: 20, fontWeight: 800 }}>
              Password Reset!
            </h3>
            <p style={{ color: '#047857', fontSize: 14, marginBottom: 24 }}>
              {message}
            </p>
            <div style={{
              width: '100%', height: 4, background: '#E5E7EB',
              borderRadius: 100, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', background: '#059669',
                borderRadius: 100, animation: 'progress 2.5s linear forwards',
              }} />
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            {/* Error */}
            {status === 'error' && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 10, padding: '12px 16px',
                color: '#DC2626', fontSize: 13, fontWeight: 500,
                marginBottom: 20, display: 'flex', gap: 8,
              }}>
                ❌ {message}
              </div>
            )}
 
            {/* New password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '12px 44px 12px 16px',
                    borderRadius: 12, border: '1.5px solid #E5E7EB',
                    fontSize: 14, color: '#111827', outline: 'none',
                    background: '#F9FAFB', transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 16, color: '#9CA3AF', padding: 0,
                }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
 
              {/* Strength bar */}
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 100,
                        background: i <= s ? strengthColor[s] : '#E5E7EB',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: strengthColor[s] }}>
                    {strengthLabel[s]}
                  </p>
                </div>
              )}
            </div>
 
            {/* Confirm password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                Confirm Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${confirm && confirm !== password ? '#DC2626' : confirm && confirm === password ? '#059669' : '#E5E7EB'}`,
                  fontSize: 14, color: '#111827', outline: 'none',
                  background: '#F9FAFB', transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { if (!confirm || confirm === password) { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; }}}
                onBlur={e => { if (!confirm || confirm === password) { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}}
              />
              {confirm && confirm !== password && (
                <p style={{ margin: '5px 0 0', fontSize: 12, color: '#DC2626' }}>❌ Passwords don't match</p>
              )}
              {confirm && confirm === password && (
                <p style={{ margin: '5px 0 0', fontSize: 12, color: '#059669' }}>✅ Passwords match</p>
              )}
            </div>
 
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: loading ? '#C4B5FD' : 'linear-gradient(135deg, #4F46E5, #6D28D9)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(79,70,229,0.3)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading
                ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Resetting...</>
                : '🔑 Reset Password'}
            </button>
 
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link to="/login" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = '#4F46E5'}
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
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%,-50%) scale(1.06); opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}