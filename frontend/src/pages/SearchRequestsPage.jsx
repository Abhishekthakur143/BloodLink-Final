import { useState, useEffect, useRef } from 'react';
import { getBloodRequests } from '../api/bloodRequest';
import { donateBlood } from '../api/donation';
 
const URGENCY_CONFIG = {
  critical: { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5', label: '🚨 CRITICAL', pulse: true },
  urgent:   { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', label: '⚡ URGENT',   pulse: false },
  normal:   { color: '#059669', bg: '#DCFCE7', border: '#86EFAC', label: '✅ NORMAL',   pulse: false },
};
 
const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
 
const HERO_STATS = [
  { icon: '🩸', value: '12,400+', label: 'Requests Fulfilled' },
  { icon: '❤️', value: '8,200+', label: 'Lives Saved' },
  { icon: '👥', value: '35,000+', label: 'Active Donors' },
  { icon: '⚡', value: '< 1 hr', label: 'Avg Match Time' },
];
 
function useCountUp(target, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numeric = parseInt(target.toString().replace(/[^0-9]/g, '')) || 0;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(p * numeric));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  const suffix = target.toString().replace(/[0-9,]/g, '');
  return val.toLocaleString() + suffix;
}
 
function StatCard({ icon, value, label, animate }) {
  const displayed = useCountUp(value, 1400, animate);
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.22)',
        borderRadius: 16,
        padding: '20px 16px',
        textAlign: 'center',
        transition: 'transform 0.2s',
        cursor: 'default',
        minWidth: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: 30, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{displayed}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
 
// Custom confirm modal — replaces window.confirm
function ConfirmModal({ request, onConfirm, onCancel }) {
  if (!request) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000, animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '36px 32px',
        maxWidth: 420, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        animation: 'scaleIn 0.25s ease',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🩸</div>
        <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800, color: '#111827' }}>
          Confirm Your Donation
        </h3>
        <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.6, margin: '0 0 8px' }}>
          You're about to donate blood for:
        </p>
        <div style={{ background: '#FEE2E2', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#991B1B', fontSize: 16 }}>
            {request.patientName} — {request.bloodGroup}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#DC2626' }}>
            {request.hospitalName}, {request.city}
          </p>
        </div>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 24 }}>
          Your act of kindness will save a life. Thank you! ❤️
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #E5E7EB',
            background: '#fff', color: '#374151', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s',
            boxShadow: '0 4px 14px rgba(220,38,38,0.35)',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Yes, Donate! 🩸
          </button>
        </div>
      </div>
    </div>
  );
}
 
// Toast notification
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: type === 'success' ? '#059669' : '#DC2626',
      color: '#fff', padding: '14px 20px', borderRadius: 12,
      fontWeight: 600, fontSize: 15,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideInRight 0.3s ease',
      maxWidth: 340,
    }}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, marginLeft: 4, padding: 0 }}>×</button>
    </div>
  );
}
 
export default function SearchRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donatingId, setDonatingId] = useState(null);
  const [confirmReq, setConfirmReq] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const feedRef = useRef(null);
 
  useEffect(() => {
    fetchRequests();
  }, []);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
 
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getBloodRequests();
      setRequests(res.data.data);
    } catch (err) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };
 
  const handleDonateClick = (req) => setConfirmReq(req);
 
  const handleConfirm = async () => {
    const req = confirmReq;
    setConfirmReq(null);
    setDonatingId(req._id);
    try {
      await donateBlood(req._id);
      setToast({ message: 'Donation confirmed! Thank you for saving a life. ❤️', type: 'success' });
      fetchRequests();
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to donate. Please try again.', type: 'error' });
    } finally {
      setDonatingId(null);
    }
  };
 
  const getUrgencyColor = (urgency) => URGENCY_CONFIG[urgency] || URGENCY_CONFIG.normal;
 
  const filtered = requests.filter(r => {
    const groupOk = filterGroup === 'All' || r.bloodGroup === filterGroup;
    const urgencyOk = filterUrgency === 'All' || r.urgency === filterUrgency;
    return groupOk && urgencyOk;
  });
 
  const criticalCount = requests.filter(r => r.urgency === 'critical').length;
 
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#F9FAFB', minHeight: '100vh' }}>
 
      {/* ───── HERO SECTION ───── */}
      <div style={{
        background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 35%, #DC2626 65%, #991B1B 100%)',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 20px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated rings */}
        {[500, 780, 1060].map((size, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: size, height: size, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
            transform: 'translate(-50%,-50%)',
            animation: `pulse-ring 5s ease-in-out infinite ${i * 1.4}s`,
            pointerEvents: 'none',
          }} />
        ))}
 
        {/* Floating blood drop watermark */}
        <svg style={{ position: 'absolute', right: '6%', top: '8%', opacity: 0.06, pointerEvents: 'none', animation: 'float 6s ease-in-out infinite' }}
          width="240" height="320" viewBox="0 0 260 340">
          <path d="M130 10 C130 10 10 160 10 220 C10 283 65 330 130 330 C195 330 250 283 250 220 C250 160 130 10 130 10Z" fill="white" />
        </svg>
        <svg style={{ position: 'absolute', left: '5%', bottom: '12%', opacity: 0.04, pointerEvents: 'none', animation: 'float 8s ease-in-out infinite 2s' }}
          width="140" height="190" viewBox="0 0 260 340">
          <path d="M130 10 C130 10 10 160 10 220 C10 283 65 330 130 330 C195 330 250 283 250 220 C250 160 130 10 130 10Z" fill="white" />
        </svg>
 
        {/* Critical alert badge */}
        {criticalCount > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 100, padding: '6px 20px', fontSize: 13,
            color: '#fff', marginBottom: 20, fontWeight: 700,
            backdropFilter: 'blur(8px)',
            animation: 'pulse-badge 2s ease-in-out infinite',
          }}>
            🚨 {criticalCount} Critical Request{criticalCount > 1 ? 's' : ''} Need Immediate Help
          </div>
        )}
 
        {/* Main heading */}
        <h1 style={{
          fontSize: 'clamp(34px, 5.5vw, 64px)',
          fontWeight: 800, color: '#fff',
          textAlign: 'center', lineHeight: 1.1,
          letterSpacing: '-1.5px', marginBottom: 16, maxWidth: 740,
        }}>
          Someone Needs Blood<br />
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>Right Now. Be Their Hero.</span>
        </h1>
 
        <p style={{
          fontSize: 18, color: 'rgba(255,255,255,0.72)',
          textAlign: 'center', maxWidth: 500, lineHeight: 1.7, marginBottom: 38,
        }}>
          Browse real-time blood requests from hospitals across the country. One donation can save up to 3 lives.
        </p>
 
        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}>
          <button onClick={() => feedRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: '#fff', color: '#DC2626', border: 'none',
            borderRadius: 100, padding: '14px 32px', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
          >
            🩸 View Blood Requests
          </button>
          <button onClick={() => feedRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: 'transparent', color: '#fff',
            border: '2px solid rgba(255,255,255,0.45)',
            borderRadius: 100, padding: '14px 32px', fontSize: 16, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; }}
          >
            🔍 Filter by Blood Group
          </button>
        </div>
 
        {/* Stats */}
        <div ref={statsRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 14, width: '100%', maxWidth: 820,
        }}>
          {HERO_STATS.map((s, i) => (
            <StatCard key={i} icon={s.icon} value={s.value} label={s.label} animate={statsVisible} />
          ))}
        </div>
 
        {/* Scroll arrow */}
        <div onClick={() => feedRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 1.5,
          textTransform: 'uppercase', cursor: 'pointer',
          animation: 'bounce 2s ease-in-out infinite',
        }}>
          <span>Scroll</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13L15 8" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
 
      {/* ───── FEED SECTION ───── */}
      <div ref={feedRef} style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 80px' }}>
 
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#991B1B', borderRadius: 100, padding: '6px 18px', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
            🩸 Live Blood Requests
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            Blood Requests Feed
          </h2>
          <p style={{ color: '#6B7280', marginTop: 8, fontSize: 15 }}>
            {requests.length} active requests — updated in real-time
          </p>
        </div>
 
        {/* Filters */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #F3F4F6', padding: '20px 24px',
          marginBottom: 28,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>
              Filter by Blood Group
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {BLOOD_GROUPS.map(g => (
                <button key={g} onClick={() => setFilterGroup(g)} style={{
                  padding: '5px 13px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  border: '1.5px solid',
                  borderColor: filterGroup === g ? '#DC2626' : '#E5E7EB',
                  background: filterGroup === g ? '#DC2626' : '#fff',
                  color: filterGroup === g ? '#fff' : '#6B7280',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>
              Filter by Urgency
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['All', 'critical', 'urgent', 'normal'].map(u => {
                const cfg = u === 'All' ? { color: '#374151', bg: '#F3F4F6', border: '#E5E7EB' } : URGENCY_CONFIG[u];
                const active = filterUrgency === u;
                return (
                  <button key={u} onClick={() => setFilterUrgency(u)} style={{
                    padding: '5px 13px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                    border: `1.5px solid ${active ? cfg.color : '#E5E7EB'}`,
                    background: active ? cfg.color : '#fff',
                    color: active ? '#fff' : '#6B7280',
                    cursor: 'pointer', transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}>
                    {u === 'All' ? 'All Urgency' : u.charAt(0).toUpperCase() + u.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
 
        {/* Request Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, animation: 'pulse 1.5s ease-in-out infinite', marginBottom: 16 }}>🩸</div>
            <p style={{ color: '#6B7280', fontWeight: 500, fontSize: 16 }}>Loading blood requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: '#fff', borderRadius: 20,
            border: '1px solid #F3F4F6',
          }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🤝</div>
            <p style={{ fontWeight: 700, fontSize: 18, color: '#374151', margin: 0 }}>No requests found</p>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8 }}>
              {filterGroup !== 'All' || filterUrgency !== 'All'
                ? 'Try adjusting your filters to see more results.'
                : 'No pending blood requests right now. Check back soon!'}
            </p>
            {(filterGroup !== 'All' || filterUrgency !== 'All') && (
              <button onClick={() => { setFilterGroup('All'); setFilterUrgency('All'); }} style={{
                marginTop: 16, padding: '10px 24px', borderRadius: 100,
                background: '#DC2626', color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((req, idx) => {
              const urgCfg = getUrgencyColor(req.urgency);
              const isDonating = donatingId === req._id;
              return (
                <div key={req._id} style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: `1px solid #F3F4F6`,
                  borderLeft: `5px solid ${urgCfg.color}`,
                  padding: '20px 24px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: 16,
                  transition: 'all 0.2s',
                  animation: `fadeInUp 0.35s ease ${idx * 0.05}s both`,
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Pulse dot for critical */}
                  {urgCfg.pulse && (
                    <div style={{
                      position: 'absolute', top: 18, right: 18,
                      width: 10, height: 10, borderRadius: '50%',
                      background: urgCfg.color,
                      boxShadow: `0 0 0 4px ${urgCfg.bg}`,
                      animation: 'pulse-dot 1.5s ease-in-out infinite',
                    }} />
                  )}
 
                  <div style={{ flex: 1 }}>
                    {/* Name + blood group */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#111827' }}>
                        {req.patientName}
                      </h3>
                      <span style={{
                        background: '#FEE2E2', color: '#991B1B',
                        borderRadius: 8, padding: '2px 10px',
                        fontSize: 14, fontWeight: 800,
                        border: '1px solid #FCA5A5',
                      }}>
                        {req.bloodGroup}
                      </span>
                      <span style={{
                        background: urgCfg.bg, color: urgCfg.color,
                        borderRadius: 100, padding: '2px 10px',
                        fontSize: 11, fontWeight: 700,
                        border: `1px solid ${urgCfg.border}`,
                        textTransform: 'uppercase', letterSpacing: 0.5,
                      }}>
                        {urgCfg.label}
                      </span>
                    </div>
 
                    {/* Hospital & City */}
                    <p style={{ margin: '0 0 4px', color: '#4B5563', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>🏥</span>
                      <strong>{req.hospitalName}</strong>
                      <span style={{ color: '#9CA3AF' }}>·</span>
                      <span style={{ color: '#6B7280' }}>{req.city}</span>
                    </p>
 
                    {/* Contact + Units */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <p style={{ margin: 0, color: '#6B7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>📞</span> {req.contactNumber}
                      </p>
                      <p style={{ margin: 0, color: '#6B7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>💉</span> <strong style={{ color: '#374151' }}>{req.units}</strong> units needed
                      </p>
                    </div>
                  </div>
 
                  {/* Donate button */}
                  <button
                    onClick={() => handleDonateClick(req)}
                    disabled={isDonating}
                    style={{
                      background: isDonating ? '#FCA5A5' : 'linear-gradient(135deg, #DC2626, #EF4444)',
                      color: '#fff', border: 'none',
                      borderRadius: 12, padding: '12px 24px',
                      fontSize: 14, fontWeight: 700,
                      cursor: isDonating ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                      boxShadow: isDonating ? 'none' : '0 4px 14px rgba(220,38,38,0.3)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                    onMouseEnter={e => { if (!isDonating) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {isDonating
                      ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Processing...</>
                      : '🩸 Donate Now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
 
      {/* Confirm Modal */}
      <ConfirmModal
        request={confirmReq}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmReq(null)}
      />
 
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
 
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%,-50%) scale(1.07); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.93); }
        }
        @keyframes pulse-badge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}