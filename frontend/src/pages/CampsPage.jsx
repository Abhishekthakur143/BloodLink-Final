import { useState, useEffect, useRef } from 'react';
import { getCamps, registerForCamp } from '../api/camp';
 
// ── Custom Confirm Modal ──────────────────────────────────────────
function ConfirmModal({ camp, onConfirm, onCancel }) {
  if (!camp) return null;
  const slots = camp.totalSlots - camp.bookedSlots;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,10,40,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000, animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 22, padding: '36px 32px',
        maxWidth: 420, width: '90%',
        boxShadow: '0 28px 70px rgba(79,70,229,0.18)',
        animation: 'scaleIn 0.25s ease', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6D28D9, #4F46E5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 18px',
        }}>🏕️</div>
        <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800, color: '#1E1B4B' }}>
          Confirm Registration
        </h3>
        <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>
          You're registering for:
        </p>
        <div style={{
          background: 'linear-gradient(135deg, #EDE9FE, #E0E7FF)',
          borderRadius: 14, padding: '14px 18px', marginBottom: 22,
          border: '1px solid #C4B5FD',
        }}>
          <p style={{ margin: '0 0 4px', fontWeight: 800, color: '#4C1D95', fontSize: 16 }}>{camp.title}</p>
          <p style={{ margin: 0, fontSize: 13, color: '#6D28D9' }}>
            📅 {new Date(camp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#7C3AED' }}>
            🪑 {slots} slot{slots !== 1 ? 's' : ''} remaining
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px', borderRadius: 12,
            border: '1.5px solid #E5E7EB', background: '#fff',
            color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6D28D9, #4F46E5)',
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s',
            boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Yes, Register! 🎟️
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ── Toast ─────────────────────────────────────────────────────────
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
      animation: 'slideInRight 0.3s ease', maxWidth: 360,
    }}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none',
        color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20, padding: 0,
      }}>×</button>
    </div>
  );
}
 
// ── Slot progress bar ─────────────────────────────────────────────
function SlotBar({ booked, total }) {
  const pct = total > 0 ? Math.round((booked / total) * 100) : 0;
  const color = pct >= 90 ? '#DC2626' : pct >= 60 ? '#D97706' : '#059669';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Slots filled</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ background: '#F3F4F6', borderRadius: 100, height: 7, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color,
          borderRadius: 100,
          transition: 'width 0.8s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{booked} booked</span>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{total - booked} left</span>
      </div>
    </div>
  );
}
 
// ── Hero stats ────────────────────────────────────────────────────
const HERO_STATS = [
  { icon: '🏕️', value: '340+', label: 'Camps Organized' },
  { icon: '🧑‍🤝‍🧑', value: '28,000+', label: 'Donors Joined' },
  { icon: '🩸', value: '95,000+', label: 'Units Collected' },
  { icon: '🌆', value: '120+', label: 'Cities Covered' },
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
 
function StatPill({ icon, value, label, animate }) {
  const displayed = useCountUp(value, 1400, animate);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 14, padding: '18px 14px',
      textAlign: 'center', transition: 'transform 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{displayed}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{label}</div>
    </div>
  );
}
 
// ── MAIN COMPONENT ────────────────────────────────────────────────
export default function CampsPage() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmCamp, setConfirmCamp] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);
  const [toast, setToast] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'slots'
  const statsRef = useRef(null);
  const campsRef = useRef(null);
 
  useEffect(() => { fetchCamps(); }, []);
 
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);
 
  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await getCamps();
      setCamps(res.data.data);
    } catch (err) {
      console.error('Failed to fetch camps');
    } finally {
      setLoading(false);
    }
  };
 
  const handleRegisterClick = (camp) => setConfirmCamp(camp);
 
  const handleConfirm = async () => {
    const camp = confirmCamp;
    setConfirmCamp(null);
    setRegisteringId(camp._id);
    try {
      await registerForCamp(camp._id);
      setToast({ message: 'Successfully registered! See you at the camp 🎟️', type: 'success' });
      fetchCamps();
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setRegisteringId(null);
    }
  };
 
  const sorted = [...camps].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
    return (b.totalSlots - b.bookedSlots) - (a.totalSlots - a.bookedSlots);
  });
 
  const upcoming = camps.filter(c => new Date(c.date) >= new Date()).length;
 
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#F5F3FF', minHeight: '100vh' }}>
 
      {/* ═══════ HERO ═══════ */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 30%, #4F46E5 60%, #6D28D9 100%)',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 20px', position: 'relative', overflow: 'hidden',
      }}>
 
        {/* Star-field dots */}
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.35)',
            top: `${Math.sin(i * 7.3) * 45 + 50}%`,
            left: `${Math.cos(i * 5.1) * 48 + 50}%`,
            animation: `twinkle ${2 + (i % 4) * 0.7}s ease-in-out infinite ${(i % 5) * 0.4}s`,
            pointerEvents: 'none',
          }} />
        ))}
 
        {/* Calendar watermark */}
        <svg style={{ position: 'absolute', right: '4%', bottom: '10%', opacity: 0.05, pointerEvents: 'none' }}
          width="220" height="220" viewBox="0 0 100 100">
          <rect x="5" y="15" width="90" height="80" rx="8" fill="white" />
          <rect x="5" y="15" width="90" height="22" rx="8" fill="white" />
          <rect x="25" y="5" width="8" height="18" rx="4" fill="white" />
          <rect x="67" y="5" width="8" height="18" rx="4" fill="white" />
          {[0,1,2,3,4,5].map(row => [0,1,2,3,4,5,6].map(col => (
            <rect key={`${row}-${col}`} x={12 + col * 13} y={44 + row * 10}
              width="8" height="6" rx="2" fill="white" opacity="0.6" />
          )))}
        </svg>
 
        {/* Tent watermark top-left */}
        <svg style={{ position: 'absolute', left: '3%', top: '8%', opacity: 0.04, pointerEvents: 'none', animation: 'float 7s ease-in-out infinite' }}
          width="180" height="150" viewBox="0 0 200 160">
          <polygon points="100,10 5,150 195,150" fill="white" />
          <rect x="78" y="100" width="44" height="50" fill="white" />
        </svg>
 
        {/* Badge */}
        <div style={{
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 100, padding: '7px 22px', fontSize: 13,
          color: 'rgba(255,255,255,0.9)', marginBottom: 24, fontWeight: 600,
          backdropFilter: 'blur(8px)', letterSpacing: 0.8,
        }}>
          🗓️ Blood Donation Camps — Open for Registration
        </div>
 
        <h1 style={{
          fontSize: 'clamp(30px, 5.2vw, 60px)',
          fontWeight: 800, color: '#fff', textAlign: 'center',
          lineHeight: 1.1, letterSpacing: '-1.5px',
          marginBottom: 18, maxWidth: 700,
        }}>
          Find a Camp Near You.<br />
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Show Up. Save Lives.</span>
        </h1>
 
        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.65)',
          textAlign: 'center', maxWidth: 490, lineHeight: 1.7, marginBottom: 42,
        }}>
          Browse upcoming blood donation camps in your area. Register in one tap — your slot is confirmed instantly.
        </p>
 
        {/* CTA row */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
          <button onClick={() => campsRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{
            background: '#fff', color: '#4F46E5', border: 'none',
            borderRadius: 100, padding: '14px 32px', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
          >
            🏕️ Browse Camps
          </button>
          <div style={{
            background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)',
            borderRadius: 100, padding: '14px 24px', fontSize: 15, fontWeight: 600,
            color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)',
          }}>
            📅 {upcoming} Upcoming This Month
          </div>
        </div>
 
        {/* Stats */}
        <div ref={statsRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 14, width: '100%', maxWidth: 780,
        }}>
          {HERO_STATS.map((s, i) => (
            <StatPill key={i} icon={s.icon} value={s.value} label={s.label} animate={statsVisible} />
          ))}
        </div>
 
        {/* Scroll indicator */}
        <div onClick={() => campsRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: 1.5,
          textTransform: 'uppercase', cursor: 'pointer',
          animation: 'bounce 2s ease-in-out infinite',
        }}>
          <span>Scroll</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13L15 8" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
 
      {/* ═══════ CAMPS SECTION ═══════ */}
      <div ref={campsRef} style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 20px 90px' }}>
 
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#EDE9FE', color: '#5B21B6',
            borderRadius: 100, padding: '6px 18px', fontSize: 13, fontWeight: 600, marginBottom: 14,
          }}>
            🗓️ Upcoming Camps
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: '#1E1B4B', margin: 0, letterSpacing: '-0.5px' }}>
            Blood Donation Camps
          </h2>
          <p style={{ color: '#6B7280', marginTop: 8, fontSize: 15 }}>
            {camps.length} camp{camps.length !== 1 ? 's' : ''} available — register before slots fill up
          </p>
        </div>
 
        {/* Toolbar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12, marginBottom: 28,
          background: '#fff', borderRadius: 14,
          border: '1px solid #EDE9FE', padding: '14px 20px',
          boxShadow: '0 2px 12px rgba(79,70,229,0.06)',
        }}>
          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Sort by:</span>
            {[{ val: 'date', label: '📅 Date' }, { val: 'slots', label: '🪑 Slots' }].map(s => (
              <button key={s.val} onClick={() => setSortBy(s.val)} style={{
                padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                border: '1.5px solid',
                borderColor: sortBy === s.val ? '#4F46E5' : '#E5E7EB',
                background: sortBy === s.val ? '#4F46E5' : '#fff',
                color: sortBy === s.val ? '#fff' : '#6B7280',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {s.label}
              </button>
            ))}
          </div>
 
          {/* View toggle */}
          <div style={{ display: 'flex', gap: 6, background: '#F5F3FF', borderRadius: 10, padding: 4 }}>
            {[{ val: 'grid', icon: '⊞' }, { val: 'list', icon: '≡' }].map(v => (
              <button key={v.val} onClick={() => setViewMode(v.val)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 16,
                border: 'none',
                background: viewMode === v.val ? '#4F46E5' : 'transparent',
                color: viewMode === v.val ? '#fff' : '#9CA3AF',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {v.icon}
              </button>
            ))}
          </div>
        </div>
 
        {/* Camp cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite' }}>🏕️</div>
            <p style={{ color: '#6B7280', fontWeight: 500, fontSize: 16 }}>Loading camps...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: '#fff', borderRadius: 20,
            border: '1px solid #EDE9FE',
          }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🏕️</div>
            <p style={{ fontWeight: 700, fontSize: 18, color: '#1E1B4B', margin: 0 }}>No upcoming camps</p>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8 }}>
              Check back soon — new camps are added regularly!
            </p>
          </div>
        ) : (
          <div style={{
            display: viewMode === 'grid'
              ? 'grid'
              : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
            flexDirection: viewMode === 'list' ? 'column' : undefined,
            gap: 20,
          }}>
            {sorted.map((camp, idx) => {
              const slotsAvail = camp.totalSlots - camp.bookedSlots;
              const isFull = slotsAvail === 0;
              const isRegistering = registeringId === camp._id;
              const pct = camp.totalSlots > 0 ? Math.round((camp.bookedSlots / camp.totalSlots) * 100) : 0;
              const isAlmostFull = pct >= 80 && !isFull;
              const campDate = new Date(camp.date);
              const isToday = campDate.toDateString() === new Date().toDateString();
              const isPast = campDate < new Date() && !isToday;
 
              return (
                <div key={camp._id} style={{
                  background: '#fff',
                  borderRadius: 18,
                  border: `1px solid ${isFull ? '#FEE2E2' : '#EDE9FE'}`,
                  overflow: 'hidden',
                  transition: 'all 0.25s',
                  animation: `fadeInUp 0.38s ease ${idx * 0.06}s both`,
                  opacity: isPast ? 0.7 : 1,
                  display: viewMode === 'list' ? 'flex' : 'flex',
                  flexDirection: viewMode === 'list' ? 'row' : 'column',
                  alignItems: viewMode === 'list' ? 'stretch' : undefined,
                }}
                  onMouseEnter={e => {
                    if (!isPast) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 36px rgba(79,70,229,0.12)';
                      e.currentTarget.style.borderColor = '#C4B5FD';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = isFull ? '#FEE2E2' : '#EDE9FE';
                  }}
                >
                  {/* Date ribbon */}
                  <div style={{
                    background: isFull
                      ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
                      : isPast
                        ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
                        : 'linear-gradient(135deg, #4F46E5, #6D28D9)',
                    padding: viewMode === 'list' ? '0 20px' : '18px 20px 14px',
                    display: 'flex',
                    flexDirection: viewMode === 'list' ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: viewMode === 'list' ? 'center' : 'space-between',
                    minWidth: viewMode === 'list' ? 100 : undefined,
                    gap: 8,
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: viewMode === 'list' ? 26 : 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                        {campDate.getDate()}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {campDate.toLocaleDateString('en-IN', { month: 'short' })}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                        {campDate.getFullYear()}
                      </div>
                    </div>
                    {isToday && (
                      <span style={{
                        background: '#FDE68A', color: '#92400E',
                        borderRadius: 100, padding: '2px 10px',
                        fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                      }}>TODAY</span>
                    )}
                    {isAlmostFull && !isFull && (
                      <span style={{
                        background: 'rgba(255,255,255,0.2)', color: '#fff',
                        borderRadius: 100, padding: '2px 10px',
                        fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                        animation: 'pulse-badge 2s ease-in-out infinite',
                      }}>ALMOST FULL</span>
                    )}
                    {isFull && (
                      <span style={{
                        background: '#FEE2E2', color: '#991B1B',
                        borderRadius: 100, padding: '2px 10px',
                        fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                      }}>FULL</span>
                    )}
                  </div>
 
                  {/* Content */}
                  <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <h3 style={{
                      margin: '0 0 6px', fontSize: 16, fontWeight: 800,
                      color: isFull ? '#9CA3AF' : '#1E1B4B', lineHeight: 1.3,
                    }}>
                      {camp.title}
                    </h3>
                    <p style={{ margin: '0 0 14px', color: '#6B7280', fontSize: 13, lineHeight: 1.6 }}>
                      {camp.description}
                    </p>
 
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      {[
                        { icon: '🏢', text: camp.organizer },
                        { icon: '📍', text: camp.address },
                      ].map((row, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 13, flexShrink: 0 }}>{row.icon}</span>
                          <span style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.4 }}>{row.text}</span>
                        </div>
                      ))}
                    </div>
 
                    {/* Slot progress */}
                    <div style={{ marginBottom: 18 }}>
                      <SlotBar booked={camp.bookedSlots} total={camp.totalSlots} />
                    </div>
 
                    {/* Register button */}
                    {isFull ? (
                      <button disabled style={{
                        width: '100%', padding: '11px', borderRadius: 12,
                        background: '#F3F4F6', color: '#9CA3AF',
                        border: 'none', fontSize: 14, fontWeight: 600,
                        cursor: 'not-allowed', marginTop: 'auto',
                      }}>
                        🚫 House Full
                      </button>
                    ) : isPast ? (
                      <button disabled style={{
                        width: '100%', padding: '11px', borderRadius: 12,
                        background: '#F3F4F6', color: '#9CA3AF',
                        border: 'none', fontSize: 14, fontWeight: 600,
                        cursor: 'not-allowed', marginTop: 'auto',
                      }}>
                        ⏰ Camp Ended
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterClick(camp)}
                        disabled={isRegistering}
                        style={{
                          width: '100%', padding: '11px', borderRadius: 12, border: 'none',
                          background: isRegistering
                            ? '#C4B5FD'
                            : 'linear-gradient(135deg, #4F46E5, #6D28D9)',
                          color: '#fff', fontSize: 14, fontWeight: 700,
                          cursor: isRegistering ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s', marginTop: 'auto',
                          boxShadow: isRegistering ? 'none' : '0 4px 14px rgba(79,70,229,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                        onMouseEnter={e => { if (!isRegistering) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        {isRegistering
                          ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Registering...</>
                          : '🎟️ Register for Camp'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
 
      {/* Modals & Toasts */}
      <ConfirmModal camp={confirmCamp} onConfirm={handleConfirm} onCancel={() => setConfirmCamp(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
 
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
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
          from { opacity: 0; transform: translateY(18px); }
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
          50% { box-shadow: 0 0 0 5px rgba(255,255,255,0); }
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